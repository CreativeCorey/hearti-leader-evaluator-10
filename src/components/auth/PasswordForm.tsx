
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface PasswordFormProps {
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  sendingResetEmail: boolean;
  onSendPasswordReset: (e: React.MouseEvent) => Promise<void>;
  onShowMagicLink: (e: React.MouseEvent) => void;
}

const PasswordForm = ({
  password,
  setPassword,
  isLoading,
  sendingResetEmail,
  onSendPasswordReset,
  onShowMagicLink
}: PasswordFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signin-password">Password</Label>
        <Input
          id="signin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
      
      <div className="flex justify-between text-sm">
        <a 
          href="#" 
          onClick={onSendPasswordReset}
          className="text-blue-600 hover:underline"
        >
          {sendingResetEmail ? (
            <span className="flex items-center">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Sending...
            </span>
          ) : (
            "Forgot Password?"
          )}
        </a>
        <a 
          href="#" 
          onClick={onShowMagicLink}
          className="text-blue-600 hover:underline"
        >
          Sign in with Magic Link
        </a>
      </div>
    </div>
  );
};

export default PasswordForm;
