import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home } from './pages/Home';
import { StudentRoom } from './pages/StudentRoom';
import { AdminDashboard } from './pages/AdminDashboard';
import { cn } from './lib/utils';
import { Lock } from 'lucide-react';

function ProtectedAdminLayout() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 mesh-bg">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 max-w-sm w-full text-center"
        >
          <Lock className="w-12 h-12 text-neon-purple mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold mb-6">غرفة التحكم السرية</h2>
          <input 
            type="password" 
            placeholder="كلمة المرور..."
            className="w-full bg-space-blue-light border border-glass-border rounded-xl px-4 py-3 text-center mb-4 focus:outline-none focus:border-neon-purple transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && password === '32581') {
                setAuthorized(true);
              }
            }}
          />
          <button 
            onClick={() => password === '32581' && setAuthorized(true)}
            className="w-full bg-neon-purple hover:bg-neon-purple-dark text-white font-bold py-3 rounded-xl transition-all"
          >
            دخول
          </button>
        </motion.div>
      </div>
    );
  }

  return <AdminDashboard />;
}

// Global hidden trigger for Admin
function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    if (clicks >= 3) {
      setClicks(0);
      navigate('/admin/dashboard');
    }
  }, [clicks, navigate]);

  // Only show on home page
  if (location.pathname !== '/') return null;

  return (
    <footer className="fixed bottom-2 w-full text-center text-sm text-gray-500 opacity-50 z-50">
      جميع الحقوق محفوظة <span 
        className="cursor-pointer font-bold px-2"
        onClick={() => setClicks(prev => prev + 1)}
      >
        2026
      </span>
    </footer>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <HashRouter>
      <div className="mesh-bg" />
      <Routes>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/room/:id" element={<PageWrapper><StudentRoom /></PageWrapper>} />
        <Route path="/admin/dashboard" element={<ProtectedAdminLayout />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
}
