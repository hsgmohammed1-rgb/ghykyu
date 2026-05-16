import { useEffect, useState, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Award, Crown, Medal, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Player } from '../types';
import { cn } from '../lib/utils';

interface LeaderboardViewProps {
  players: Player[];
  myId?: string;
  isAdmin?: boolean;
  onRate?: (rating: number) => void;
}

export const LeaderboardView = memo(function LeaderboardView({ players, myId, isAdmin, onRate }: LeaderboardViewProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const top3 = sortedPlayers.slice(0, 3);
  const rest = sortedPlayers.slice(3);

  const ratedPlayers = players.filter(p => p.status?.startsWith('rated_'));
  const totalStars = ratedPlayers.reduce((acc, p) => acc + parseInt(p.status.split('_')[1] || '0'), 0);
  const avgRating = ratedPlayers.length > 0 ? (totalStars / ratedPlayers.length).toFixed(1) : "0.0";

  useEffect(() => {
    if (!showConfetti) return;
    let cancelled = false;
    const duration = 3000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (cancelled || Date.now() > end) return clearInterval(interval);
      confetti({
        particleCount: 12, angle: 60, spread: 55, origin: { x: 0 },
        colors: ['#FFD700', '#C0C0C0', '#CD7F32', '#B026FF']
      });
      confetti({
        particleCount: 12, angle: 120, spread: 55, origin: { x: 1 },
        colors: ['#FFD700', '#C0C0C0', '#CD7F32', '#B026FF']
      });
    }, 300);
    return () => { cancelled = true; clearInterval(interval); };
  }, [showConfetti]);

  const handleRate = (star: number) => {
    if (myRating > 0 || isAdmin) return;
    setMyRating(star);
    if (onRate) onRate(star);
  };

  const podiumColors = [
    { bg: 'from-yellow-600 via-yellow-500 to-yellow-400', border: 'border-yellow-300', shadow: 'rgba(255,215,0,0.5)', text: 'text-yellow-400', circle: 'border-yellow-400', circleShadow: 'rgba(255,215,0,0.8)', height: 'h-32 sm:h-44 md:h-52', avatar: 'text-3xl sm:text-5xl w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24', numSize: 'text-3xl sm:text-5xl md:text-6xl' },
    { bg: 'from-gray-600 via-gray-500 to-gray-400', border: 'border-gray-300', shadow: 'rgba(192,192,192,0.5)', text: 'text-gray-200', circle: 'border-gray-400', circleShadow: 'rgba(192,192,192,0.5)', height: 'h-24 sm:h-32 md:h-40', avatar: 'text-2xl sm:text-4xl w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20', numSize: 'text-2xl sm:text-4xl md:text-5xl' },
    { bg: 'from-amber-800 via-amber-700 to-amber-600', border: 'border-amber-500', shadow: 'rgba(205,127,50,0.5)', text: 'text-amber-500', circle: 'border-amber-600', circleShadow: 'rgba(205,127,50,0.5)', height: 'h-20 sm:h-24 md:h-32', avatar: 'text-xl sm:text-3xl w-9 h-9 sm:w-14 sm:h-14 md:w-16 md:h-16', numSize: 'text-2xl sm:text-3xl md:text-4xl' }
  ];

  if (sortedPlayers.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <Trophy size={64} className="text-yellow-500/30 mx-auto mb-4" />
          <h2 className="text-3xl font-heading font-bold text-gray-400 mb-2">لا يوجد متسابقون</h2>
          <p className="text-gray-500">لم يتم تسجيل أي مشاركين بعد</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-extrabold bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent flex justify-center items-center gap-1 sm:gap-3 mb-1 drop-shadow-lg">
          <Sparkles size={20} className="sm:size-[28px] text-yellow-400 hidden sm:block" />
          لوحة الشرف والبطولة
          <Sparkles size={20} className="sm:size-[28px] text-yellow-400 hidden sm:block" />
        </h2>
        <p className="text-gray-300 font-bold">أبطال التحدي</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {top3.length === 1 ? (
          <motion.div key="single" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex flex-col items-center">
              <Crown size={36} className="sm:size-[48px] text-yellow-400" style={{ filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.8))' }} />
              <div className="text-4xl sm:text-6xl bg-space-blue-light/80 w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center mx-auto border-4 border-yellow-400" style={{ boxShadow: '0 0 30px rgba(255,215,0,0.8)' }}>
                {top3[0].avatar}
              </div>
              <div className="text-lg sm:text-2xl font-bold text-yellow-400 mt-2">{top3[0].name}</div>
              <div className="text-yellow-200 font-mono font-bold text-base sm:text-xl">{top3[0].score} نقطة</div>
            </div>
          </motion.div>
        ) : (
            <div className="flex justify-center items-end h-52 sm:h-72 md:h-96 gap-1 sm:gap-2 md:gap-6 w-full max-w-2xl mx-auto mb-4 sm:mb-8 mt-2 sm:mt-6">
            {top3[1] && (
              <motion.div key="p2" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="flex flex-col items-center w-1/3"
              >
                <div className="mb-2 text-center relative max-w-full">
                  <Medal size={20} className="sm:size-[28px] absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 text-gray-400" style={{ filter: 'drop-shadow(0 0 10px rgba(192,192,192,0.5))' }} />
                  <div className={cn("bg-space-blue-light/80 flex items-center justify-center mx-auto border-4 shadow-lg relative z-10 rounded-full", podiumColors[1].circle, podiumColors[1].avatar)} style={{ boxShadow: `0 0 15px ${podiumColors[1].circleShadow}` }}>
                    {top3[1].avatar}
                  </div>
                  <div className={cn("font-bold text-xs sm:text-lg truncate px-1 sm:px-2 mt-1 sm:mt-2 max-w-full", podiumColors[1].text)}>{top3[1].name}</div>
                  <div className="text-gray-400 font-mono font-bold text-xs sm:text-base">{top3[1].score}</div>
                </div>
                <div className={cn("w-full rounded-t-xl border-t-2 border-x-2 flex justify-center pt-4 shadow-lg relative overflow-hidden", podiumColors[1].bg, podiumColors[1].border, podiumColors[1].height)}>
                  <div className="absolute inset-0 bg-white/10" />
                  <span className={cn("font-extrabold text-white drop-shadow-md opacity-70", podiumColors[1].numSize)}>2</span>
                </div>
              </motion.div>
            )}

            {top3[0] && (
              <motion.div key="p1" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="flex flex-col items-center w-1/3 z-10"
              >
                <div className="mb-2 text-center relative max-w-full">
                  <Crown size={28} className="sm:size-[36px] absolute -top-8 sm:-top-11 left-1/2 -translate-x-1/2 text-yellow-400" style={{ filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.8))' }} />
                  <div className={cn("bg-space-blue-light/80 flex items-center justify-center mx-auto border-4 shadow-lg relative z-10 rounded-full", podiumColors[0].circle, podiumColors[0].avatar)} style={{ boxShadow: `0 0 25px ${podiumColors[0].circleShadow}` }}>
                    {top3[0].avatar}
                  </div>
                  <div className={cn("font-bold text-sm sm:text-xl truncate px-1 sm:px-2 mt-2 sm:mt-3 max-w-full", podiumColors[0].text)}>{top3[0].name}</div>
                  <div className={cn("font-mono font-bold text-xs sm:text-lg", podiumColors[0].text)}>{top3[0].score}</div>
                </div>
                <div className={cn("w-full rounded-t-xl border-t-2 border-x-2 flex justify-center pt-4 relative overflow-hidden", podiumColors[0].bg, podiumColors[0].border, podiumColors[0].height)} style={{ boxShadow: `0 0 30px ${podiumColors[0].shadow}` }}>
                  <div className="absolute inset-0 bg-white/20" />
                  <span className={cn("font-extrabold text-white drop-shadow-md opacity-90", podiumColors[0].numSize)}>1</span>
                </div>
              </motion.div>
            )}

            {top3[2] && (
              <motion.div key="p3" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="flex flex-col items-center w-1/3"
              >
                <div className="mb-2 text-center relative max-w-full">
                  <Medal size={18} className="sm:size-[24px] absolute -top-5 sm:-top-7 left-1/2 -translate-x-1/2 text-amber-600" style={{ filter: 'drop-shadow(0 0 8px rgba(205,127,50,0.5))' }} />
                  <div className={cn("bg-space-blue-light/80 flex items-center justify-center mx-auto border-4 shadow-lg relative z-10 rounded-full", podiumColors[2].circle, podiumColors[2].avatar)} style={{ boxShadow: `0 0 10px ${podiumColors[2].circleShadow}` }}>
                    {top3[2].avatar}
                  </div>
                  <div className={cn("font-bold text-xs sm:text-base truncate px-1 sm:px-2 mt-1 sm:mt-2 max-w-full", podiumColors[2].text)}>{top3[2].name}</div>
                  <div className="text-gray-400 font-mono text-xs sm:text-sm">{top3[2].score}</div>
                </div>
                <div className={cn("w-full rounded-t-xl border-t-2 border-x-2 flex justify-center pt-4 shadow-lg relative overflow-hidden", podiumColors[2].bg, podiumColors[2].border, podiumColors[2].height)}>
                  <div className="absolute inset-0 bg-white/10" />
                  <span className={cn("font-extrabold text-white drop-shadow-md opacity-70", podiumColors[2].numSize)}>3</span>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {rest.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="w-full max-w-2xl bg-space-blue-light/30 rounded-2xl p-2 sm:p-4 border border-glass-border mb-4 sm:mb-6 max-h-[200px] sm:max-h-[250px] overflow-y-auto custom-scrollbar"
        >
          {rest.map((player, idx) => (
            <div key={player.id}
              className={cn("flex justify-between items-center p-2 sm:p-3 border-b border-white/5 last:border-0",
                player.id === myId ? "bg-neon-purple/10 rounded-lg border-neon-purple/30 border" : ""
              )}
            >
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <span className="text-gray-500 font-bold w-5 sm:w-6 text-center text-sm sm:text-base">#{idx + 4}</span>
                <span className="text-xl sm:text-2xl flex-shrink-0">{player.avatar}</span>
                <span className="font-bold text-gray-200 text-sm sm:text-base truncate">{player.name}</span>
                {player.id === myId && <span className="text-[10px] sm:text-xs bg-neon-purple px-1.5 sm:px-2 py-0.5 rounded-full text-white flex-shrink-0">أنت</span>}
              </div>
              <div className="font-mono font-bold text-gray-400 text-sm sm:text-base flex-shrink-0">{player.score}</div>
            </div>
          ))}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
        className="w-full max-w-xl bg-gradient-to-r from-space-blue-light to-space-blue border border-neon-purple/30 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center shadow-[0_0_20px_rgba(176,38,255,0.1)] relative overflow-hidden mb-4 sm:mb-6"
      >
        <div className="absolute -right-10 -top-10 text-neon-purple opacity-5 blur-sm">
          <Star size={120} />
        </div>
        <div className="relative z-10">
          <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3 text-white">
            {isAdmin ? "آراء الطلاب" : "قيّم التحدي"}
          </h3>
          <div className="flex justify-center items-center gap-1 sm:gap-2 mb-2 sm:mb-3" dir="ltr">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button key={star} whileHover={{ scale: isAdmin ? 1 : 1.2 }} whileTap={{ scale: isAdmin ? 1 : 0.9 }}
                onMouseEnter={() => !isAdmin && setHoveredStar(star)}
                onMouseLeave={() => !isAdmin && setHoveredStar(0)}
                onClick={() => handleRate(star)} disabled={isAdmin || myRating > 0}
                className="focus:outline-none disabled:cursor-default"
              >
                <Star size={28}
                  className={cn("transition-all duration-300 sm:size-[36px]",
                    (star <= (hoveredStar || myRating)) && !isAdmin
                      ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)] scale-110"
                      : isAdmin ? "text-gray-600" : "text-gray-600 hover:text-gray-400"
                  )}
                  fill={isAdmin ? "none" : (star <= (hoveredStar || myRating) ? "currentColor" : "none")}
                />
              </motion.button>
            ))}
          </div>
          <div className="bg-black/30 rounded-full inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-1.5 sm:py-2 border border-white/5">
            <span className="text-yellow-400 font-bold flex items-center gap-1 text-xs sm:text-base">
              {avgRating} <Star size={12} className="sm:size-[16px] fill-yellow-400" />
            </span>
            <span className="w-px h-3 sm:h-4 bg-gray-600" />
            <span className="text-gray-400 text-[10px] sm:text-sm">التقييمات: {ratedPlayers.length}</span>
          </div>
          {myRating > 0 && !isAdmin && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 sm:mt-3 text-emerald-400 font-bold text-xs sm:text-sm">
              شكراً لتقييمك! 🎉
            </motion.p>
          )}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
        className="w-full text-center pb-4 sm:pb-6 pt-2"
      >
        <div className="inline-block border-t border-glass-border/50 pt-2 sm:pt-3 px-4 sm:px-12">
          <p className="text-gray-400 text-[10px] sm:text-sm opacity-80 mb-0.5 sm:mb-1">تم إعداد وتصميم التحدي</p>
          <p className="text-neon-purple font-bold text-xs sm:text-lg flex items-center justify-center gap-1 sm:gap-2">
            <Award size={14} className="sm:size-[20px] text-yellow-400 flex-shrink-0" />
            <span className="truncate">تحت إشراف المعلمة / ضحى احمد عيسى الجواريش</span>
            <Award size={14} className="sm:size-[20px] text-yellow-400 flex-shrink-0" />
          </p>
        </div>
      </motion.div>
    </div>
  );
});
