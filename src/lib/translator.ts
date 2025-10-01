'use client';

let translatorReady = false;

export async function loadTranslator(
  onProgress?: (progress: number) => void
): Promise<void> {
  // Simular carregamento para manter a UX
  if (onProgress) {
    for (let i = 0; i <= 100; i += 20) {
      onProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  translatorReady = true;
}

// Mapeamento de códigos NLLB para códigos ISO
const langMap: Record<string, string> = {
  'por_Latn': 'pt',
  'eng_Latn': 'en',
  'spa_Latn': 'es',
  'fra_Latn': 'fr',
  'deu_Latn': 'de',
  'ita_Latn': 'it',
  'rus_Cyrl': 'ru',
  'jpn_Jpan': 'ja',
  'zho_Hans': 'zh',
  'ara_Arab': 'ar',
};

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string,
  onProgress?: (current: number, total: number) => void
): Promise<string> {
  if (!translatorReady) {
    throw new Error('Tradutor não foi carregado');
  }

  const source = langMap[sourceLang] || 'pt';
  const target = langMap[targetLang] || 'en';

  // Se os idiomas são iguais, retornar texto original
  if (source === target) {
    return text;
  }

  try {
    // Dividir em chunks menores (LibreTranslate funciona melhor com chunks pequenos)
    const chunks = chunkText(text, 500);
    const translatedChunks: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: chunks[i],
          source: source,
          target: target,
          format: 'text',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro da API:', errorData);
        throw new Error(`Erro na tradução: ${response.status}`);
      }

      const data = await response.json();
      translatedChunks.push(data.translatedText);
      
      if (onProgress) {
        onProgress(i + 1, chunks.length);
      }

      // Pequeno delay entre requests para não sobrecarregar API gratuita
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    return translatedChunks.join(' ');
  } catch (error) {
    console.error('Erro ao traduzir:', error);
    if (error instanceof Error) {
      throw new Error(`Falha na tradução: ${error.message}`);
    }
    throw new Error('Falha na tradução. Tente novamente.');
  }
}

function chunkText(text: string, maxLength: number): string[] {
  // Tentar dividir por sentenças primeiro
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    
    // Se uma única sentença é maior que maxLength, dividir por palavras
    if (trimmedSentence.length > maxLength) {
      if (current) {
        chunks.push(current.trim());
        current = '';
      }
      
      // Dividir sentença longa em pedaços menores
      const words = trimmedSentence.split(' ');
      let tempChunk = '';
      
      for (const word of words) {
        if ((tempChunk + ' ' + word).length > maxLength) {
          if (tempChunk) chunks.push(tempChunk.trim());
          tempChunk = word;
        } else {
          tempChunk += (tempChunk ? ' ' : '') + word;
        }
      }
      
      if (tempChunk) chunks.push(tempChunk.trim());
      continue;
    }
    
    // Adicionar sentença ao chunk atual
    if ((current + ' ' + trimmedSentence).length > maxLength) {
      if (current) chunks.push(current.trim());
      current = trimmedSentence;
    } else {
      current += (current ? ' ' : '') + trimmedSentence;
    }
  }

  if (current) {
    chunks.push(current.trim());
  }

  return chunks.filter(chunk => chunk.length > 0);
}