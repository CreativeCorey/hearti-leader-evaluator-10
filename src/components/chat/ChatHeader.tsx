
import React from 'react';
import { Users } from 'lucide-react';

interface ChatHeaderProps {
  title?: string;
  type?: 'group' | 'space' | 'direct';
  participants?: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  title = 'Group Chat', 
  type = 'group',
  participants = 0
}) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4 rounded-t-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6" />
        <h2 className="text-xl font-bold">{title}</h2>
        {participants > 0 && (
          <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
            {participants} {participants === 1 ? 'member' : 'members'}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
