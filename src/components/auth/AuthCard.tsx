
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import AuthFooter from "./AuthFooter";
import SocialSignIn from "./SocialSignIn";
import { useLanguage } from "@/contexts/language/LanguageContext";

const AuthCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("none");
  const [currentTab, setCurrentTab] = useState("signin");
  const { t } = useLanguage();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t('auth.welcome')}</CardTitle>
        <CardDescription>
          {t('auth.welcomeDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SocialSignIn />
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t('auth.orContinueWithEmail')}
            </span>
          </div>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">{t('auth.signIn')}</TabsTrigger>
            <TabsTrigger value="signup">{t('auth.signUp')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <SignInForm 
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignUpForm 
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              name={name}
              setName={setName}
              organization={organization}
              setOrganization={setOrganization}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <AuthFooter />
    </Card>
  );
};

export default AuthCard;
