'use client';

import { useState, useEffect } from 'react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="absolute top-0 z-30 w-full max-w-7xl px-4 pt-6 md:px-8 md:pt-8">
  <div className="glass-ui-enhanced header-shine flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-md bg-white/5 border border-white/10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-green-400">
            circle
          </span>
          <p className="text-sm font-medium text-slate-200 font-mono">Online</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl text-slate-400">
            network_check
          </span>
          <p className="text-sm text-slate-300 font-mono">
            Latency: <span className="font-semibold text-slate-200">12ms</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl text-slate-400">
            security
          </span>
          <p className="text-sm text-slate-300 font-mono">
            Entropy: <span className="font-bold text-green-400">Stable</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl text-slate-400">
            schedule
          </span>
          <p className="text-sm text-slate-300 font-mono">
            Time: <span className="font-semibold text-slate-200">{currentTime}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl text-slate-400">
            memory
          </span>
          <p className="text-sm text-slate-300 font-mono">
            System Load: <span className="font-semibold text-slate-200">34%</span>
          </p>
        </div>
      </div>
    </header>
  );
}