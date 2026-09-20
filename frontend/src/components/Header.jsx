import React from 'react';
import { Cpu, Wifi, WifiOff, Settings } from 'lucide-react';

export default function Header({ 
  backendConnected, 
  onOpenSettings
}) {
  return (
    <header className="h-14 glass-panel border-b border-cyber-border flex items-center justify-between px-4 select-none z-20 relative">
      {/* Title & Branding */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-cyber-glow">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-sm tracking-wide bg-gradient-to-r from-white via-slate-200 to-cyber-muted bg-clip-text text-transparent font-['Outfit']">
              AI DOCUMENT ASSISTANT
            </h1>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
              RAG ASSISTANT
            </span>
          </div>
          <p className="text-[10px] text-cyber-muted font-mono">AI RAG Document Assistant</p>
        </div>
      </div>

      {/* Actions & Status */}
      <div className="flex items-center space-x-3">
        {/* Model Settings Button */}
        <button
          onClick={onOpenSettings}
          className="px-3 py-1.5 rounded-lg font-medium text-xs flex items-center space-x-1.5 transition-all border bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20"
          title="Change Model & API Settings"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Model Settings</span>
        </button>

        {/* Backend Status */}
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-cyber-card border border-cyber-border text-xs">
          {backendConnected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                <Wifi className="w-3 h-3" /> Ready
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-rose-400 font-mono text-[11px] flex items-center gap-1">
                <WifiOff className="w-3 h-3" /> Offline
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
