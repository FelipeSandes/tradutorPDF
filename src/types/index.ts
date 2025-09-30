export interface FileData {
  file: File;
  name: string;
  size: number;
  type: 'pdf' | 'docx';
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: Date;
}

export interface Language {
  code: string;
  name: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'por_Latn', name: 'Português', nativeLabel: 'Português' },
  { code: 'eng_Latn', name: 'Inglês', nativeLabel: 'English' },
  { code: 'spa_Latn', name: 'Espanhol', nativeLabel: 'Español' },
  { code: 'fra_Latn', name: 'Francês', nativeLabel: 'Français' },
  { code: 'deu_Latn', name: 'Alemão', nativeLabel: 'Deutsch' },
  { code: 'ita_Latn', name: 'Italiano', nativeLabel: 'Italiano' },
  { code: 'rus_Cyrl', name: 'Russo', nativeLabel: 'Русский' },
  { code: 'jpn_Jpan', name: 'Japonês', nativeLabel: '日本語' },
  { code: 'zho_Hans', name: 'Chinês', nativeLabel: '简体中文' },
  { code: 'ara_Arab', name: 'Árabe', nativeLabel: 'العربية' },
];
