
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { HEARTIAssessment } from '@/types';
import ShareModal from './ShareModal';
import { useIsMobile } from '@/hooks/use-mobile';

interface ShareButtonProps {
  assessment: HEARTIAssessment;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  assessment,
  variant = 'outline',
  size = 'default',
  className
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsShareModalOpen(true)}
        className={`whitespace-nowrap ${className || ''}`}
      >
        <Share2 className={size === "sm" ? "mr-1" : "mr-2"} size={16} />
        {size === "sm" ? "Share" : "Share Results"}
      </Button>
      
      <ShareModal
        assessment={assessment}
        open={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
      />
    </>
  );
};

export default ShareButton;
