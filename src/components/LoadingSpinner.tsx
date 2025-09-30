'use client';

interface LoadingSpinnerProps {
  message: string;
  progress?: number;
  subMessage?: string;
}

export default function LoadingSpinner({ message, progress, subMessage }: LoadingSpinnerProps) {
  return (
    <div className="glass-card p-12 animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <div className="absolute inset-0 w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin animation-delay-150" 
               style={{ animationDirection: 'reverse' }} />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold">{message}</h3>
          {subMessage && (
            <p className="text-sm text-gray-300">{subMessage}</p>
          )}
        </div>

        {progress !== undefined && (
          <div className="w-full max-w-md">
            <div className="bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-300 shimmer"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-300 mt-2">{progress}%</p>
          </div>
        )}
      </div>
    </div>
  );
}