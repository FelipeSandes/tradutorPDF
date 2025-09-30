'use client';

import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface TranslationResultProps {
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
}

export default function TranslationResult({
  originalText,
  translatedText,
  sourceLang,
  targetLang,
}: TranslationResultProps) {
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedTranslated, setCopiedTranslated] = useState(false);

  const copyToClipboard = async (text: string, setFunc: (val: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setFunc(true);
    setTimeout(() => setFunc(false), 2000);
  };

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Original Text */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            📄 Texto Original
            <span className="text-sm font-normal text-gray-300">({sourceLang})</span>
          </h3>
          <button
            onClick={() => copyToClipboard(originalText, setCopiedOriginal)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            title="Copiar"
          >
            {copiedOriginal ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 max-h-96 overflow-y-auto">
          <p className="whitespace-pre-wrap leading-relaxed">{originalText}</p>
        </div>
      </div>

      {/* Translated Text */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            🌐 Texto Traduzido
            <span className="text-sm font-normal text-gray-300">({targetLang})</span>
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => copyToClipboard(translatedText, setCopiedTranslated)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              title="Copiar"
            >
              {copiedTranslated ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => downloadText(translatedText, 'traducao.txt')}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 max-h-96 overflow-y-auto border border-indigo-500/20">
          <p className="whitespace-pre-wrap leading-relaxed">{translatedText}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-gray-300">Palavras Originais</p>
          <p className="text-2xl font-bold mt-1">{originalText.split(/\s+/).length}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-gray-300">Palavras Traduzidas</p>
          <p className="text-2xl font-bold mt-1">{translatedText.split(/\s+/).length}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-gray-300">Caracteres</p>
          <p className="text-2xl font-bold mt-1">{translatedText.length}</p>
        </div>
      </div>
    </div>
  );
}