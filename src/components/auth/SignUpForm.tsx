
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import OrganizationSelector from "./OrganizationSelector";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { 
  validateEmail, 
  validatePassword, 
  validateUserName, 
  validateOrganizationName, 
  sanitizeText 
} from "@/utils/input-validation";

interface SignUpFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  name: string;
  setName: (name: string) => void;
  organization: string;
  setOrganization: (organization: string) => void;
}

const SignUpForm = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  name,
  setName,
  organization,
  setOrganization
}: SignUpFormProps) => {
  const { signUp, isLoading } = useAuth();
  const [passwordError, setPasswordError] = useState("");
  const { t } = useLanguage();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error
    setPasswordError("");
    
    // Comprehensive input validation
    if (!validateEmail(email)) {
      setPasswordError("Please enter a valid email address");
      return;
    }
    
    if (name && !validateUserName(sanitizeText(name))) {
      setPasswordError("Name contains invalid characters");
      return;
    }
    
    if (organization && !validateOrganizationName(sanitizeText(organization))) {
      setPasswordError("Organization name contains invalid characters");
      return;
    }
    
    // Validate password match
    if (password !== confirmPassword) {
      setPasswordError(t('auth.passwordsDoNotMatch'));
      return;
    }
    
    // Comprehensive password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.errors[0]); // Show first error
      return;
    }
    
    // Sanitize inputs before submission
    const sanitizedName = name ? sanitizeText(name) : '';
    const sanitizedOrg = organization ? sanitizeText(organization) : '';
    
    await signUp(email, password, sanitizedName, sanitizedOrg);
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">{t('auth.fullName')}</Label>
        <Input
          id="signup-name"
          type="text"
          placeholder={t('auth.fullNamePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      
      <OrganizationSelector
        value={organization}
        onChange={setOrganization}
      />
      
      <div className="space-y-2">
        <Label htmlFor="signup-email">{t('auth.email')}</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder={t('auth.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-password">{t('auth.password')}</Label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-confirm-password">{t('auth.confirmPassword')}</Label>
        <Input
          id="signup-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {passwordError && (
          <p className="text-sm text-red-600 mt-1">{passwordError}</p>
        )}
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('auth.creatingAccount')}
          </>
        ) : (
          t('auth.createAccount')
        )}
      </Button>
    </form>
  );
};

export default SignUpForm;
