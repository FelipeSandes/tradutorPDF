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
  'por_Latn': 'pt-BR',
  'eng_Latn': 'en-US',
  'spa_Latn': 'es-ES',
  'fra_Latn': 'fr-FR',
  'deu_Latn': 'de-DE',
  'ita_Latn': 'it-IT',
  'rus_Cyrl': 'ru-RU',
  'jpn_Jpan': 'ja-JP',
  'zho_Hans': 'zh-CN',
  'ara_Arab': 'ar-SA',
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

  const source = langMap[sourceLang] || 'pt-BR';
  const target = langMap[targetLang] || 'en-US';

  // Se os idiomas são iguais, retornar texto original
  if (source === target) {
    return text;
  }

  try {
    // MyMemory API - totalmente grátis, sem API key
    // Dividir em chunks menores (MyMemory tem limite de 500 caracteres por request)
    const chunks = chunkText(text, 450);
    const translatedChunks: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const encodedText = encodeURIComponent(chunks[i]);
      const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${source}|${target}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Erro da API MyMemory:', response.status);
        throw new Error(`Erro na tradução: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.responseStatus !== 200) {
        console.error('Erro da API:', data);
        throw new Error('Erro ao traduzir. Tente com um texto menor.');
      }

      translatedChunks.push(data.responseData.translatedText);
      
      if (onProgress) {
        onProgress(i + 1, chunks.length);
      }

      // Delay entre requests (MyMemory tem limite de taxa)
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
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