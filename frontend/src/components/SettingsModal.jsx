import React, { useState } from 'react';
import { X, Sliders, Palette, ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsModal({ isOpen, onClose, settings, onSaveSettings }) {
  const [theme, setTheme] = useState(settings?.theme || 'cyber-dark');
  const [autoScroll, setAutoScroll] = useState(settings?.autoScroll ?? true);
  const [showCitationsDefault, setShowCitationsDefault] = useState(settings?.showCitationsDefault ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      theme,
      autoScroll,
      showCitationsDefault,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md glass-panel rounded-2xl border-cyber-border shadow-2xl overflow-hidden bg-cyber-bg"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-cyber-border bg-cyber-card/60">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-white font-['Outfit']">
                Preferences
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-cyber-muted hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Options */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* 1. Theme Color Accent */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-cyber-muted uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyan-400" /> Interface Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTheme('cyber-dark')}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 transition-all ${
                    theme === 'cyber-dark'
                      ? 'border-blue-500 bg-blue-500/10 text-white shadow-cyber-glow'
                      : 'border-cyber-border bg-cyber-card/40 text-cyber-muted hover:text-white'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#0F0F11] border border-blue-500 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                  </div>
                  <span>Cyber Dark</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('midnight-navy')}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 transition-all ${
                    theme === 'midnight-navy'
                      ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-cyber-glow'
                      : 'border-cyber-border bg-cyber-card/40 text-cyber-muted hover:text-white'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#0B132B] border border-cyan-400 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-cyan-400" />
                  </div>
                  <span>Midnight Navy</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('neon-violet')}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 transition-all ${
                    theme === 'neon-violet'
                      ? 'border-purple-500 bg-purple-500/10 text-white shadow-cyber-glow'
                      : 'border-cyber-border bg-cyber-card/40 text-cyber-muted hover:text-white'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#120B2E] border border-purple-400 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-purple-400" />
                  </div>
                  <span>Neon Violet</span>
                </button>
              </div>
            </div>

            {/* 2. Workspace Options */}
            <div className="space-y-3 pt-2 border-t border-cyber-border">
              <label className="text-xs font-bold text-cyber-muted uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Workspace Options
              </label>

              <div className="space-y-2">
                {/* Auto‑scroll */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-cyber-card/40 border border-cyber-border cursor-pointer hover:border-cyber-border/80">
                  <span className="text-xs text-white">Auto‑scroll chat on response</span>
                  <input
                    type="checkbox"
                    checked={autoScroll}
                    onChange={(e) => setAutoScroll(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-500"
                  />
                </label>

                {/* Expand references */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-cyber-card/40 border border-cyber-border cursor-pointer hover:border-cyber-border/80">
                  <span className="text-xs text-white">Show source page references automatically</span>
                  <input
                    type="checkbox"
                    checked={showCitationsDefault}
                    onChange={(e) => setShowCitationsDefault(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Footer Save Controls */}
          <div className="p-4 border-t border-cyber-border bg-cyber-card/60 flex items-center justify-between">
            <span className="text-[10px] text-cyber-muted font-mono">Saved in browser</span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl text-xs text-cyber-muted hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-cyber-glow flex items-center gap-1.5 transition-all"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" /> Saved!
                  </>
                ) : (
                  'Save Preferences'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}