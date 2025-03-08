
import { toast } from '@/hooks/use-toast';

export const showSuccessToast = (title: string, description: string) => {
  toast({
    title,
    description,
  });
};

export const showErrorToast = (title: string, description: string) => {
  toast({
    title,
    description,
    variant: "destructive",
  });
};
