'use client';

import { FileText } from 'lucide-react';

interface PageSelectorProps {
  maxPages: number | null;
  onMaxPagesChange: (pages: number | null) => void;
  fileType: string;
}

export default function PageSelector({ maxPages, onMaxPagesChange, fileType }: PageSelectorProps) {
  // Só mostrar para PDFs
  if (fileType !== 'application/pdf') {
    return null;
  }

  const options = [
    { value: 3, label: '3 páginas (Rápido)' },
    { value: 5, label: '5 páginas (Recomendado)' },
    { value: 10, label: '10 páginas (Médio)' },
    { value: null, label: 'Todas as páginas (Pode demorar muito)' },
  ];

  return (
    <div className="glass-card p-6">
      <div className="flex items-start gap-3 mb-4">
        <FileText className="w-5 h-5 text-indigo-400 mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">Quantas páginas traduzir?</h3>
          <p className="text-sm text-gray-300">
            PDFs grandes podem atingir o limite da API gratuita. Recomendamos traduzir poucas páginas por vez.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.value || 'all'}
            onClick={() => onMaxPagesChange(option.value)}
            className={`
              p-4 rounded-xl border-2 transition-all duration-300 text-left
              ${maxPages === option.value
                ? 'border-indigo-500 bg-indigo-500/20 shadow-lg scale-105'
                : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{option.label}</span>
              {maxPages === option.value && (
                <span className="text-green-400 text-xl">✓</span>
              )}
            </div>
            {option.value === 5 && (
              <span className="text-xs text-indigo-300 mt-1 block">⭐ Melhor para testes</span>
            )}
          </button>
        ))}
      </div>

      {maxPages && (
        <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <p className="text-sm text-blue-200">
            ℹ️ Serão traduzidas apenas as primeiras <strong>{maxPages} páginas</strong> do seu documento.
          </p>
        </div>
      )}

      {!maxPages && (
        <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
          <p className="text-sm text-yellow-200">
            ⚠️ Traduzir todas as páginas pode levar muito tempo e pode falhar devido aos limites da API gratuita.
          </p>
        </div>
      )}
    </div>
  );
}