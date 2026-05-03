import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Rocket, User, Dices, Lock } from 'lucide-react';
import { getRandomAvatar, cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import BlockMath from 'react-katex'; // We'll just show a cool math symbol in background

export function Home() {
  const [searchParams] = useSearchParams();
  // Fallback check to catch standard URL query parameters (which often happen outside the hash in this environment)
  const queryRoomId = searchParams.get('room') || new URLSearchParams(window.location.search).get('room');

  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState(queryRoomId || '');
  const [avatar, setAvatar] = useState(getRandomAvatar());
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roomId.trim()) return;
    
    setErrorMsg('جاري التحقق من الغرفة...');
    
    // Validate if the room exists in Supabase
    const { data } = await supabase.from('rooms').select('code').eq('code', roomId).single();
    
    if (!data) {
      setErrorMsg('رمز الغرفة غير صحيح أو الغرفة غير متوفرة');
      return;
    }

    // Pass user details via state AND store in session for persistence (refresh support)
    const sessionData = { name, avatar };
    sessionStorage.setItem(`room_session_${roomId}`, JSON.stringify(sessionData));
    
    navigate(`/room/${roomId}`, { 
      state: sessionData
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating 3D Background Elements */}
      <motion.div 
        animate={{ y: [0, -30, 0], rotate: [0, 15, 0], scale: [1, 1.1, 1] }} 
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 md:right-20 w-32 h-32 rounded-3xl bg-gradient-to-tr from-neon-purple to-blue-500 shape-3d flex items-center justify-center opacity-40 blur-[2px]"
      >
        <span className="text-4xl text-white font-bold opacity-80">P(A)</span>
      </motion.div>
      <motion.div 
        animate={{ y: [0, 40, 0], rotate: [0, -25, 0], scale: [1, 1.2, 1] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-10 md:left-20 w-40 h-40 rounded-full bg-gradient-to-tr from-emerald-400 to-space-blue shape-3d flex items-center justify-center opacity-40 blur-[1px]"
      >
        <span className="text-6xl text-white font-bold opacity-80">∑</span>
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, 45, 0] }} 
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 left-1/4 w-24 h-24 rounded-xl bg-gradient-to-br from-coral-red to-orange-500 shape-3d flex items-center justify-center opacity-30"
      >
        <Dices size={48} className="text-white opacity-80" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="glass-panel p-8 md:p-12 max-w-md w-full relative z-10 transform-gpu"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-extrabold mb-2 bg-gradient-to-r from-neon-purple to-blue-400 bg-clip-text text-transparent">
            تحدي الاحتمالات
          </h1>
          <p className="text-gray-300">أدخل صالة الرياضيات التفاعلية</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-6">
          {/* Avatar Selection */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative group cursor-pointer" onClick={() => setAvatar(getRandomAvatar())}>
              <div className="w-24 h-24 bg-space-blue-light/50 rounded-full flex items-center justify-center text-5xl shadow-inner border border-glass-border group-hover:border-neon-purple transition-all duration-300">
                <motion.div key={avatar} initial={{ scale: 0 }} animate={{ scale: 1 }} className="drop-shadow-lg">
                  {avatar}
                </motion.div>
              </div>
              <div className="absolute -bottom-2 bg-space-blue px-3 py-1 rounded-full text-xs border border-glass-border">
                تغيير
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {errorMsg && (
              <div className="bg-coral-red/20 border border-coral-red text-coral-red px-4 py-3 rounded-xl text-center text-sm font-bold">
                {errorMsg}
              </div>
            )}
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                <User size={20} />
              </div>
              <input
                type="text"
                required
                placeholder="اسمك المبدع..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-space-blue-light/50 border border-glass-border rounded-xl pr-12 pl-4 py-4 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all text-xl"
              />
            </div>

            {!queryRoomId && (
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="رمز الغرفة..."
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  className="w-full bg-space-blue-light/50 border border-glass-border rounded-xl pr-12 pl-4 py-4 text-center tracking-[0.2em] font-mono text-xl uppercase focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn-3d btn-3d-purple py-4 rounded-2xl flex items-center justify-center gap-2 font-heading font-extrabold text-xl group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
            <span className="relative z-10 drop-shadow-md">انطلق للتحدي</span>
            <Rocket className="relative z-10 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform drop-shadow-md" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
