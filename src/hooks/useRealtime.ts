import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { Player, RoomState } from '../types';

const RETRY_DELAY = 3000;

export function useRealtime(roomId: string, playerConfig?: { name: string; avatar: string }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [myId, setMyId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAdmin = !playerConfig;

  // Keep playerId across effect re-runs
  const playerIdRef = useRef<string>('');
  const isMountedRef = useRef(false);

  const startConnection = useCallback(() => {
    if (!roomId) return;

    let cancelled = false;
    let roomChannel: ReturnType<typeof supabase.channel> | null = null;
    let playersChannel: ReturnType<typeof supabase.channel> | null = null;
    let updateBuffer: any[] = [];
    let updateTimer: ReturnType<typeof setTimeout> | null = null;
    let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

    const applyBufferedUpdates = () => {
      if (cancelled) return;
      const currentBuffer = [...updateBuffer];
      updateBuffer = [];

      setPlayers(prev => {
        let next = [...prev];
        for (const payload of currentBuffer) {
          if (payload.eventType === 'INSERT') {
            if (!next.find((p: any) => p.id === payload.new.id)) {
              next.push(payload.new as Player);
            }
          } else if (payload.eventType === 'UPDATE') {
            next = next.map((p: any) => p.id === payload.new.id ? payload.new as Player : p);
          } else if (payload.eventType === 'DELETE') {
            next = next.filter((p: any) => p.id !== payload.old.id);
          }
        }
        return next;
      });
    };

    const scheduleFlush = () => {
      if (updateTimer) clearTimeout(updateTimer);
      updateTimer = setTimeout(() => {
        applyBufferedUpdates();
        updateTimer = null;
      }, 80);
    };

    const init = async () => {
      try {
        setError(null);

        if (isAdmin) {
          const { data: existingRoom, error: roomErr } = await supabase
            .from('rooms')
            .select('*')
            .eq('code', roomId)
            .single();

          if (cancelled) return;

          if (roomErr && roomErr.code !== 'PGRST116') {
            // PGRST116 = no rows found, which is expected for new rooms
            setError('فشل الاتصال بقاعدة البيانات');
            return;
          }

          let rData: RoomState | null = null;
          if (existingRoom && (existingRoom.status === 'playing' || existingRoom.status === 'explaining' || existingRoom.status === 'leaderboard')) {
            rData = existingRoom as RoomState;
          } else {
            const { data, error: upsertErr } = await supabase
              .from('rooms')
              .upsert({
                code: roomId,
                status: 'lobby',
                current_question_index: 0,
                question_timer: 40,
                show_answer: false
              })
              .select()
              .single();
            if (cancelled) return;

            if (upsertErr) {
              setError('فشل إنشاء الغرفة');
              return;
            }
            rData = data as RoomState | null;
          }

          if (rData && !cancelled) setRoomState(rData);

          const { data: pData } = await supabase
            .from('players')
            .select('*')
            .eq('room_code', roomId);
          if (pData && !cancelled) setPlayers(pData);

        } else {
          const { data: rData, error: roomErr } = await supabase
            .from('rooms')
            .select('*')
            .eq('code', roomId)
            .single();

          if (cancelled) return;

          if (roomErr) {
            setError('رمز الغرفة غير صحيح');
            return;
          }

          if (rData && !cancelled) setRoomState(rData as RoomState);

          const savedPlayerId = localStorage.getItem(`player_id_${roomId}`);
          let existingPlayer: Player | null = null;

          if (savedPlayerId) {
            const { data: pByOldId } = await supabase.from('players').select('*').eq('id', savedPlayerId).single();
            if (pByOldId && pByOldId.room_code === roomId) {
              existingPlayer = pByOldId as Player;
            }
          }

          if (!existingPlayer) {
            const { data: pByName } = await supabase
              .from('players')
              .select('*')
              .eq('room_code', roomId)
              .eq('name', playerConfig!.name)
              .single();
            if (pByName) {
              existingPlayer = pByName as Player;
            }
          }

          if (cancelled) return;

          if (existingPlayer) {
            playerIdRef.current = existingPlayer.id;
            if (!cancelled) setMyId(playerIdRef.current);
            localStorage.setItem(`player_id_${roomId}`, playerIdRef.current);

            await supabase.from('players').update({
              status: 'idle',
              avatar: playerConfig!.avatar
            }).eq('id', playerIdRef.current);

          } else {
            playerIdRef.current = Math.random().toString(36).substring(2, 10);
            if (!cancelled) setMyId(playerIdRef.current);
            localStorage.setItem(`player_id_${roomId}`, playerIdRef.current);

            await supabase.from('players').insert({
              id: playerIdRef.current,
              room_code: roomId,
              name: playerConfig!.name,
              avatar: playerConfig!.avatar,
              score: 0,
              streak: 0,
              status: 'idle'
            });
          }

          const { data: pData } = await supabase
            .from('players')
            .select('*')
            .eq('room_code', roomId);
          if (pData && !cancelled) setPlayers(pData);
        }

        if (cancelled) return;

        // Room subscription
        roomChannel = supabase.channel(`room_sync_${roomId}`, {
          config: { broadcast: { self: false } }
        })
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'rooms', filter: `code=eq.${roomId}` },
            (payload) => {
              if (cancelled) return;
              setRoomState(payload.new as RoomState);
            }
          )
          .subscribe();

        // Players subscription with batched updates
        playersChannel = supabase.channel(`players_sync_${roomId}`, {
          config: { broadcast: { self: false } }
        })
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'players', filter: `room_code=eq.${roomId}` },
            (payload) => {
              if (cancelled) return;
              updateBuffer.push(payload);
              if (!updateTimer) scheduleFlush();
            }
          )
          .subscribe();

        // Heartbeat
        if (!isAdmin) {
          heartbeatInterval = setInterval(() => {
            if (playerIdRef.current) {
              supabase.from('players').update({
                status: playersRef.current.find(p => p.id === playerIdRef.current)?.status || 'idle'
              }).eq('id', playerIdRef.current).then();
            }
          }, 15000);
        }

        setError(null);

      } catch (err) {
        if (!cancelled) {
          console.error("Error in realtime setup:", err);
          setError('حدث خطأ في الاتصال، جاري إعادة المحاولة...');
        }
      }
    };

    init();

    // Store cleanup
    cleanupRef.current = () => {
      cancelled = true;
      if (updateTimer) clearTimeout(updateTimer);
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (roomChannel) supabase.removeChannel(roomChannel);
      if (playersChannel) supabase.removeChannel(playersChannel);

      if (!isAdmin && playerIdRef.current) {
        supabase.from('players').update({ status: 'offline' }).eq('id', playerIdRef.current).then();
      }
    };

  }, [roomId, isAdmin, playerConfig?.name, playerConfig?.avatar]);

  // Manage connection lifecycle
  useEffect(() => {
    isMountedRef.current = true;

    // Kill any pending retry on re-mount
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }

    startConnection();

    return () => {
      isMountedRef.current = false;
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [startConnection]);

  // Retry on error
  useEffect(() => {
    if (error && isMountedRef.current) {
      retryTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          if (cleanupRef.current) cleanupRef.current();
          cleanupRef.current = null;
          startConnection();
        }
      }, RETRY_DELAY);
    }
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [error, startConnection]);

  // Refs kept in sync
  const roomStateRef = useRef<RoomState | null>(null);
  const playersRef = useRef<Player[]>([]);
  useEffect(() => { roomStateRef.current = roomState; }, [roomState]);
  useEffect(() => { playersRef.current = players; }, [players]);

  const updateMyState = useCallback(async (updates: Partial<Player>) => {
    if (isAdmin || !playerIdRef.current) return;

    setPlayers(prev => prev.map(p => p.id === playerIdRef.current ? { ...p, ...updates } : p));
    await supabase.from('players').update(updates).eq('id', playerIdRef.current);
  }, [isAdmin]);

  const broadcastState = useCallback(async (newState: Partial<RoomState>) => {
    if (!isAdmin) return;

    setRoomState(prev => prev ? { ...prev, ...newState } : newState as RoomState);
    await supabase.from('rooms').update(newState).eq('code', roomId);
  }, [roomId, isAdmin]);

  return {
    players,
    roomState,
    updateMyState,
    broadcastState,
    myId,
    error
  };
}
