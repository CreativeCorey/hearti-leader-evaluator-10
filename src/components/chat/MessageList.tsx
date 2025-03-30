
import React, { useRef, useEffect } from 'react';
import ChatMessage from '@/components/chat/ChatMessage';

interface Message {
  id: string;
  content: string;
  username: string;
  user_id: string;
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  userId?: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading, userId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages.length]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">No messages yet. Be the first to say something!</p>
      </div>
    );
  }

  return (
    <>
      {messages.map((message) => (
        <ChatMessage 
          key={message.id} 
          message={message} 
          isOwn={userId === message.user_id}
        />
      ))}
      <div ref={messagesEndRef} />
    </>
  );
};

export default MessageList;
