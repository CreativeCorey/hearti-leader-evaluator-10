
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordForm from "./PasswordForm";
import MagicLinkForm from "./MagicLinkForm";
import ActionMessage from "./ActionMessage";
import MarketingConsentCheckbox from "./MarketingConsentCheckbox";

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

  const handleShowMagicLink = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMagicLinkOption(true);
    setActionMessage(null);
  };

  const handleBackToPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMagicLinkOption(false);
    setActionMessage(null);
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
        <PasswordForm
          password={password}
          setPassword={setPassword}
          isLoading={isLoading}
          sendingResetEmail={sendingResetEmail}
          onSendPasswordReset={handleSendPasswordReset}
          onShowMagicLink={handleShowMagicLink}
        />
      )}
      
      <MarketingConsentCheckbox
        checked={marketingConsent}
        onCheckedChange={setMarketingConsent}
      />
      
      <ActionMessage message={actionMessage} />
      
      {showMagicLinkOption && (
        <MagicLinkForm
          email={email}
          sendingMagicLink={sendingMagicLink}
          onSendMagicLink={handleSendMagicLink}
          onBackToPassword={handleBackToPassword}
        />
      )}
    </form>
  );
};

export default SignInForm;
