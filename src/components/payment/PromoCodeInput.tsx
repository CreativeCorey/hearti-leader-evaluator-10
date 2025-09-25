import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Timer } from 'lucide-react';
import { usePromoCode } from '@/hooks/usePromoCode';

interface PromoCodeInputProps {
  onPromoApplied?: () => void;
}

export const PromoCodeInput: React.FC<PromoCodeInputProps> = ({ onPromoApplied }) => {
  const [promoCode, setPromoCode] = useState('');
  const { 
    isValidating, 
    activePromoCode, 
    applyPromoCode, 
    getRemainingTrialDays, 
    hasTrialAccess 
  } = usePromoCode();

  const handleApplyCode = async () => {
    const success = await applyPromoCode(promoCode.trim());
    if (success) {
      setPromoCode('');
      onPromoApplied?.();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCode();
    }
  };

  // If user has an active trial, show trial status
  if (hasTrialAccess()) {
    const remainingDays = getRemainingTrialDays();
    
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">Active Trial</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 font-medium">
                Premium features unlocked!
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Timer className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">
                  {remainingDays} day{remainingDays !== 1 ? 's' : ''} remaining
                </span>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Trial Active
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          <CardTitle>Have a Promo Code?</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Enter a promo code to unlock trial access to premium features.
          </p>
          
          <div className="flex gap-2">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isValidating}
            />
            <Button 
              onClick={handleApplyCode}
              disabled={!promoCode.trim() || isValidating}
              variant="outline"
            >
              {isValidating ? 'Validating...' : 'Apply'}
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Contact your administrator for available promo codes
          </div>
        </div>
      </CardContent>
    </Card>
  );
};