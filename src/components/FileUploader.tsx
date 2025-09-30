'use client';

import { useState, useCallback } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export default function FileUploader({ onFileSelect, selectedFile, onClear }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSelectFile = useCallback((file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(file.type)) {
      alert('Por favor, envie apenas arquivos PDF ou DOCX');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Arquivo muito grande! Máximo 10MB');
      return;
    }

    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      validateAndSelectFile(files[0]);
    }
  }, [validateAndSelectFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      validateAndSelectFile(files[0]);
    }
  };

  if (selectedFile) {
    return (
      <div className="glass-card p-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-green-500/20 p-3 rounded-2xl">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-lg">{selectedFile.name}</p>
              <p className="text-sm text-gray-300">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="p-2 hover:bg-red-500/20 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-red-400" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`
        glass-card p-12 cursor-pointer transition-all duration-300
        ${isDragging ? 'scale-105 border-indigo-400 bg-indigo-500/20' : 'hover:scale-102'}
      `}
    >
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex flex-col items-center gap-6">
          <div className="floating">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl shadow-2xl">
              <Upload className="w-16 h-16" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">
              {isDragging ? 'Solte o arquivo aqui!' : 'Arraste seu documento'}
            </h3>
            <p className="text-gray-300">
              ou clique para selecionar
            </p>
            <div className="flex items-center gap-4 mt-4 justify-center">
              <span className="bg-white/10 px-4 py-2 rounded-full text-sm">
                📄 PDF
              </span>
              <span className="bg-white/10 px-4 py-2 rounded-full text-sm">
                📝 DOCX
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-4">Máximo 10MB</p>
          </div>
        </div>
      </label>
    </div>
  );
}