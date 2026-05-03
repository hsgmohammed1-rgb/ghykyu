import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Medal, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Player } from '../types';
import { cn } from '../lib/utils';

interface LeaderboardViewProps {
  players: Player[];
  myId?: string;
  isAdmin?: boolean;
  onRate?: (rating: number) => void;
}

export function LeaderboardView({ players, myId, isAdmin, onRate }: LeaderboardViewProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [myRating, setMyRating] = useState(0);

  // Trigger grand celebration on mount
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      
      confetti({
        particleCount: 15,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#C0C0C0', '#CD7F32', '#B026FF']
      });
      confetti({
        particleCount: 15,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#C0C0C0', '#CD7F32', '#B026FF']
      });
    }, 250);
    
    return () => clearInterval(interval);
  }, []);

  const handleRate = (star: number) => {
    if (myRating > 0 || isAdmin) return;
    setMyRating(star);
    if (onRate) onRate(star);
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const top3 = sortedPlayers.slice(0, 3);
  const rest = sortedPlayers.slice(3);

  // Calculate Average Rating
  const ratedPlayers = players.filter(p => p.status?.startsWith('rated_'));
  const totalStars = ratedPlayers.reduce((acc, p) => acc + parseInt(p.status.split('_')[1] || '0'), 0);
  const avgRating = ratedPlayers.length > 0 ? (totalStars / ratedPlayers.length).toFixed(1) : "0.0";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-5xl font-heading font-extrabold bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent flex justify-center items-center gap-4 mb-2 drop-shadow-lg">
          <Sparkles className="text-yellow-400" />
          لوحة الشرف والبطولة
          <Sparkles className="text-yellow-400" />
        </h2>
        <p className="text-gray-300 font-bold text-lg">أبطال تحدي الاحتمالات</p>
      </motion.div>

      {/* Podium */}
      <div className="flex justify-center items-end h-80 md:h-96 gap-2 md:gap-6 w-full max-w-2xl mx-auto mb-12 mt-8">
        {/* 2nd Place */}
        {top3[1] && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-col items-center w-1/3"
          >
            <div className="mb-2 text-center relative max-w-full">
              <div className="text-4xl bg-space-blue-light/80 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto border-4 border-gray-400 shadow-[0_0_15px_rgba(192,192,192,0.5)] z-10 relative">
                {top3[1].avatar}
              </div>
              <div className="font-bold text-lg truncate px-2 mt-2">{top3[1].name}</div>
              <div className="text-gray-400 font-mono">{top3[1].score}</div>
            </div>
            <div className="w-full bg-gradient-to-t from-gray-600 via-gray-500 to-gray-400 h-32 md:h-40 rounded-t-xl border-t-2 border-x-2 border-gray-300 flex justify-center pt-4 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10" />
                <span className="text-5xl font-extrabold text-white drop-shadow-md opacity-70">2</span>
            </div>
          </motion.div>
        )}

        {/* 1st Place */}
        {top3[0] && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="flex flex-col items-center w-1/3 z-10"
          >
            <div className="mb-2 text-center relative max-w-full">
              <Trophy className="absolute -top-12 left-1/2 -translate-x-1/2 text-yellow-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] w-12 h-12" />
              <div className="text-5xl bg-space-blue-light/80 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto border-4 border-yellow-400 shadow-[0_0_25px_rgba(255,215,0,0.8)] relative z-10">
                {top3[0].avatar}
              </div>
              <div className="font-bold text-xl truncate px-2 mt-3 text-yellow-400 drop-shadow-md">{top3[0].name}</div>
              <div className="text-yellow-200 font-mono font-bold text-lg">{top3[0].score}</div>
            </div>
            <div className="w-full bg-gradient-to-t from-yellow-600 via-yellow-500 to-yellow-400 h-44 md:h-52 rounded-t-xl border-t-2 border-x-2 border-yellow-300 flex justify-center pt-4 shadow-[0_0_30px_rgba(255,215,0,0.5)] relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20" />
                <span className="text-6xl font-extrabold text-white drop-shadow-md opacity-90">1</span>
            </div>
          </motion.div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="flex flex-col items-center w-1/3"
          >
            <div className="mb-2 text-center relative max-w-full">
              <div className="text-3xl bg-space-blue-light/80 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto border-4 border-amber-600 shadow-[0_0_10px_rgba(205,127,50,0.5)] z-10 relative">
                {top3[2].avatar}
              </div>
              <div className="font-bold truncate px-2 mt-2 text-amber-500">{top3[2].name}</div>
              <div className="text-gray-400 font-mono text-sm">{top3[2].score}</div>
            </div>
            <div className="w-full bg-gradient-to-t from-amber-800 via-amber-700 to-amber-600 h-24 md:h-32 rounded-t-xl border-t-2 border-x-2 border-amber-500 flex justify-center pt-4 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10" />
                <span className="text-4xl font-extrabold text-white drop-shadow-md opacity-70">3</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Other Players */}
      {rest.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="w-full max-w-2xl bg-space-blue-light/30 rounded-2xl p-4 border border-glass-border mb-8 max-h-[300px] overflow-y-auto custom-scrollbar"
        >
          {rest.map((player, idx) => (
            <div 
              key={player.id} 
              className={cn(
                "flex justify-between items-center p-3 border-b border-white/5 last:border-0",
                player.id === myId ? "bg-neon-purple/10 rounded-lg border-neon-purple/30 border" : ""
              )}
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-500 font-bold w-6 text-center">#{idx + 4}</span>
                <span className="text-2xl">{player.avatar}</span>
                <span className="font-bold text-gray-200">{player.name}</span>
                {player.id === myId && <span className="text-xs bg-neon-purple px-2 py-0.5 rounded-full text-white ml-2">أنت</span>}
              </div>
              <div className="font-mono font-bold text-gray-400">{player.score}</div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Ratings Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}
        className="w-full max-w-xl bg-gradient-to-r from-space-blue-light to-space-blue border border-neon-purple/30 rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(176,38,255,0.1)] relative overflow-hidden mb-8"
      >
        <div className="absolute -right-10 -top-10 text-neon-purple opacity-5 blur-sm z-0">
          <Star size={120} />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-4 text-white">
            {isAdmin ? "آراء الطلاب حول التحدي" : "ما تقييمك لتحدي الاحتمالات؟"}
          </h3>
          
          <div className="flex justify-center items-center gap-2 mb-4" dir="ltr">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: isAdmin ? 1 : 1.2 }}
                whileTap={{ scale: isAdmin ? 1 : 0.9 }}
                onMouseEnter={() => !isAdmin && setHoveredStar(star)}
                onMouseLeave={() => !isAdmin && setHoveredStar(0)}
                onClick={() => handleRate(star)}
                disabled={isAdmin || myRating > 0}
                className="focus:outline-none disabled:cursor-default"
              >
                <Star 
                  size={36} 
                  className={cn(
                    "transition-all duration-300",
                    (star <= (hoveredStar || myRating)) && !isAdmin 
                      ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)] scale-110" 
                      : isAdmin ? "" : "text-gray-600 hover:text-gray-400"
                  )}
                  // For the admin or if already rated, we just use the average visualization if we wanted. 
                  // But mostly we just show stars as buttons for users.
                  fill={isAdmin ? "transparent" : (star <= (hoveredStar || myRating) ? "currentColor" : "none")}
                />
              </motion.button>
            ))}
          </div>
          
          <div className="bg-black/30 rounded-full inline-flex items-center gap-3 px-6 py-2 border border-white/5">
            <span className="text-yellow-400 font-bold flex items-center gap-1">
              {avgRating} <Star size={16} className="fill-yellow-400" />
            </span>
            <span className="w-px h-4 bg-gray-600" />
            <span className="text-gray-400 text-sm">إجمالي التقييمات: {ratedPlayers.length}</span>
          </div>

          {myRating > 0 && !isAdmin && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-emerald-400 font-bold text-sm">
              شكراً لتقييمك! 🎉
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Teacher Accreditation */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="w-full text-center pb-8 pt-4"
      >
        <div className="inline-block border-t border-glass-border/50 pt-4 px-12">
          <p className="text-gray-400 text-sm opacity-80 mb-1">تم إعداد وتصميم التحدي</p>
          <p className="text-neon-purple font-bold text-lg flex items-center justify-center gap-2">
            <Award size={20} className="text-yellow-400" />
            تحت إشراف المعلمة / ضحى احمد عيسى الجواريش
            <Award size={20} className="text-yellow-400" />
          </p>
        </div>
      </motion.div>

    </div>
  );
}
