import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PromoCode, PromoCodeUse } from '@/types/pulseTest';

export const usePromoCode = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState(false);
  const [activePromoCode, setActivePromoCode] = useState<PromoCodeUse | null>(null);

  // Validate and apply promo code
  const applyPromoCode = async (code: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to use a promo code.",
        variant: "destructive"
      });
      return false;
    }

    setIsValidating(true);

    try {
      // Check if promo code exists and is valid
      const { data: promoData, error: promoError } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code)
        .eq('active', true)
        .maybeSingle();

      if (promoError) throw promoError;

      if (!promoData) {
        toast({
          title: "Invalid Code",
          description: "The promo code you entered is not valid or has expired.",
          variant: "destructive"
        });
        return false;
      }

      // Check if user has already used this promo code
      const { data: existingUse, error: useError } = await supabase
        .from('promo_code_uses')
        .select('*')
        .eq('promo_code_id', promoData.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (useError && useError.code !== 'PGRST116') throw useError;

      if (existingUse) {
        toast({
          title: "Already Used",
          description: "You have already used this promo code.",
          variant: "destructive"
        });
        return false;
      }

      // Check max uses limit
      if (promoData.max_uses && promoData.current_uses >= promoData.max_uses) {
        toast({
          title: "Code Expired",
          description: "This promo code has reached its usage limit.",
          variant: "destructive"
        });
        return false;
      }

      // Create promo code use record
      const trialStartDate = new Date();
      const trialEndDate = new Date();
      trialEndDate.setDate(trialStartDate.getDate() + promoData.trial_days);

      const { data: useData, error: createError } = await supabase
        .from('promo_code_uses')
        .insert({
          promo_code_id: promoData.id,
          user_id: user.id,
          trial_start_date: trialStartDate.toISOString(),
          trial_end_date: trialEndDate.toISOString()
        })
        .select()
        .single();

      if (createError) throw createError;

      // Update promo code usage count
      await supabase
        .from('promo_codes')
        .update({ current_uses: promoData.current_uses + 1 })
        .eq('id', promoData.id);

      const mappedUseData: PromoCodeUse = {
        id: useData.id,
        promoCodeId: useData.promo_code_id,
        userId: useData.user_id,
        usedAt: useData.used_at,
        trialStartDate: useData.trial_start_date,
        trialEndDate: useData.trial_end_date,
        createdAt: useData.created_at
      };
      
      setActivePromoCode(mappedUseData);

      toast({
        title: "Success!",
        description: `Promo code applied! You now have a ${promoData.trial_days}-day trial of premium features.`,
      });

      return true;
    } catch (error) {
      console.error('Error applying promo code:', error);
      toast({
        title: "Error",
        description: "Failed to apply promo code. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  // Check if user has an active trial
  const checkActiveTrialStatus = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('promo_code_uses')
        .select('*')
        .eq('user_id', user.id)
        .gte('trial_end_date', new Date().toISOString())
        .order('trial_end_date', { ascending: false })
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const mappedData: PromoCodeUse = {
          id: data.id,
          promoCodeId: data.promo_code_id,
          userId: data.user_id,
          usedAt: data.used_at,
          trialStartDate: data.trial_start_date,
          trialEndDate: data.trial_end_date,
          createdAt: data.created_at
        };
        setActivePromoCode(mappedData);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking trial status:', error);
      return false;
    }
  };

  // Get remaining trial days
  const getRemainingTrialDays = (): number => {
    if (!activePromoCode) return 0;

    const now = new Date();
    const trialEnd = new Date(activePromoCode.trialEndDate);
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  };

  // Check if user has trial access
  const hasTrialAccess = (): boolean => {
    return activePromoCode !== null && getRemainingTrialDays() > 0;
  };

  return {
    isValidating,
    activePromoCode,
    applyPromoCode,
    checkActiveTrialStatus,
    getRemainingTrialDays,
    hasTrialAccess
  };
};