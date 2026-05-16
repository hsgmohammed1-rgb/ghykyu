import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Rocket, User, Lock } from 'lucide-react';
import { getRandomAvatar } from '../lib/utils';
import { supabase } from '../lib/supabase';

const RATE_LIMIT_MS = 2000;

export function Home() {
  const [searchParams] = useSearchParams();
  const queryRoomId = searchParams.get('room') || new URLSearchParams(window.location.search).get('room');

  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState(queryRoomId || '');
  const [avatar, setAvatar] = useState(getRandomAvatar());
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const lastJoinClick = useRef(0);
  const navigate = useNavigate();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roomId.trim()) return;

    const now = Date.now();
    if (now - lastJoinClick.current < RATE_LIMIT_MS) {
      setErrorMsg('الرجاء الانتظار قليلاً قبل المحاولة مرة أخرى');
      return;
    }
    lastJoinClick.current = now;

    if (name.trim().length > 20) {
      setErrorMsg('الاسم طويل جداً (الحد الأقصى 20 حرفاً)');
      return;
    }

    setLoading(true);
    setErrorMsg('جاري التحقق من الغرفة...');

    try {
      const { data } = await supabase.from('rooms').select('code').eq('code', roomId.trim()).single();

      if (!data) {
        setErrorMsg('رمز الغرفة غير صحيح أو الغرفة غير متوفرة');
        setLoading(false);
        return;
      }

      const sessionData = { name: name.trim(), avatar };
      sessionStorage.setItem(`room_session_${roomId}`, JSON.stringify(sessionData));

      navigate(`/room/${roomId}`, {
        state: sessionData
      });
    } catch {
      setErrorMsg('خطأ في الاتصال، تحقق من اتصالك بالإنترنت');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="glass-panel p-6 md:p-12 max-w-md w-full relative z-10"
      >
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold mb-2 bg-gradient-to-r from-neon-purple to-blue-400 bg-clip-text text-transparent">
            تحدي الهندسة
          </h1>
          <p className="text-sm md:text-base text-gray-300">أدخل صالة الرياضيات التفاعلية</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4 md:space-y-6">
          <div className="flex flex-col items-center justify-center mb-4 md:mb-6">
            <div className="relative group cursor-pointer" onClick={() => !loading && setAvatar(getRandomAvatar())}>
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
            {errorMsg && (
              <div className="bg-coral-red/20 border border-coral-red text-coral-red px-3 md:px-4 py-2 md:py-3 rounded-xl text-center text-xs md:text-sm font-bold">
                {errorMsg}
              </div>
            )}
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

            {!queryRoomId && (
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 md:pr-4 pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="رمز الغرفة..."
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase().slice(0, 8))}
                  className="w-full bg-space-blue-light/50 border border-glass-border rounded-xl pr-10 md:pr-12 pl-3 md:pl-4 py-3 md:py-4 text-center tracking-[0.2em] font-mono text-base md:text-xl uppercase focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-3d btn-3d-purple py-3 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 font-heading font-extrabold text-lg md:text-xl group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
            <span className="relative z-10 drop-shadow-md">{loading ? 'جاري الاتصال...' : 'انطلق للتحدي'}</span>
            {!loading && <Rocket className="relative z-10 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform drop-shadow-md" />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
