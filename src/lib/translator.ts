import { pipeline, env } from '@xenova/transformers';

env.allowLocalModels = true;
env.allowRemoteModels = true;

interface TranslationPipeline {
  (text: string, options: { src_lang: string; tgt_lang: string }): Promise<Array<{ translation_text: string }>>;
}

interface ProgressCallback {
  status?: string;
  loaded?: number;
  total?: number;
}

let translatorInstance: TranslationPipeline | null = null;

export async function loadTranslator(
  onProgress?: (progress: number) => void
): Promise<void> {
  if (translatorInstance) return;

  try {
    translatorInstance = await pipeline(
      'translation',
      'Xenova/nllb-200-distilled-600M',
      {
        progress_callback: (progress: ProgressCallback) => {
          if (onProgress && progress.status === 'progress' && progress.loaded && progress.total) {
            const percentage = Math.round((progress.loaded / progress.total) * 100);
            onProgress(percentage);
          }
        },
      }
    ) as TranslationPipeline;
  } catch (error) {
    console.error('Erro ao carregar modelo de tradução:', error);
    throw new Error('Falha ao carregar o modelo de tradução');
  }
}

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string,
  onProgress?: (current: number, total: number) => void
): Promise<string> {
  if (!translatorInstance) {
    throw new Error('Tradutor não foi carregado');
  }

  try {
    const chunks = chunkText(text, 512);
    const translatedChunks: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const result = await translatorInstance(chunks[i], {
        src_lang: sourceLang,
        tgt_lang: targetLang,
      });

      translatedChunks.push(result[0].translation_text);
      
      if (onProgress) {
        onProgress(i + 1, chunks.length);
      }
    }

    return translatedChunks.join(' ');
  } catch (error) {
    console.error('Erro ao traduzir texto:', error);
    throw new Error('Falha na tradução');
  }
}

function chunkText(text: string, maxLength: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if ((current + sentence).length > maxLength) {
      if (current) chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }

  if (current) chunks.push(current.trim());
  return chunks;
}