
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/language/LanguageContext';

const ReportFooter: React.FC = () => {
  const { t } = useLanguage();
  
  const changeWorldTitle = t('report.footer.title', {
    fallback: "Change the World:"
  });
  
  const changeWorldContent = t('report.footer.content', {
    fallback: `In this HEARTI:Leader Assessment Report, we have provided you with the framework, tools, and resources 
you need to help evolve your leadership for this new world of work—the rest is up to you. 
We hope you will wake up every single day equipped and motivated to move our world forward.

If you'd like more insights and information on how to be a HEARTI:Leader and how to foster a 
best-in-class workplace, contact PrismWork. We have team dynamic and development workshops 
to bring your team together with the HEARTI:Leader point of view.`
  });
  
  return (
    <Card className="mt-8 mb-8 pdf-footer">
      <CardContent className="p-6">
        <div className="prose max-w-none">
          <h3 className="text-xl font-bold mb-4">{changeWorldTitle}</h3>
          {changeWorldContent.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportFooter;
