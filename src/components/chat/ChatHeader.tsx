
import React from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  title: string;
  type: 'group' | 'space' | 'direct';
  participants?: number;
  onBack?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  title, 
  type, 
  participants = 0,
  onBack
}) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center space-x-3">
        {onBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="hidden md:flex h-9 w-9 rounded-full"
          >
            <ArrowLeft size={18} />
          </Button>
        )}
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {type === 'group' && participants > 0 && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users size={14} className="mr-1" />
              <span>{participants} participants</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
