
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";

interface SubscriptionCardProps {
  isSubscribed: boolean;
  subscriptionTier?: string | null;
  subscriptionEnd?: string | null;
  onRefresh: () => void;
}

export function SubscriptionCard({ 
  isSubscribed, 
  subscriptionTier, 
  subscriptionEnd,
  onRefresh 
}: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        body: { origin: window.location.origin }
      });

      if (error) throw error;
      if (!data?.url) throw new Error('No portal URL received');

      window.location.href = data.url;
    } catch (error) {
      console.error('Portal error:', error);
      toast({
        title: "Error",
        description: "Could not open subscription management portal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Subscription Status</CardTitle>
        <CardDescription>
          Manage your subscription and billing information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isSubscribed ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className="font-medium">
            {isSubscribed ? 'Active Subscription' : 'No Active Subscription'}
          </span>
        </div>
        {isSubscribed && subscriptionTier && (
          <div className="text-sm text-muted-foreground">
            <p>Plan: {subscriptionTier}</p>
            {subscriptionEnd && (
              <p>Next billing date: {new Date(subscriptionEnd).toLocaleDateString()}</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleManageSubscription} 
          disabled={loading || !isSubscribed}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Manage Subscription
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
