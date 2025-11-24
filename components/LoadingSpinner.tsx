import React from 'react';
import { Avatar } from './Avatar';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10">
            <Avatar role="model" />
        </div>
        <div className="max-w-xl p-4 rounded-2xl shadow-sm bg-white dark:bg-gray-700 rounded-tl-none">
            <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
        </div>
    </div>
  );
};
