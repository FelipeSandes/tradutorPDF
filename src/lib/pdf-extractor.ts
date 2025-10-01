'use client';

export async function extractTextFromPDF(file: File, maxPages?: number): Promise<string> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    
    // Usar worker de um CDN alternativo (jsDelivr é mais confiável)
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    interface TextItem {
      str: string;
    }

    interface TextMarkedContent {
      type: string;
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const totalPages = pdf.numPages;
    const pagesToExtract = maxPages && maxPages < totalPages ? maxPages : totalPages;
    
    let fullText = '';

    // Adicionar informação sobre quantas páginas estão sendo extraídas
    if (maxPages && maxPages < totalPages) {
      fullText += `[Extraindo ${pagesToExtract} de ${totalPages} páginas]\n\n`;
    }

    for (let i = 1; i <= pagesToExtract; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: TextItem | TextMarkedContent) => {
          if ('str' in item) {
            return item.str;
          }
          return '';
        })
        .join(' ');
      
      fullText += `--- Página ${i} ---\n${pageText}\n\n`;
    }

    return fullText.trim();
  } catch (error) {
    console.error('Erro ao extrair texto do PDF:', error);
    throw new Error('Falha ao processar PDF: ' + (error instanceof Error ? error.message : 'erro desconhecido'));
  }
}

export async function extractTextFromDOCX(file: File): Promise<string> {
  const mammoth = await import('mammoth');
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  } catch (error) {
    console.error('Erro ao extrair texto do DOCX:', error);
    throw new Error('Falha ao processar DOCX');
  }
}