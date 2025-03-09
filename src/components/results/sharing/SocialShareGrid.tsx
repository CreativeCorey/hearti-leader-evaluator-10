
import React from 'react';
import { Linkedin, Twitter, Instagram, Mail, MessageCircle, Slack } from 'lucide-react';
import SocialShareButton from './SocialShareButton';

interface SocialShareGridProps {
  onShareToSocial: (platform: string) => void;
}

const SocialShareGrid: React.FC<SocialShareGridProps> = ({ onShareToSocial }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <SocialShareButton 
        icon={<Linkedin size={18} />} 
        label="LinkedIn" 
        onClick={() => onShareToSocial('linkedin')}
      />
      
      <SocialShareButton 
        icon={<Twitter size={18} />} 
        label="Twitter/X" 
        onClick={() => onShareToSocial('twitter')}
      />
      
      <SocialShareButton 
        icon={<Instagram size={18} />} 
        label="Instagram" 
        onClick={() => onShareToSocial('instagram')}
      />
      
      <SocialShareButton 
        icon={<MessageCircle size={18} />} 
        label="WhatsApp" 
        onClick={() => onShareToSocial('whatsapp')}
      />
      
      <SocialShareButton 
        icon={<MessageCircle size={18} />} 
        label="Bluesky" 
        onClick={() => onShareToSocial('bluesky')}
      />
      
      <SocialShareButton 
        icon={<Slack size={18} />} 
        label="Slack" 
        onClick={() => onShareToSocial('slack')}
      />
      
      <SocialShareButton 
        icon={<Mail size={18} />} 
        label="Email" 
        onClick={() => onShareToSocial('email')}
      />
      
      <SocialShareButton 
        icon={<MessageCircle size={18} />} 
        label="Teams" 
        onClick={() => onShareToSocial('teams')}
      />
      
      <SocialShareButton 
        icon={<MessageCircle size={18} />} 
        label="Threads" 
        onClick={() => onShareToSocial('threads')}
        className="col-span-2 md:col-span-1"
      />
      
      <SocialShareButton 
        icon={<MessageCircle size={18} />} 
        label="Fanbase" 
        onClick={() => onShareToSocial('fanbase')}
        className="col-span-2 md:col-span-1"
      />
    </div>
  );
};

export default SocialShareGrid;
