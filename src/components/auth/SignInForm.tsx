
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

interface SignInFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

const SignInForm = ({ email, setEmail, password, setPassword }: SignInFormProps) => {
  const { signIn, isLoading, sendMagicLink, sendPasswordResetEmail } = useAuth();
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [showMagicLinkOption, setShowMagicLinkOption] = useState(false);
  const [sendingMagicLink, setSendingMagicLink] = useState(false);
  const [sendingResetEmail, setSendingResetEmail] = useState(false);
  const [actionMessage, setActionMessage] = useState<{text: string, type: "success" | "error"} | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn(email, password);
    // Marketing consent is stored in localStorage and will be saved to profile
    // when the user successfully signs in
    if (marketingConsent) {
      localStorage.setItem("marketing_consent", "true");
    }
  };

  const handleSendMagicLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setActionMessage({
        text: "Please enter your email address first",
        type: "error"
      });
      return;
    }
    
    setSendingMagicLink(true);
    try {
      await sendMagicLink(email);
      setActionMessage({
        text: "Magic link sent! Please check your email",
        type: "success"
      });
    } catch (error) {
      setActionMessage({
        text: "Failed to send magic link. Please try again",
        type: "error"
      });
      console.error("Error sending magic link:", error);
    } finally {
      setSendingMagicLink(false);
    }
  };

  const handleSendPasswordReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setActionMessage({
        text: "Please enter your email address first",
        type: "error"
      });
      return;
    }
    
    setSendingResetEmail(true);
    try {
      await sendPasswordResetEmail(email);
      setActionMessage({
        text: "Password reset email sent! Please check your email",
        type: "success"
      });
    } catch (error) {
      setActionMessage({
        text: "Failed to send reset email. Please try again",
        type: "error"
      });
      console.error("Error sending password reset:", error);
    } finally {
      setSendingResetEmail(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="signin-email">Email</Label>
        <Input
          id="signin-email"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      {!showMagicLinkOption && (
        <div className="space-y-2">
          <Label htmlFor="signin-password">Password</Label>
          <Input
            id="signin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!showMagicLinkOption}
          />
        </div>
      )}
      
      {/* Marketing consent checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="marketing-consent" 
          checked={marketingConsent} 
          onCheckedChange={(checked) => setMarketingConsent(checked === true)}
        />
        <Label htmlFor="marketing-consent" className="text-sm text-muted-foreground">
          Add me to the mailing list for product updates and marketing information. Your personal information will not be shared.
        </Label>
      </div>
      
      {actionMessage && (
        <div className={`text-sm p-2 rounded ${actionMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {actionMessage.text}
        </div>
      )}
      
      {showMagicLinkOption ? (
        <div className="space-y-4">
          <Button 
            type="button" 
            className="w-full" 
            onClick={handleSendMagicLink}
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
              onClick={(e) => {
                e.preventDefault();
                setShowMagicLinkOption(false);
                setActionMessage(null);
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Back to password login
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
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
              onClick={handleSendPasswordReset}
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
              onClick={(e) => {
                e.preventDefault();
                setShowMagicLinkOption(true);
                setActionMessage(null);
              }}
              className="text-blue-600 hover:underline"
            >
              Sign in with Magic Link
            </a>
          </div>
        </div>
      )}
    </form>
  );
};

export default SignInForm;
