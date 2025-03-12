
import React from "react";
import { CardFooter } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language/LanguageContext";

const AuthFooter = () => {
  const { t } = useLanguage();
  
  return (
    <CardFooter className="flex-col space-y-2">
      <div className="text-xs text-center text-gray-500 mt-2">
        {t('auth.termsAgreement')}{" "}
        <a
          href="https://www.prismwork.com/terms-and-conditions"
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('auth.termsOfService')}
        </a>{" "}
        {t('auth.and')}{" "}
        <a
          href="https://www.prismwork.com/terms-and-conditions"
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('auth.privacyPolicy')}
        </a>
        .
      </div>
    </CardFooter>
  );
};

export default AuthFooter;
