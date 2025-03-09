
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SocialShareButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  className?: string;
}

const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  icon,
  label,
  onClick,
  variant = 'outline',
  className
}) => {
  return (
    <Button 
      variant={variant} 
      className={cn("w-full flex items-center justify-center gap-2", className)} 
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
};

export default SocialShareButton;
