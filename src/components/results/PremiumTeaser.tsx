import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown, Check } from "lucide-react";
import { useLanguage } from '@/contexts/language/LanguageContext';

interface PremiumTeaserProps {
  tabName: string;
  features: string[];
  onUpgrade: () => void;
  previewContent?: React.ReactNode;
}

const PremiumTeaser: React.FC<PremiumTeaserProps> = ({ 
  tabName, 
  features, 
  onUpgrade, 
  previewContent 
}) => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-[500px] p-6">
      {/* Blurred preview content in background */}
      {previewContent && (
        <div className="absolute inset-0 opacity-20 blur-sm pointer-events-none">
          {previewContent}
        </div>
      )}
      
      {/* Overlay content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px] bg-background/95 backdrop-blur-sm rounded-lg border border-primary/20">
        <div className="text-center max-w-md space-y-6">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8 text-primary-foreground" />
          </div>
          
          {/* Title */}
          <div>
            <h3 className="text-2xl font-bold mb-2">
              Unlock {tabName}
            </h3>
            <p className="text-muted-foreground">
              Complete your payment to access your full HEARTI™ Leadership results and personalized growth plan
            </p>
          </div>
          
          {/* Features preview */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="text-sm font-medium mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                What's included:
              </div>
              <ul className="space-y-2 text-sm">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Upgrade button */}
          <Button 
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold"
            size="lg"
          >
            <Crown className="w-4 h-4 mr-2" />
            Start for $9.99/month
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Cancel anytime • Full access to all features • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumTeaser;