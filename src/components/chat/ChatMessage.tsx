
import React from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  username: string;
  user_id: string;
  created_at: string;
}

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwn }) => {
  // Format the timestamp
  const formattedTime = format(new Date(message.created_at), 'h:mm a');
  
  return (
    <div className={cn(
      "flex",
      isOwn ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-2",
        isOwn 
          ? "bg-indigo-600 text-white rounded-tr-none" 
          : "bg-gray-100 dark:bg-gray-800 rounded-tl-none"
      )}>
        {!isOwn && (
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            {message.username}
          </p>
        )}
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <p className={cn(
          "text-xs mt-1 text-right",
          isOwn ? "text-indigo-200" : "text-gray-500 dark:text-gray-400"
        )}>
          {formattedTime}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
