
import React, { useState } from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertTriangle, Copy, Linkedin } from 'lucide-react';
import { showSuccessToast } from '@/utils/notifications';

interface LinkedInBadgeProps {
  assessment: HEARTIAssessment;
}

const LinkedInBadge: React.FC<LinkedInBadgeProps> = ({ assessment }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get top strength
  const sortedDimensions = Object.entries(assessment.dimensionScores)
    .sort(([, a], [, b]) => b - a)
    .map(([dimension]) => dimension as HEARTIDimension);
  
  const topStrength = sortedDimensions[0];
  const topStrengthCapitalized = topStrength.charAt(0).toUpperCase() + topStrength.slice(1);
  
  const badgeMarkdown = `
HEARTI:Leader Assessment
- Top Strength: ${topStrengthCapitalized}
- Overall Score: ${assessment.overallScore}/5
  `.trim();
  
  const handleCopyBadge = async () => {
    try {
      await navigator.clipboard.writeText(badgeMarkdown);
      showSuccessToast("Badge copied", "Add it to your LinkedIn profile's About section");
    } catch (error) {
      console.error('Failed to copy badge:', error);
    }
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Linkedin size={16} />
        Add Badge to LinkedIn
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add HEARTI:Leader Badge to LinkedIn</DialogTitle>
            <DialogDescription>
              Showcase your HEARTI:Leader assessment results on your LinkedIn profile
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <pre className="whitespace-pre-wrap text-sm">{badgeMarkdown}</pre>
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleCopyBadge}
              className="w-full"
            >
              <Copy size={16} className="mr-2" />
              Copy Badge Text
            </Button>
            
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 flex gap-2 text-sm">
              <AlertTriangle size={18} className="text-yellow-600 shrink-0 mt-0.5" />
              <div className="text-yellow-800">
                <p className="font-medium">How to add this badge to LinkedIn:</p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Copy the badge text above</li>
                  <li>Go to your LinkedIn profile</li>
                  <li>Edit your "About" section</li>
                  <li>Paste the badge text at the beginning or end</li>
                  <li>Save your profile</li>
                </ol>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LinkedInBadge;
