import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useToastStore } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simular petición al backend
    setTimeout(() => {
      setIsLoading(false);
      login({ email: 'cliente@minimal.com', name: 'Cliente Minimal' }); // Login simulado
      addToast('Bienvenido de nuevo', 'success');
      navigate('/account'); // Redirigir a Mi Cuenta
    }, 1500);
  };

  const playUnlockSound = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  };

  const handleDrag = (_: any, info: PanInfo) => {
    // Si el usuario arrastra más de 220px (aprox 80% del ancho del contenedor)
    if (!isUnlocked && info.offset.x > 220) {
      setIsUnlocked(true);
      playUnlockSound();
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-stone-100 flex flex-col items-center justify-center font-serif text-stone-800">
      <Helmet>
        <title>Iniciar Sesión | MinimalStore</title>
      </Helmet>

      {/* Estado Bloqueado: El Nudo Corredizo */}
      <AnimatePresence>
        {!isUnlocked && (
          <motion.div 
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.5 } }}
            className="flex flex-col items-center gap-12"
          >
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Minimal.</h1>
              <p className="text-xs tracking-[0.2em] text-stone-400 uppercase">Acceso Privado</p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="relative w-72 h-14 flex items-center justify-start" ref={constraintsRef}>
                {/* Línea Base */}
                <div className="absolute left-2 right-2 h-[1px] bg-stone-300" />
                
                {/* Indicador de destino */}
                <div className="absolute right-0 w-14 h-14 rounded-full border border-dashed border-stone-300 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-stone-300 rounded-full" />
                </div>

                {/* El Nudo (Draggable) */}
                <motion.div
                  className="absolute left-0 w-14 h-14 bg-stone-900 rounded-full cursor-grab active:cursor-grabbing z-10 shadow-xl flex items-center justify-center text-white"
                  drag="x"
                  dragConstraints={constraintsRef}
                  dragElastic={0.1}
                  dragSnapToOrigin
                  onDrag={handleDrag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </motion.div>
              </div>
              
              <motion.p 
                className="text-[10px] text-stone-400 tracking-[0.3em] uppercase pointer-events-none select-none"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                DESLIZA PARA ENTRAR
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estado Desbloqueado: Formulario */}
      <AnimatePresence>
        {isUnlocked && (
          <motion.div
            initial={{ clipPath: "circle(0% at 50% 50%)", opacity: 0 }}
            animate={{ clipPath: "circle(150% at 50% 50%)", opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Ease out expo
            className="absolute inset-0 bg-stone-100 flex flex-col items-center justify-center"
          >
            <div className="w-full max-w-sm px-8">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-12 text-center"
              >
                <h2 className="text-4xl font-bold mb-2 text-stone-900">Bienvenido</h2>
                <p className="text-stone-500 text-sm italic">Ingresa tus credenciales</p>
              </motion.div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <input 
                    type="email" 
                    required
                    placeholder="Email" 
                    className="w-full bg-transparent border-b border-stone-300 py-3 text-lg focus:border-stone-900 outline-none transition-colors placeholder:text-stone-400 placeholder:text-sm placeholder:font-sans font-serif" 
                  />
                </motion.div>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <input 
                    type="password" 
                    required
                    placeholder="Contraseña" 
                    className="w-full bg-transparent border-b border-stone-300 py-3 text-lg focus:border-stone-900 outline-none transition-colors placeholder:text-stone-400 placeholder:text-sm placeholder:font-sans font-serif" 
                  />
                </motion.div>

                <motion.button 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-stone-900 text-stone-50 py-4 rounded-full text-xs uppercase tracking-[0.2em] hover:bg-stone-800 transition-all mt-8 disabled:opacity-70"
                >
                  {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
                </motion.button>
              </form>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 text-center"
              >
                <Link to="/register" className="text-xs text-stone-400 hover:text-stone-900 transition-colors border-b border-transparent hover:border-stone-900 pb-0.5 tracking-wide font-sans">
                  ¿No tienes cuenta? Regístrate
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;