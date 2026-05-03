import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy } from 'lucide-react';
import { useRealtime } from '../hooks/useRealtime';
import { questions } from '../data/questions';
import { cn } from '../lib/utils';
import { InlineMath } from 'react-katex';
import { Whiteboard } from '../components/Whiteboard';
import { LeaderboardView } from '../components/LeaderboardView';

export const renderWithMath = (text: string) => {
  if (!text) return null;
  const parts = text.split('$');
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <InlineMath key={index} math={part} />;
    }
    return <span key={index}>{part}</span>;
  });
};

export function StudentRoom() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Recover state from location OR sessionStorage (to handle refreshes)
  const [sessionState, setSessionState] = useState<{ name: string; avatar: string } | null>(() => {
    if (location.state?.name) return location.state;
    const saved = sessionStorage.getItem(`room_session_${id}`);
    return saved ? JSON.parse(saved) : null;
  });
  
  const state = sessionState;

  useEffect(() => {
    if (!state?.name) {
      navigate('/');
    }
  }, [state, navigate]);

  const { roomState, players, updateMyState, myId } = useRealtime(id!, state ? { name: state.name, avatar: state.avatar } : undefined);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answerTimeBonus, setAnswerTimeBonus] = useState(0);

  const me = players.find(p => p.id === myId);

  const [timeLeft, setTimeLeft] = useState(20);

  // Smooth local timer independent of system clock
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (roomState?.status === 'playing' && !roomState.show_answer) {
      const localStartTime = Date.now();

      const tick = () => {
        const elapsed = Math.floor((Date.now() - localStartTime) / 1000);
        const remain = Math.max(0, 20 - elapsed);
        setTimeLeft(remain);
      };

      tick(); // run immediately
      interval = setInterval(tick, 500);
    } else {
      setTimeLeft(roomState?.show_answer ? 0 : 20);
    }

    return () => clearInterval(interval);
  }, [roomState?.status, roomState?.show_answer, roomState?.current_question_index]);

  // Ref to track which question index was already scored so we don't score twice
  const lastEvaluatedQ = useRef<number>(-1);

  // Reset local state when a new question starts
  useEffect(() => {
    setSelectedAnswer(null);
    setHasAnswered(false);
    setAnswerTimeBonus(0);
    // Only update DB status if we are actually starting a new question (not just a reveal)
    if (!roomState?.show_answer) {
      updateMyState({ status: 'idle' });
    }
  }, [roomState?.current_question_index]); // ONLY depend on question index for the reset

  // Handle Score Evaluation when Admin reveals answer
  useEffect(() => {
    if (roomState?.show_answer && roomState.current_question_index !== lastEvaluatedQ.current) {
      lastEvaluatedQ.current = roomState.current_question_index;

      if (hasAnswered && selectedAnswer !== null) {
        const isCorrect = selectedAnswer === questions[roomState.current_question_index].correctAnswerIndex;
        const timeBonus = answerTimeBonus; // precise time remaining

        const updates: any = { status: isCorrect ? 'correct' : 'wrong' };

        if (isCorrect) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10B981', '#B026FF', '#FFFFFF']
          });

          const newStreak = (me?.streak || 0) + 1;

          // Base points scale with question number (Q1=100, Q2=200, max=500)
          const basePoints = Math.min((roomState.current_question_index + 1) * 100, 500);

          // Precision Time Logic: Answering at 20s = 2x points, 0s = 1x points
          const timeMultiplier = 1 + (timeBonus / 20);

          const pointsMultiplier = newStreak >= 2 ? 2 : 1;

          // Exactly calculate and round the points
          const pointsGained = Math.round(basePoints * timeMultiplier * pointsMultiplier);

          updates.score = (me?.score || 0) + pointsGained;
          updates.streak = newStreak;
        } else {
          updates.streak = 0;
        }

        updateMyState(updates);
      } else {
        // Time ran out and didn't answer
        updateMyState({ status: 'wrong', streak: 0 });
      }
    }
  }, [roomState?.show_answer, roomState?.current_question_index, selectedAnswer, hasAnswered, answerTimeBonus, me?.score, me?.streak, updateMyState]);

  // Handle Answer Selection Initial
  const handleAnswer = (index: number) => {
    if (hasAnswered || roomState?.show_answer || timeLeft === 0) return;
    if (!roomState) return;

    setSelectedAnswer(index);
    setHasAnswered(true);
    setAnswerTimeBonus(timeLeft);
    updateMyState({ status: 'answered' }); // Generic status so others don't know the answer yet
  };

  if (!state) return null;

  if (!roomState) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-neon-purple animate-pulse text-2xl font-bold bg-space-blue">
        جاري الاتصال بقاعدة البيانات...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pt-24 flex flex-col items-center justify-center relative">

      {/* Top Bar for User Identity */}
      <div className="fixed top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 flex justify-between items-start z-50 pointer-events-none">

        {/* User Profile Pill */}
        <div className="glass-panel px-3 py-1.5 md:px-5 md:py-2 flex items-center gap-2 md:gap-3 pointer-events-auto bg-space-blue-light/95 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-full">
          <span className="text-xl md:text-2xl drop-shadow-md">{state.avatar}</span>
          <span className="font-bold text-sm md:text-base text-white whitespace-nowrap max-w-[80px] md:max-w-[150px] truncate">{state.name}</span>
          
          <div className="w-px h-5 md:h-6 bg-white/20 mx-0.5 md:mx-1" />
          
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="font-mono text-neon-purple font-black text-sm md:text-base tracking-widest drop-shadow-md mt-0.5">{me?.score || 0}</span>
            {me?.streak && me.streak >= 2 ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(249,115,22,0.2)] whitespace-nowrap"
                dir="ltr"
              >
                🔥 x{me.streak}
              </motion.div>
            ) : null}
          </div>
        </div>

        {/* Room Code Badge */}
        <div className="glass-panel px-3 py-1.5 md:px-4 md:py-2 opacity-90 text-[10px] md:text-sm tracking-widest font-mono font-bold border-white/10 pointer-events-auto flex items-center gap-1.5 md:gap-2 bg-black/40 rounded-full">
          <span className="text-gray-400">ROOM:</span>
          <span className="text-white drop-shadow-md">{id}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* LOBBY STATE */}
        {roomState.status === 'lobby' && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="text-center w-full max-w-lg"
          >
            <div className="glass-panel p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-neon-purple/20 to-transparent opacity-50 z-0 pointer-events-none" />
              <div className="relative z-10 w-32 h-32 mx-auto mb-8 shape-3d rounded-full bg-space-blue-light/50 p-2">
                <div className="absolute inset-0 bg-neon-purple/20 rounded-full animate-ping" />
                <div className="relative w-full h-full bg-gradient-to-tr from-space-blue to-space-blue-light rounded-full flex items-center justify-center text-7xl shadow-[0_0_40px_rgba(176,38,255,0.6)]">
                  <span className="drop-shadow-lg">{state.avatar}</span>
                </div>
              </div>
              <h2 className="relative z-10 text-4xl font-heading font-extrabold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-md">أنت جاهز يا {state.name}!</h2>
              <p className="relative z-10 text-xl text-gray-300 mb-8 font-medium">ننتظر المعلم لبدء التحدي...</p>

              <div className="relative z-10 flex flex-wrap justify-center gap-4">
                {players.map(p => (
                  <motion.div
                    key={p.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-14 h-14 rounded-full bg-gradient-to-b from-space-blue-light to-space-blue border border-glass-border flex items-center justify-center text-2xl tooltip shadow-lg"
                    title={p.name}
                  >
                    <span className="drop-shadow-md">{p.avatar}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* PLAYING STATE */}
        {roomState.status === 'playing' && (
          <motion.div
            key={`q-${roomState.current_question_index}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-4xl pt-4"
          >
            {/* Timer Bar */}
            <div className="w-full mb-8 relative">
              <div className="flex justify-between items-end mb-2 px-2">
                <span className="font-bold text-gray-300">الوقت المتبقي</span>
                <span
                  key={timeLeft > 5 ? 'safe' : 'danger'}
                  className={cn(
                    "text-3xl font-mono font-bold font-heading",
                    timeLeft > 10 ? "text-emerald-400" :
                      timeLeft > 5 ? "text-yellow-400" : "text-coral-red drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                  )}>
                  {roomState.show_answer ? "0" : timeLeft}
                </span>
              </div>
              <div className="w-full h-3 bg-[#161C2D] rounded-full overflow-hidden shadow-inner border border-white/5 relative">
                <motion.div
                  className={cn(
                    "h-full transition-colors duration-500",
                    timeLeft > 10 ? "bg-gradient-to-r from-emerald-500 to-emerald-400" :
                      timeLeft > 5 ? "bg-gradient-to-r from-yellow-500 to-yellow-400" : "bg-gradient-to-r from-coral-red to-red-500 shadow-[0_0_15px_rgba(255,99,71,0.5)]"
                  )}
                  initial={{ width: '100%' }}
                  animate={{ width: `${roomState.show_answer ? 0 : (timeLeft / 20) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>
            </div>

            <div className="glass-panel p-6 md:p-10 mb-6 bg-[#161C2D]/95 backdrop-blur-2xl shadow-2xl border border-white/10 relative overflow-hidden text-white">
              {/* Restrained decorative elements */}
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-neon-purple to-emerald-400" />
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-neon-purple rounded-full filter blur-[100px] opacity-20 pointer-events-none" />

              <div className="flex justify-between items-center mb-6 text-sm font-bold relative z-10 w-full">
                <span className="bg-neon-purple/20 text-neon-purple px-4 py-1.5 rounded-full border border-neon-purple/30">السؤال {roomState.current_question_index + 1}</span>
                <span className="bg-white/10 text-white/80 px-4 py-1.5 rounded-full border border-white/10">{questions[roomState.current_question_index].category}</span>
              </div>

              {questions[roomState.current_question_index].imageUrl && (
                <div className="w-full h-48 md:h-72 mb-8 rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative group flex items-center justify-center bg-[#161C2D]/80 z-10">
                  <img 
                    src={questions[roomState.current_question_index].imageUrl} 
                    alt="توضيح السؤال"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 relative z-10"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161C2D]/95 via-transparent to-transparent opacity-90 z-20 pointer-events-none" />
                </div>
              )}

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold mb-10 leading-normal md:leading-relaxed text-center drop-shadow-md relative z-10 text-white" dir="rtl">
                {renderWithMath(questions[roomState.current_question_index].text)}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {questions[roomState.current_question_index].options.map((opt, idx) => {

                  const isCorrect = idx === questions[roomState.current_question_index].correctAnswerIndex;
                  const isSelected = selectedAnswer === idx;
                  const showResultOverlay = roomState.show_answer || (hasAnswered && timeLeft === 0);

                  let btnClass = "btn-3d btn-3d-blue";

                  if (showResultOverlay) {
                    if (isCorrect) {
                      btnClass = "btn-3d btn-3d-emerald glow-success scale-[1.02] z-10 shadow-lg shadow-emerald-500/20";
                    } else if (isSelected && !isCorrect) {
                      btnClass = "btn-3d btn-3d-red";
                    } else {
                      btnClass = "btn-3d btn-3d-blue opacity-50 grayscale hover:scale-100 cursor-not-allowed";
                    }
                  } else if (isSelected) {
                    btnClass = "btn-3d btn-3d-purple glow-neon scale-[1.02] z-10";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={hasAnswered || showResultOverlay}
                      className={cn(
                        "p-6 rounded-2xl text-2xl md:text-3xl font-bold font-body transition-all duration-300 text-center flex items-center justify-center min-h-[100px]",
                        btnClass,
                        (!hasAnswered && !showResultOverlay) && "cursor-pointer hover:scale-[1.03] shadow-md shadow-black/20"
                      )}
                    >
                      <span className="drop-shadow-lg pointer-events-none">
                        {renderWithMath(opt)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence>
              {(roomState.show_answer) && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "glass-panel p-6 border-2",
                    selectedAnswer === questions[roomState.current_question_index].correctAnswerIndex
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-coral-red bg-coral-red/10"
                  )}
                >
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    {selectedAnswer === questions[roomState.current_question_index].correctAnswerIndex ? '🎉 رائع! إجابة صحيحة' : '💡 فكر مرة أخرى'}
                  </h3>
                  <p className="text-lg bg-space-blue/50 p-4 rounded-lg mt-4 leading-relaxed">
                    {questions[roomState.current_question_index].explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* EXPLAINING STATE */}
        {roomState.status === 'explaining' && (
          <motion.div
            key="explaining"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] w-full h-full"
          >
            <Whiteboard
              questionText={questions[roomState.current_question_index].text}
              options={questions[roomState.current_question_index].options}
              correctIndex={questions[roomState.current_question_index].correctAnswerIndex}
              explanation={questions[roomState.current_question_index].explanation}
              initialDataUrl={roomState.whiteboard_url}
              readOnly={true}
            />
          </motion.div>
        )}

        {/* LEADERBOARD STATE */}
        {roomState.status === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            className="w-full flex-1 flex flex-col justify-center items-center pb-20"
          >
            <LeaderboardView
              players={players}
              myId={myId}
              onRate={(star) => updateMyState({ status: `rated_${star}` })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
