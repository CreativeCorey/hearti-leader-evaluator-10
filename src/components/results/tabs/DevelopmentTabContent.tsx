
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import DevelopmentTab from '../DevelopmentTab';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface DevelopmentTabContentProps {
  assessments: HEARTIAssessment[];
  topDevelopmentArea: HEARTIDimension;
}

const DevelopmentTabContent: React.FC<DevelopmentTabContentProps> = ({ 
  assessments, 
  topDevelopmentArea 
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-bold mb-4 text-left">{t('results.development.heartiCoach', { fallback: "HEARTI Coach" })}</h2>
        <p className="text-muted-foreground leading-relaxed text-left">
          Welcome to your personal journey in becoming a HEARTI Leader, guided by your dedicated HEARTI Leadership Coach. 
          The HEARTI model empowers you to inspire engaged teams and drive better outcomes. Leveraging insights about your 
          unique strengths and vulnerabilities, your coach will help you translate understanding into actionable steps. 
          To effectively develop, choose 3-5 daily habits from the cards below related to your HEARTI skills, focusing on 
          both enhancing strengths and addressing vulnerabilities, and track your progress. Consistent practice will build 
          new patterns, driving your growth and increasing your impact as you apply these powerful leadership competencies.
        </p>
      </div>
      
      <DevelopmentTab focusDimension={topDevelopmentArea} assessments={assessments} />
    </div>
  );
};

export default DevelopmentTabContent;
