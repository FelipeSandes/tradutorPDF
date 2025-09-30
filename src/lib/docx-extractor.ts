// @ts-expect-error - Mammoth não tem tipos completos para browser
import * as mammoth from 'mammoth';

export async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  } catch (error) {
    console.error('Erro ao extrair texto do DOCX:', error);
    throw new Error('Falha ao processar DOCX');
  }
}