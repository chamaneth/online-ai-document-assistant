import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, Database, HardDrive, Wifi, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Initializing Local AI Engine...');

  useEffect(() => {
    const steps = [
      { p: 15, text: '1%' },
      { p: 30, text: '10%' },
      { p: 60, text: '25%' },
      { p: 85, text: '50%' },
      { p: 100, text: '100%' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusText(steps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cyber-bg select-none font-sans overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphism Loading Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 glass-panel rounded-3xl border-cyber-border text-center space-y-6 shadow-2xl relative z-10"
      >
        {/* Pulsating Icon Header */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-2xl bg-blue-500/30 blur-md"
          />
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-cyber-glow relative z-10">
            <Cpu className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Branding & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-wider text-white font-['Outfit'] flex items-center justify-center gap-2">
            AI DOCUMENT ASSISTANT <Sparkles className="w-4 h-4 text-cyan-400" />
          </h1>
          <p className="text-xs text-cyber-muted">Document Summarizing Tool</p>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-cyan-400">{statusText}</span>
            <span className="text-white font-bold">{progress}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-cyber-card overflow-hidden border border-cyber-border p-0.5">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 shadow-cyber-glow"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
