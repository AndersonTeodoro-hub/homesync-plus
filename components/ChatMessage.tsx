import React from 'react';
import type { Message } from '../types';
import { Avatar } from './Avatar';
import { ThumbsUpIcon, ThumbsDownIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
  onFeedback: (messageId: number, feedback: 'positive' | 'negative') => void;
}

// Simple formatter to replace 'marked' library and avoid import errors
const formatMessageContent = (content: string) => {
  const lines = content.split('\n');
  let inList = false;
  let html = '';

  lines.forEach((line, index) => {
    // Basic Bold parsing: **text** -> <strong>text</strong>
    let processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Basic Italic parsing: *text* -> <em>text</em>
    processedLine = processedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');

    const isListItem = line.trim().startsWith('* ') || line.trim().startsWith('- ');

    if (isListItem) {
      if (!inList) {
        html += '<ul class="list-disc pl-5 my-2">';
        inList = true;
      }
      // Remove the bullet point
      const itemContent = processedLine.replace(/^[\*\-]\s+/, '');
      html += `<li>${itemContent}</li>`;
    } else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      if (line.trim() !== '') {
        html += `<p class="mb-2">${processedLine}</p>`;
      }
    }
  });

  if (inList) html += '</ul>';
  return html;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onFeedback }) => {
  const isModel = message.role === 'model';
  const formattedHtml = formatMessageContent(message.content);

  return (
    <div className={`flex items-start gap-3 ${isModel ? '' : 'flex-row-reverse'}`}>
       <div className="flex-shrink-0 w-8 h-8">
        <Avatar role={message.role} />
       </div>
      <div
        className={`max-w-md p-3 rounded-2xl shadow-md relative backdrop-blur-sm ${
          isModel
            ? 'bg-black/20 text-white/90 rounded-tl-none'
            : 'bg-white/20 text-white rounded-tr-none'
        }`}
      >
        <div 
          className="prose prose-sm prose-invert max-w-none prose-p:my-0 prose-ul:my-2 prose-ol:my-2 prose-strong:text-white prose-a:text-cyan-300 hover:prose-a:underline prose-li:marker:text-cyan-400 prose-blockquote:border-l-cyan-300 prose-blockquote:pl-4 prose-blockquote:text-white/80"
          dangerouslySetInnerHTML={{ __html: formattedHtml }} 
        />
        {isModel && (
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => onFeedback(message.id, 'positive')}
              className={`p-1 rounded-full transition-colors ${message.feedback === 'positive' ? 'text-green-400 bg-green-500/20' : 'text-gray-400 hover:text-green-400 hover:bg-gray-500/20'}`}
              aria-label="Good response"
            >
              <ThumbsUpIcon filled={message.feedback === 'positive'} />
            </button>
            <button
              onClick={() => onFeedback(message.id, 'negative')}
              className={`p-1 rounded-full transition-colors ${message.feedback === 'negative' ? 'text-red-400 bg-red-500/20' : 'text-gray-400 hover:text-red-400 hover:bg-gray-500/20'}`}
              aria-label="Bad response"
            >
              <ThumbsDownIcon filled={message.feedback === 'negative'} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};