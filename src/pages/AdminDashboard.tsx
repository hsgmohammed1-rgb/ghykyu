import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, Users, Trophy, ChevronRight, CheckCircle2, XCircle, Presentation, Link } from 'lucide-react';
import { useRealtime } from '../hooks/useRealtime';
import { questions } from '../data/questions';
import { cn } from '../lib/utils';
import { renderWithMath } from './StudentRoom';
import { Whiteboard } from '../components/Whiteboard';
import { LeaderboardView } from '../components/LeaderboardView';
import { useToast } from '../components/Toast';
import { supabase } from '../lib/supabase';

export function AdminDashboard() {
  const [roomId] = useState(() => {
    const saved = localStorage.getItem('admin_room_id');
    if (saved) return saved;
    const newId = Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem('admin_room_id', newId);
    return newId;
  });
  const { players, roomState, broadcastState, error } = useRealtime(roomId);
  const { addToast } = useToast();

  const currentQuestionRef = useRef(0);
  useEffect(() => {
    if (roomState) currentQuestionRef.current = roomState.current_question_index;
  }, [roomState?.current_question_index]);

  // Track auto-stop timeout so we can cancel it
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAutoStop = useCallback(() => {
    if (autoStopRef.current) {
      clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }
  }, []);

  const startGame = useCallback(() => {
    clearAutoStop();
    broadcastState({
      status: 'playing',
      current_question_index: 0,
      show_answer: false,
      question_timer: Math.floor(Date.now() / 1000) + 40
    });
    addToast('🚀 بدأ التحدي!', 'success');
  }, [broadcastState, addToast, clearAutoStop]);

  const endRoom = useCallback(async () => {
    if (confirm('هل أنت متأكد من إنهاء الغرفة وطرد جميع الطلاب؟')) {
      clearAutoStop();
      await supabase.from('rooms').delete().eq('code', roomId);
      await supabase.from('players').delete().eq('room_code', roomId);
      localStorage.removeItem('admin_room_id');
      window.location.reload();
    }
  }, [roomId, clearAutoStop]);

  const nextQuestion = useCallback(() => {
    const nextIdx = currentQuestionRef.current + 1;
    clearAutoStop();
    if (nextIdx < questions.length) {
      broadcastState({
        current_question_index: nextIdx,
        show_answer: false,
        question_timer: Math.floor(Date.now() / 1000) + 40
      });
    } else {
      broadcastState({ status: 'leaderboard' });
      addToast('🏆 انتهى التحدي!', 'success');
    }
  }, [broadcastState, addToast, clearAutoStop]);

  const stopTimer = useCallback(() => {
    clearAutoStop();
    setTimeLeft(0);
    broadcastState({ question_timer: 0, show_answer: true });
  }, [broadcastState, clearAutoStop]);

  const showExplanation = useCallback(() => {
    clearAutoStop();
    broadcastState({ status: 'explaining' });
  }, [broadcastState, clearAutoStop]);

  const [timeLeft, setTimeLeft] = useState(40);

  // Smooth timer - display only, no side effects
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (roomState?.status === 'playing' && !roomState.show_answer) {
      const localStartTime = Date.now();

      const tick = () => {
        const elapsed = Math.floor((Date.now() - localStartTime) / 1000);
        const remain = Math.max(0, 40 - elapsed);
        setTimeLeft(remain);
      };

      tick();
      interval = setInterval(tick, 500);
    } else {
      setTimeLeft(roomState?.show_answer ? 0 : 40);
    }

    return () => clearInterval(interval);
  }, [roomState?.status, roomState?.show_answer, roomState?.current_question_index]);

  // Separate auto-stop timer that handles timing out naturally
  useEffect(() => {
    if (roomState?.status !== 'playing' || roomState.show_answer) {
      clearAutoStop();
      return;
    }

    const localStartTime = Date.now();

    const checkTimeout = () => {
      const elapsed = Math.floor((Date.now() - localStartTime) / 1000);
      if (elapsed >= 41) { // 40s + 1s grace
        clearAutoStop();
        broadcastState({ show_answer: true });
      } else {
        autoStopRef.current = setTimeout(checkTimeout, 1000);
      }
    };

    autoStopRef.current = setTimeout(checkTimeout, 1000);

    return () => {
      clearAutoStop();
    };
  }, [roomState?.status, roomState?.show_answer, roomState?.current_question_index, broadcastState, clearAutoStop]);

  const activePlayers = useMemo(() => players.filter(p => p.status !== 'offline'), [players]);
  const sortedPlayers = useMemo(() => [...activePlayers].sort((a, b) => b.score - a.score), [activePlayers]);

  if (!roomState) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 mesh-bg">
        {error ? (
          <div className="text-center max-w-md">
            <div className="text-2xl text-coral-red font-bold mb-4">{error}</div>
            <p className="text-gray-400">جاري إعادة المحاولة...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-2xl text-neon-purple animate-pulse mb-4">جاري بناء الغرفة وقاعدة البيانات...</div>
            <div className="flex justify-center gap-2">
              <div className="w-3 h-3 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-3 h-3 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-3 h-3 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 relative">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">

        {/* Top Control Bar */}
        <div className="glass-panel p-4 md:p-6 flex flex-wrap gap-4 md:gap-6 justify-between items-center bg-space-blue-light/80">
          <div className="min-w-0">
            <h1 className="text-lg md:text-2xl font-heading font-bold bg-gradient-to-r from-neon-purple to-blue-400 bg-clip-text text-transparent">
              لوحة تحكم المعلمة
            </h1>
            <div className="flex items-center gap-2 md:gap-3 mt-2 flex-wrap">
              <span className="text-xs md:text-sm text-gray-400">رمز الغرفة:</span>
              <span className="text-xl md:text-3xl font-mono tracking-widest font-bold text-white bg-space-blue px-3 md:px-4 py-1 rounded-lg border border-glass-border">
                {roomId}
              </span>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/room/${roomId}`;
                  navigator.clipboard.writeText(url);
                  addToast('✅ تم نسخ رابط الغرفة!', 'success');
                }}
                className="bg-space-blue hover:bg-space-blue-light p-2 rounded-lg border border-glass-border text-neon-purple transition-colors flex items-center gap-1 md:gap-2 text-xs md:text-sm font-bold"
              >
                <Link size={16} /> نسخ الرابط
              </button>
              <button
                onClick={endRoom}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-2 md:px-3 py-2 rounded-lg transition-colors flex items-center gap-1 md:gap-2 text-xs md:text-sm font-bold"
              >
                <XCircle size={16} /> إنهاء الغرفة
              </button>
            </div>
          </div>

          <div className="flex gap-2 md:gap-4 flex-wrap">
            {roomState.status === 'lobby' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold flex items-center gap-2 glow-success text-sm md:text-base"
              >
                <Play size={18} /> بدء التحدي
              </motion.button>
            )}

            {roomState.status === 'playing' && (
              <>
                {!roomState.show_answer ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={stopTimer}
                    className="bg-coral-red hover:bg-red-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold flex items-center gap-2 text-sm md:text-base"
                  >
                    <Square size={18} /> إغلاق الإجابات
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={showExplanation}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold flex items-center gap-2 text-sm md:text-base"
                    >
                      <Presentation size={18} /> شرح السؤال
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextQuestion}
                      className="bg-neon-purple hover:bg-neon-purple-dark text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold flex items-center gap-2 glow-neon text-sm md:text-base"
                    >
                      السؤال التالي <ChevronRight size={18} />
                    </motion.button>
                  </>
                )}
              </>
            )}

            {roomState.status === 'explaining' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => broadcastState({ status: 'playing' })}
                className="bg-space-blue hover:bg-space-blue-light border border-glass-border text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold flex items-center gap-2 text-sm md:text-base"
              >
                <XCircle size={18} /> إنهاء الشرح
              </motion.button>
            )}

            {roomState.status === 'leaderboard' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  broadcastState({ status: 'lobby', current_question_index: 0, show_answer: false });
                  addToast('🔄 تم إعادة تعيين التحدي', 'info');
                }}
                className="bg-space-blue hover:bg-space-blue-light border border-glass-border text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold flex items-center gap-2 text-sm md:text-base"
              >
                <Users size={18} /> العودة للانتظار
              </motion.button>
            )}
          </div>
        </div>

        {/* Whiteboard Overlay */}
        {roomState.status === 'explaining' && (
          <Whiteboard
            questionText={questions[roomState.current_question_index].text}
            options={questions[roomState.current_question_index].options}
            correctIndex={questions[roomState.current_question_index].correctAnswerIndex}
            explanation={questions[roomState.current_question_index].explanation}
            onClose={() => broadcastState({ status: 'playing' })}
            onDraw={(dataUrl) => broadcastState({ whiteboard_url: dataUrl })}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Stage */}
          <div className="lg:col-span-2 glass-panel p-4 md:p-6 bg-space-blue-light/40 min-h-[400px] flex flex-col">
            <h2 className="text-lg md:text-xl font-heading font-bold mb-3 md:mb-4 flex items-center gap-2 text-gray-300">
              شاشة العرض الحالية
            </h2>

            <div className="flex-1 flex items-center justify-center bg-space-blue/50 rounded-xl border border-glass-border p-4 md:p-6 relative overflow-hidden">
              {roomState.status === 'lobby' && (
                <div className="text-center">
                  <Users className="w-12 h-12 md:w-16 md:h-16 text-gray-500 mx-auto mb-4 opacity-50" />
                  <p className="text-xl md:text-2xl text-gray-400 font-heading">في انتظار انضمام الطلاب...</p>
                </div>
              )}

              {roomState.status === 'playing' && (
                <div className="w-full">
                  <div className="w-full mb-6 md:mb-8 relative">
                    <div className="flex justify-between items-end mb-2 px-2">
                      <span className="font-bold text-gray-300 text-sm md:text-base">
                        السؤال {roomState.current_question_index + 1} / {questions.length}
                      </span>
                      <span
                        key={timeLeft > 5 ? 'safe' : 'danger'}
                        className={cn(
                          "text-2xl md:text-3xl font-mono font-bold font-heading",
                          timeLeft > 10 ? "text-emerald-400" :
                          timeLeft > 5 ? "text-yellow-400" : "text-coral-red drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                        )}
                      >
                        {roomState.show_answer ? "0" : timeLeft}
                      </span>
                    </div>
                    <div className="w-full h-2 md:h-3 bg-[#161C2D] rounded-full overflow-hidden shadow-inner border border-white/5 relative">
                      <motion.div
                        className={cn(
                          "h-full transition-colors duration-500",
                          timeLeft > 10 ? "bg-gradient-to-r from-emerald-500 to-emerald-400" :
                          timeLeft > 5 ? "bg-gradient-to-r from-yellow-500 to-yellow-400" : "bg-gradient-to-r from-coral-red to-red-500"
                        )}
                        initial={{ width: '100%' }}
                        animate={{ width: `${roomState.show_answer ? 0 : (timeLeft / 40) * 100}%` }}
                        transition={{ duration: 1, ease: 'linear' }}
                      />
                    </div>
                  </div>

                  {questions[roomState.current_question_index].imageUrl && (
                    <div className="w-full h-32 md:h-56 mb-4 rounded-xl overflow-hidden border border-white/10 relative flex items-center justify-center bg-[#161C2D]/80 z-10 p-2 md:p-3">
                      <img
                        src={questions[roomState.current_question_index].imageUrl}
                        alt="توضيح السؤال"
                        className="w-full h-full object-contain relative z-10"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="text-xl md:text-3xl font-heading mb-6 md:mb-8 leading-relaxed" dir="rtl">
                    {renderWithMath(questions[roomState.current_question_index].text)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 md:gap-4 mb-6 md:mb-8">
                    {questions[roomState.current_question_index].options.map((opt, idx) => (
                      <div key={idx} className={cn(
                        "p-3 md:p-4 rounded-xl border-2 text-base md:text-xl font-bold bg-space-blue-light/50",
                        roomState.show_answer && idx === questions[roomState.current_question_index].correctAnswerIndex ? "border-emerald-500 text-emerald-400 bg-emerald-500/10" : "border-white/10 text-white/70"
                      )}>
                        {renderWithMath(opt)}
                      </div>
                    ))}
                  </div>

                  {roomState.show_answer && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl"
                    >
                      <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2 text-sm md:text-base">
                        <CheckCircle2 size={18} /> الإجابة الصحيحة:
                      </h4>
                      <div className="text-lg md:text-xl">
                        {renderWithMath(questions[roomState.current_question_index].options[questions[roomState.current_question_index].correctAnswerIndex])}
                      </div>
                      <p className="text-gray-300 mt-4 text-xs md:text-sm bg-space-blue/50 p-3 md:p-4 rounded-lg">
                        {questions[roomState.current_question_index].explanation}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {roomState.status === 'leaderboard' && (
                <div className="w-full text-center py-4 bg-space-blue/50 rounded-xl overflow-hidden shadow-2xl relative border-2 border-yellow-400/30">
                  <LeaderboardView players={players} isAdmin={true} />
                </div>
              )}
            </div>
          </div>

          {/* Radar */}
          <div className="glass-panel p-4 md:p-6 bg-space-blue-light/40">
            <h2 className="text-lg md:text-xl font-heading font-bold mb-4 flex justify-between items-center">
              <span>رادار المراقبة</span>
              <span className="bg-space-blue px-3 py-1 rounded-full text-xs md:text-sm border border-glass-border">
                {activePlayers.length} متصل
              </span>
            </h2>

            <div className="space-y-2 md:space-y-3 max-h-[500px] md:max-h-[600px] overflow-y-auto overflow-x-hidden pr-1 md:pr-2 custom-scrollbar">
              <AnimatePresence>
                {sortedPlayers.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={cn(
                      "flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl border transition-colors relative",
                      player.status === 'correct' ? "bg-emerald-500/10 border-emerald-500/30" :
                      player.status === 'wrong' ? "bg-coral-red/10 border-coral-red/30" :
                      player.status === 'answered' ? "bg-blue-500/10 border-blue-500/30" :
                      player.status === 'thinking' ? "bg-yellow-500/10 border-yellow-500/30 animate-pulse" :
                      "bg-space-blue border-glass-border"
                    )}
                    layout
                  >
                    <div className="absolute -left-1.5 md:-left-2 -top-1.5 md:-top-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-space-blue-light border border-white/10 flex items-center justify-center text-[10px] md:text-xs font-bold text-gray-400">
                      {index + 1}
                    </div>
                    <div className="text-xl md:text-2xl bg-space-blue-light w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ml-1 flex-shrink-0">
                      {player.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm md:text-base truncate">{player.name}</div>
                      <div className="text-[10px] md:text-xs text-gray-400 flex items-center gap-1 md:gap-2">
                        نقاط: <span className="text-white font-mono">{player.score}</span>
                        {player.streak >= 2 && <span className="text-orange-400 flex items-center text-[10px] whitespace-nowrap" dir="ltr">🔥 x{player.streak}</span>}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {player.status === 'correct' && <CheckCircle2 className="text-emerald-500" size={18} />}
                      {player.status === 'wrong' && <XCircle className="text-coral-red" size={18} />}
                      {player.status === 'answered' && <CheckCircle2 className="text-blue-400" size={18} />}
                      {player.status === 'thinking' && <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {activePlayers.length === 0 && (
                <div className="text-center text-gray-500 py-10 opacity-50">
                  <div className="animate-ping w-3 h-3 bg-neon-purple rounded-full mx-auto mb-4" />
                  جاري البحث عن ترددات إشارة...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
