import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Player, RoomState } from '../types';

export function useRealtime(roomId: string, playerConfig?: { name: string; avatar: string }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [myId, setMyId] = useState<string>('');
  const initialized = useRef(false);

  const isAdmin = !playerConfig;

  useEffect(() => {
    if (!roomId || initialized.current) return;
    initialized.current = true;

    let playerId = '';
    let roomChannel: any = null;
    let playersChannel: any = null;

    const initConnection = async () => {
      try {
        if (isAdmin) {
          // 1. Admin: Upsert the room in the database
          const { data: rData } = await supabase
            .from('rooms')
            .upsert({ 
              code: roomId, 
              status: 'lobby', 
              current_question_index: 0, 
              question_timer: 30, 
              show_answer: false 
            })
            .select()
            .single();
          
          if (rData) setRoomState(rData);

          // Fetch existing players in this room
          const { data: pData } = await supabase
            .from('players')
            .select('*')
            .eq('room_code', roomId);
          if (pData) setPlayers(pData);

        } else {
          // 2. Student: Fetch existing room
          const { data: rData } = await supabase
            .from('rooms')
            .select('*')
            .eq('code', roomId)
            .single();
          
          if (rData) setRoomState(rData);

          // Check if player with same name exists in this room
          const { data: existingPlayer } = await supabase
            .from('players')
            .select('*')
            .eq('room_code', roomId)
            .eq('name', playerConfig.name)
            .single();

          if (existingPlayer) {
            // Reconnect existing player!
            playerId = existingPlayer.id;
            setMyId(playerId);
            
            await supabase.from('players').update({
              status: 'idle',
              avatar: playerConfig.avatar
            }).eq('id', playerId);
            
          } else {
            // New player
            playerId = Math.random().toString(36).substring(2, 10);
            setMyId(playerId);
            
            await supabase.from('players').insert({
              id: playerId,
              room_code: roomId,
              name: playerConfig.name,
              avatar: playerConfig.avatar,
              score: 0,
              streak: 0,
              status: 'idle'
            });
          }

          // Fetch other players
          const { data: pData } = await supabase
            .from('players')
            .select('*')
            .eq('room_code', roomId);
          if (pData) setPlayers(pData);
        }

        // 3. Setup Postgres Subscriptions for Realtime UI Updates
        roomChannel = supabase.channel(`room_sync_${roomId}`)
          .on(
            'postgres_changes', 
            { event: '*', schema: 'public', table: 'rooms', filter: `code=eq.${roomId}` }, 
            (payload) => {
              setRoomState(payload.new as RoomState);
            }
          )
          .subscribe();

        // Buffer for players updates to prevent render locking with 40+ players
        let updateBuffer: any[] = [];
        let updateTimer: any = null;

        const applyBufferedUpdates = () => {
          const currentBuffer = [...updateBuffer];
          updateBuffer = [];
          
          setPlayers(prev => {
            let next = [...prev];
            for (const payload of currentBuffer) {
              if (payload.eventType === 'INSERT') {
                if (!next.find(p => p.id === payload.new.id)) {
                  next.push(payload.new as Player);
                }
              } else if (payload.eventType === 'UPDATE') {
                next = next.map(p => p.id === payload.new.id ? payload.new as Player : p);
              } else if (payload.eventType === 'DELETE') {
                next = next.filter(p => p.id !== payload.old.id);
              }
            }
            return next;
          });
        };

        const bufferUpdate = (payload: any) => {
          updateBuffer.push(payload);
          if (!updateTimer) {
            updateTimer = setTimeout(() => {
              applyBufferedUpdates();
              updateTimer = null;
            }, 50); // 50ms batch window
          }
        };

        playersChannel = supabase.channel(`players_sync_${roomId}`)
          .on(
            'postgres_changes', 
            { event: '*', schema: 'public', table: 'players', filter: `room_code=eq.${roomId}` }, 
            (payload) => {
              bufferUpdate(payload);
            }
          )
          .subscribe();

      } catch (error) {
        console.error("Error setting up realtime DB:", error);
      }
    };

    initConnection();

    // Cleanup on unmount
    return () => {
      if (roomChannel) supabase.removeChannel(roomChannel);
      if (playersChannel) supabase.removeChannel(playersChannel);
      
      // Mark player as offline instead of deleting so their score is saved
      if (!isAdmin && playerId) {
        supabase.from('players').update({ status: 'offline' }).eq('id', playerId).then();
      }
    };
  }, [roomId, isAdmin, playerConfig?.name, playerConfig?.avatar]);

  // Hook functions to mutate Database
  const updateMyState = useCallback(async (updates: Partial<Player>) => {
    if (isAdmin || !myId) return;
    
    // Optimistic UI update
    setPlayers(prev => prev.map(p => p.id === myId ? { ...p, ...updates } : p));
    
    // DB Update
    await supabase.from('players').update(updates).eq('id', myId);
  }, [myId, isAdmin]);

  const broadcastState = useCallback(async (newState: Partial<RoomState>) => {
    if (!isAdmin) return;
    
    // Optimistic UI update
    setRoomState(prev => prev ? { ...prev, ...newState } : newState as RoomState);
    
    // DB Update
    await supabase.from('rooms').update(newState).eq('code', roomId);
  }, [roomId, isAdmin]);

  return {
    players: players.filter(p => p.status !== 'offline'),
    roomState,
    updateMyState,
    broadcastState,
    myId
  };
}
