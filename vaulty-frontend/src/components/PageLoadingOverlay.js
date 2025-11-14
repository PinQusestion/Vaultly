'use client';

import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';

export default function PageLoadingOverlay() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-linear-to-br from-slate-50 to-slate-100 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Logo with bounce animation */}
        <div className="bg-linear-to-r from-blue-600 to-emerald-600 p-3 rounded-lg animate-bounce">
          <Wallet className="text-white" size={32} />
        </div>
        {/* Loading text */}
        <p className="text-gray-600 font-medium">Loading Vaultly...</p>
      </div>
    </div>
  );
}
