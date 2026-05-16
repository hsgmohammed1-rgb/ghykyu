import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { User, Rocket } from 'lucide-react';
import { useRealtime } from '../hooks/useRealtime';
import { questions } from '../data/questions';
import { cn, getRandomAvatar } from '../lib/utils';
import { InlineMath } from 'react-katex';
import { Whiteboard } from '../components/Whiteboard';
import { LeaderboardView } from '../components/LeaderboardView';
import { useToast } from '../components/Toast';

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

function JoinForm({ roomId: initialRoomId, onJoin }: { roomId: string; onJoin: (name: string, avatar: string) => void }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(getRandomAvatar());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onJoin(name.trim(), avatar);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 md:p-12 max-w-md w-full relative z-10"
      >
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold mb-2 bg-gradient-to-r from-neon-purple to-blue-400 bg-clip-text text-transparent">
            انضم للتحدي
          </h1>
          <p className="text-sm md:text-base text-gray-300">رمز الغرفة: <span className="font-mono font-bold text-neon-purple tracking-widest">{initialRoomId}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="flex flex-col items-center justify-center mb-4 md:mb-6">
            <div className="relative group cursor-pointer" onClick={() => setAvatar(getRandomAvatar())}>
              <div className="w-20 h-20 md:w-24 md:h-24 bg-space-blue-light/50 rounded-full flex items-center justify-center text-4xl md:text-5xl shadow-inner border border-glass-border group-hover:border-neon-purple transition-all duration-300">
                <motion.div key={avatar} initial={{ scale: 0 }} animate={{ scale: 1 }} className="drop-shadow-lg">
                  {avatar}
                </motion.div>
              </div>
              <div className="absolute -bottom-2 bg-space-blue px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs border border-glass-border">
                تغيير
              </div>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 md:pr-4 pointer-events-none text-gray-400">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                maxLength={20}
                placeholder="اسمك المبدع..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-space-blue-light/50 border border-glass-border rounded-xl pr-10 md:pr-12 pl-3 md:pl-4 py-3 md:py-4 text-sm md:text-xl focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-3d btn-3d-purple py-3 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 font-heading font-extrabold text-lg md:text-xl group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
            <span className="relative z-10 drop-shadow-md">انضم للتحدي</span>
            <Rocket className="relative z-10 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform drop-shadow-md" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export function StudentRoom() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { addToast } = useToast();

  const [sessionState, setSessionState] = useState<{ name: string; avatar: string } | null>(() => {
    if (location.state?.name) return location.state;
    const saved = sessionStorage.getItem(`room_session_${id}`);
    return saved ? JSON.parse(saved) : null;
  });

  const handleJoin = (name: string, avatar: string) => {
    const data = { name, avatar };
    sessionStorage.setItem(`room_session_${id}`, JSON.stringify(data));
    setSessionState(data);
  };

  if (!sessionState) {
    return <JoinForm roomId={id!} onJoin={handleJoin} />;
  }

  return <RoomContent roomId={id!} sessionState={sessionState} />;
}

function RoomContent({ roomId, sessionState }: { roomId: string; sessionState: { name: string; avatar: string } }) {
  const { addToast } = useToast();
  const { roomState, players, updateMyState, myId, error } = useRealtime(roomId, sessionState);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answerTimeBonus, setAnswerTimeBonus] = useState(0);
  const [wasRefreshed, setWasRefreshed] = useState(false);

  const me = useMemo(() => players.find(p => p.id === myId), [players, myId]);

  const [timeLeft, setTimeLeft] = useState(40);

  useEffect(() => {
    const perfEntries = performance.getEntriesByType('navigation');
    if (perfEntries.length > 0) {
      const nav = perfEntries[0] as PerformanceNavigationTiming;
      if (nav.type === 'reload') {
        setWasRefreshed(true);
        addToast('🔄 تم إعادة تحميل الصفحة! لا تقلق، بياناتك محفوظة', 'info');
      }
    }
  }, [addToast]);

  useEffect(() => {
    if (wasRefreshed && roomState?.status === 'playing') {
      addToast('📡 تمت إعادة الاتصال! استمر في التحدي', 'success');
      setWasRefreshed(false);
    }
  }, [roomState?.status, wasRefreshed, addToast]);

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

  const lastEvaluatedQ = useRef<number>(-1);
  const prevQIndex = useRef<number>(-1);

  useEffect(() => {
    if (!roomState) return;
    if (roomState.current_question_index === prevQIndex.current) return;
    prevQIndex.current = roomState.current_question_index;
    setSelectedAnswer(null);
    setHasAnswered(false);
    setAnswerTimeBonus(0);
    lastEvaluatedQ.current = -1;

    if (!roomState.show_answer) {
      updateMyState({ status: 'idle' });
      setTimeLeft(40);
    }
  }, [roomState?.current_question_index]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (roomState?.show_answer && roomState.current_question_index !== lastEvaluatedQ.current) {
      lastEvaluatedQ.current = roomState.current_question_index;

      if (hasAnswered && selectedAnswer !== null) {
        const isCorrect = selectedAnswer === questions[roomState.current_question_index].correctAnswerIndex;
        const timeBonus = answerTimeBonus;

        const updates: any = { status: isCorrect ? 'correct' : 'wrong' };

        if (isCorrect) {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#10B981', '#B026FF', '#FFFFFF']
          });

          const newStreak = (me?.streak || 0) + 1;
          const basePoints = Math.min((roomState.current_question_index + 1) * 100, 500);
          const timeMultiplier = 1 + (timeBonus / 40);
          const pointsMultiplier = newStreak >= 2 ? 2 : 1;
          const pointsGained = Math.round(basePoints * timeMultiplier * pointsMultiplier);

          updates.score = (me?.score || 0) + pointsGained;
          updates.streak = newStreak;

          if (pointsGained >= 500) {
            addToast(`🎉 رائع! ${pointsGained} نقطة!`, 'success');
          } else if (pointsGained >= 200) {
            addToast(`🔥 ${pointsGained} نقطة!`, 'success');
          }
        } else {
          updates.streak = 0;
        }

        updateMyState(updates);
      } else {
        updateMyState({ status: 'wrong', streak: 0 });
        addToast('⏰ انتهى الوقت!', 'warning');
      }
    }
  }, [roomState?.show_answer, roomState?.current_question_index]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (index: number) => {
    if (hasAnswered || roomState?.show_answer || timeLeft === 0) return;
    if (!roomState) return;

    setSelectedAnswer(index);
    setHasAnswered(true);
    setAnswerTimeBonus(timeLeft);
    updateMyState({ status: 'answered' });
  };

  if (!roomState) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-space-blue">
        {error ? (
          <div className="text-center max-w-md">
            <div className="text-xl md:text-2xl text-coral-red font-bold mb-4">{error}</div>
            <p className="text-gray-400">جاري إعادة المحاولة...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-xl md:text-2xl text-neon-purple animate-pulse mb-4">جاري الاتصال بقاعدة البيانات...</div>
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
    <div className="min-h-screen p-3 md:p-4 pt-20 md:pt-24 flex flex-col items-center justify-center relative">

      {/* Top Bar */}
      <div className="fixed top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 flex justify-between items-start z-50 pointer-events-none">
        <div className="glass-panel px-2.5 py-1 md:px-5 md:py-2 flex items-center gap-1.5 md:gap-3 pointer-events-auto bg-space-blue-light/95 border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <span className="text-lg md:text-2xl drop-shadow-md">{sessionState.avatar}</span>
          <span className="font-bold text-xs md:text-base text-white whitespace-nowrap max-w-[60px] md:max-w-[150px] truncate">{sessionState.name}</span>

          <div className="w-px h-4 md:h-6 bg-white/20 mx-0.5 md:mx-1" />

          <div className="flex items-center gap-1 md:gap-2">
            <span className="font-mono text-neon-purple font-black text-sm md:text-base tracking-widest drop-shadow-md">{me?.score || 0}</span>
            {me?.streak && me.streak >= 2 ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1 md:px-2 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1 whitespace-nowrap"
                dir="ltr"
              >
                🔥 x{me.streak}
              </motion.div>
            ) : null}
          </div>
        </div>

        <div className="glass-panel px-2.5 py-1 md:px-4 md:py-2 opacity-90 text-[10px] md:text-sm tracking-widest font-mono font-bold border-white/10 pointer-events-auto flex items-center gap-1 md:gap-2 bg-black/40 rounded-full">
          <span className="text-gray-400 hidden md:inline">ROOM:</span>
          <span className="text-white drop-shadow-md">{roomId}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* LOBBY */}
        {roomState.status === 'lobby' && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="text-center w-full max-w-lg"
          >
            <div className="glass-panel p-6 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-neon-purple/20 to-transparent opacity-50 pointer-events-none" />
              <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 md:mb-8 shape-3d rounded-full bg-space-blue-light/50 p-2">
                <div className="absolute inset-0 bg-neon-purple/20 rounded-full animate-ping" />
                <div className="relative w-full h-full bg-gradient-to-tr from-space-blue to-space-blue-light rounded-full flex items-center justify-center text-5xl md:text-7xl">
                  <span className="drop-shadow-lg">{sessionState.avatar}</span>
                </div>
              </div>
              <h2 className="relative z-10 text-2xl md:text-4xl font-heading font-extrabold mb-2 md:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-md">أنت جاهز يا {sessionState.name}!</h2>
              <p className="relative z-10 text-lg md:text-xl text-gray-300 mb-6 md:mb-8 font-medium">ننتظر المعلمة لبدء التحدي...</p>

              <div className="relative z-10 flex flex-wrap justify-center gap-2 md:gap-4">
                {players.filter(p => p.status !== 'offline').map(p => (
                  <motion.div
                    key={p.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-space-blue-light to-space-blue border border-glass-border flex items-center justify-center text-lg md:text-2xl shadow-lg"
                    title={p.name}
                  >
                    <span className="drop-shadow-md">{p.avatar}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* PLAYING */}
        {roomState.status === 'playing' && (
          <motion.div
            key={`q-${roomState.current_question_index}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-4xl pt-2 md:pt-4"
          >
            {/* Timer Bar */}
            <div className="w-full mb-4 md:mb-8 relative">
              <div className="flex justify-between items-end mb-2 px-2">
                <span className="font-bold text-gray-300 text-sm md:text-base">الوقت المتبقي</span>
                <span
                  key={timeLeft > 5 ? 'safe' : 'danger'}
                  className={cn(
                    "text-2xl md:text-3xl font-mono font-bold font-heading",
                    timeLeft > 10 ? "text-emerald-400" :
                      timeLeft > 5 ? "text-yellow-400" : "text-coral-red drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                  )}>
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

            <div className="glass-panel p-4 md:p-10 mb-4 md:mb-6 bg-[#161C2D]/95 backdrop-blur-2xl shadow-2xl border border-white/10 relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-neon-purple to-emerald-400" />

              <div className="flex justify-between items-center mb-4 md:mb-6 text-xs md:text-sm font-bold relative z-10">
                <span className="bg-neon-purple/20 text-neon-purple px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-neon-purple/30">السؤال {roomState.current_question_index + 1}</span>
                <span className="bg-white/10 text-white/80 px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-white/10">{questions[roomState.current_question_index].category}</span>
              </div>

              {questions[roomState.current_question_index].imageUrl && (
                <div className="w-full h-48 md:h-80 mb-4 md:mb-6 rounded-xl md:rounded-2xl overflow-hidden border border-white/10 relative flex items-center justify-center bg-[#161C2D]/80 z-10 p-2 md:p-4">
                  <img
                    src={questions[roomState.current_question_index].imageUrl}
                    alt="توضيح السؤال"
                    className="w-full h-full object-contain relative z-10"
                    loading="lazy"
                  />
                </div>
              )}

              <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-extrabold mb-6 md:mb-10 leading-normal md:leading-relaxed text-center drop-shadow-md relative z-10 text-white" dir="rtl">
                {renderWithMath(questions[roomState.current_question_index].text)}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 relative z-10">
                {questions[roomState.current_question_index].options.map((opt, idx) => {

                  const isCorrect = idx === questions[roomState.current_question_index].correctAnswerIndex;
                  const isSelected = selectedAnswer === idx;
                  const showResultOverlay = roomState.show_answer || (hasAnswered && timeLeft === 0);

                  let btnClass = "btn-3d btn-3d-blue";

                  if (showResultOverlay) {
                    if (isCorrect) {
                      btnClass = "btn-3d btn-3d-emerald scale-[1.02] z-10";
                    } else if (isSelected && !isCorrect) {
                      btnClass = "btn-3d btn-3d-red";
                    } else {
                      btnClass = "btn-3d btn-3d-blue opacity-50 grayscale cursor-not-allowed";
                    }
                  } else if (isSelected) {
                    btnClass = "btn-3d btn-3d-purple scale-[1.02] z-10";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={hasAnswered || showResultOverlay}
                      className={cn(
                        "p-4 md:p-6 rounded-xl md:rounded-2xl text-xl md:text-3xl font-bold font-body transition-all duration-300 text-center flex items-center justify-center min-h-[70px] md:min-h-[100px]",
                        btnClass,
                        (!hasAnswered && !showResultOverlay) && "cursor-pointer hover:scale-[1.03]"
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
                    "glass-panel p-4 md:p-6 border-2",
                    selectedAnswer === questions[roomState.current_question_index].correctAnswerIndex
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-coral-red bg-coral-red/10"
                  )}
                >
                  <h3 className="text-lg md:text-xl font-bold mb-2 flex items-center gap-2">
                    {selectedAnswer === questions[roomState.current_question_index].correctAnswerIndex ? '🎉 رائع! إجابة صحيحة' : '💡 فكر مرة أخرى'}
                  </h3>
                  <p className="text-base md:text-lg bg-space-blue/50 p-3 md:p-4 rounded-lg mt-4 leading-relaxed">
                    {questions[roomState.current_question_index].explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* EXPLAINING */}
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

        {/* LEADERBOARD */}
        {roomState.status === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex-1 flex flex-col justify-center items-center pb-16 md:pb-20"
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
