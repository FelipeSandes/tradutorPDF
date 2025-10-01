'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles } from 'lucide-react';

// Dynamic imports para componentes
const FileUploader = dynamic(() => import('@/components/FileUploader'), { ssr: false });
const LanguageSelector = dynamic(() => import('@/components/LanguageSelector'), { ssr: false });
const LoadingSpinner = dynamic(() => import('@/components/LoadingSpinner'), { ssr: false });
const TranslationResult = dynamic(() => import('@/components/TranslationResult'), { ssr: false });
const PageSelector = dynamic(() => import('@/components/PageSelector'), { ssr: false });

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
  const [maxPages, setMaxPages] = useState<number | null>(5); // Padrão: 5 páginas

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
        text = await extractTextFromPDF(selectedFile, maxPages ?? undefined);
      } else {
        text = await extractTextFromDOCX(selectedFile);
      }
      
      setOriginalText(text);

      // Carregar modelo
      setState('loading-model');
      setStatusMessage('Preparando tradução...');
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
      console.error('Erro completo:', error);
      
      let errorMessage = 'Erro ao processar documento.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Mensagem de erro:', error.message);
        console.error('Stack trace:', error.stack);
      }
      
      alert(`Erro: ${errorMessage}\n\nVerifique o console do navegador (F12) para mais detalhes.`);
      setState('idle');
      setProgress(0);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setOriginalText('');
    setTranslatedText('');
    setState('idle');
    setProgress(0);
    setMaxPages(5); // Reset para padrão
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
                  <PageSelector
                    maxPages={maxPages}
                    onMaxPagesChange={setMaxPages}
                    fileType={selectedFile.type}
                  />
                  
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
                    {maxPages && selectedFile.type === 'application/pdf' && (
                      <span className="text-sm font-normal ml-2">
                        ({maxPages} página{maxPages > 1 ? 's' : ''})
                      </span>
                    )}
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
                  ? 'Configurando tradução...'
                  : state === 'translating'
                  ? 'Processando texto em partes...'
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
          <p>Feito com ❤️ usando Next.js e IA • API de Tradução: MyMemory</p>
        </div>
      </div>
    </main>
  );
}