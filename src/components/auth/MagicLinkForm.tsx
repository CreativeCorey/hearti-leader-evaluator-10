
import { Button } from "@/components/ui/button";
import { Loader2, Mail } from "lucide-react";

interface MagicLinkFormProps {
  email: string;
  sendingMagicLink: boolean;
  onSendMagicLink: (e: React.MouseEvent) => Promise<void>;
  onBackToPassword: (e: React.MouseEvent) => void;
}

const MagicLinkForm = ({
  email,
  sendingMagicLink,
  onSendMagicLink,
  onBackToPassword
}: MagicLinkFormProps) => {
  return (
    <div className="space-y-4">
      <Button 
        type="button" 
        className="w-full" 
        onClick={onSendMagicLink}
        disabled={sendingMagicLink || !email}
      >
        {sendingMagicLink ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Link...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Send Magic Link
          </>
        )}
      </Button>
      <div className="text-center">
        <a 
          href="#" 
          onClick={onBackToPassword}
          className="text-sm text-blue-600 hover:underline"
        >
          Back to password login
        </a>
      </div>
    </div>
  );
};

export default MagicLinkForm;
