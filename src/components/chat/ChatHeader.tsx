
import React from 'react';
import { Users } from 'lucide-react';

const ChatHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4 rounded-t-lg flex items-center gap-2">
      <Users className="h-6 w-6" />
      <h2 className="text-xl font-bold">Group Chat</h2>
    </div>
  );
};

export default ChatHeader;
