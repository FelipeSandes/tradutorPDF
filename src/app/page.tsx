'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles } from 'lucide-react';

// Dynamic imports para componentes
const FileUploader = dynamic(() => import('@/components/FileUploader'), { ssr: false });
const LanguageSelector = dynamic(() => import('@/components/LanguageSelector'), { ssr: false });
const LoadingSpinner = dynamic(() => import('@/components/LoadingSpinner'), { ssr: false });
const TranslationResult = dynamic(() => import('@/components/TranslationResult'), { ssr: false });

type AppState = 'idle' | 'loading-model' | 'extracting' | 'translating' | 'complete';

export default function Home() {
  const [state, setState] = useState<AppState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceLang, setSourceLang] = useState('por_Latn');
  const [targetLang, setTargetLang] = useState('eng_Latn');
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const handleTranslate = async () => {
    if (!selectedFile) return;

    try {
      // Importar dinamicamente as funções
      const { extractTextFromPDF, extractTextFromDOCX } = await import('@/lib/client-only-extractor');
      const { loadTranslator, translateText: translate } = await import('@/lib/translator');

      // Extrair texto
      setState('extracting');
      setStatusMessage('Extraindo texto do documento...');
      
      let text = '';
      if (selectedFile.type === 'application/pdf') {
        text = await extractTextFromPDF(selectedFile);
      } else {
        text = await extractTextFromDOCX(selectedFile);
      }
      
      setOriginalText(text);

      // Carregar modelo
      setState('loading-model');
      setStatusMessage('Carregando modelo de tradução...');
      setProgress(0);
      
      await loadTranslator((prog) => setProgress(prog));

      // Traduzir
      setState('translating');
      setStatusMessage('Traduzindo documento...');
      setProgress(0);

      const translated = await translate(
        text,
        sourceLang,
        targetLang,
        (current, total) => {
          const prog = Math.round((current / total) * 100);
          setProgress(prog);
        }
      );

      setTranslatedText(translated);
      setState('complete');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao processar documento. Tente novamente.');
      setState('idle');
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setOriginalText('');
    setTranslatedText('');
    setState('idle');
    setProgress(0);
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in duration-700">
          <div className="inline-block mb-6">
            <div className="animated-gradient p-4 rounded-3xl">
              <Sparkles className="w-16 h-16" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
            Tradutor de Documentos
          </h1>
          <p className="text-xl text-gray-300">
            Traduza PDFs e DOCX com inteligência artificial
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              ⚡ 100% Gratuito
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              🔒 Privado
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              🌐 200+ Idiomas
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {state === 'idle' && (
            <>
              <FileUploader
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
                onClear={handleClear}
              />
              
              {selectedFile && (
                <>
                  <LanguageSelector
                    sourceLang={sourceLang}
                    targetLang={targetLang}
                    onSourceChange={setSourceLang}
                    onTargetChange={setTargetLang}
                  />
                  
                  <button
                    onClick={handleTranslate}
                    className="glass-button w-full"
                  >
                    ✨ Traduzir Documento
                  </button>
                </>
              )}
            </>
          )}

          {(state === 'loading-model' || state === 'extracting' || state === 'translating') && (
            <LoadingSpinner
              message={statusMessage}
              progress={state === 'extracting' ? undefined : progress}
              subMessage={
                state === 'loading-model'
                  ? 'Isso pode levar alguns minutos na primeira vez...'
                  : state === 'translating'
                  ? 'Processando chunks de texto...'
                  : undefined
              }
            />
          )}

          {state === 'complete' && (
            <>
              <TranslationResult
                originalText={originalText}
                translatedText={translatedText}
                sourceLang={sourceLang}
                targetLang={targetLang}
              />
              
              <button
                onClick={handleClear}
                className="glass-button w-full"
              >
                🔄 Traduzir Outro Documento
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400 text-sm">
          <p>Feito com ❤️ usando Next.js, Transformers.js e IA</p>
        </div>
      </div>
    </main>
  );
}