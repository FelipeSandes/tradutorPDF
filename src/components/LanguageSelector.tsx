'use client';

import { ArrowRight } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/types';

interface LanguageSelectorProps {
  sourceLang: string;
  targetLang: string;
  onSourceChange: (lang: string) => void;
  onTargetChange: (lang: string) => void;
}

export default function LanguageSelector({
  sourceLang,
  targetLang,
  onSourceChange,
  onTargetChange,
}: LanguageSelectorProps) {
  return (
    <div className="glass-card p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-300">
            Idioma de Origem
          </label>
          <select
            value={sourceLang}
            onChange={(e) => onSourceChange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer
                     backdrop-blur-sm transition-all hover:bg-white/15"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-gray-900">
                {lang.nativeLabel}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
            <ArrowRight className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-300">
            Idioma de Destino
          </label>
          <select
            value={targetLang}
            onChange={(e) => onTargetChange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer
                     backdrop-blur-sm transition-all hover:bg-white/15"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-gray-900">
                {lang.nativeLabel}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}