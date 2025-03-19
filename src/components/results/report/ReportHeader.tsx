
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HEARTIAssessment } from '@/types';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface ReportHeaderProps {
  assessment: HEARTIAssessment;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ assessment }) => {
  const { t } = useLanguage();
  
  // Get translated title and content from the language provider
  const title = t('report.header.title', { 
    fallback: "Dear 21st Century Leader:" 
  });
  
  const content = t('report.header.content', { 
    fallback: `You represent the future, not the past. You were likely encouraged to develop your leadership skills by focusing on competencies designed for yesterday's Industrial Age instead of those relevant today—let alone tomorrow.

We understand because we identified the essential leadership skills required for tomorrow's workplace. We studied recent breakthroughs in cognitive and positive psychology, organizational design, and performance management. We also talked to modern leaders across dozens of industries.

Through this process, we understood the core competencies required for the 21st-century workplace are traits that transformational leaders use intentionally to encourage better outcomes. They are Humility, Empathy, Accountability, Resiliency, Transparency, and Inclusivity. Leaders leveraging these competencies will forge paths of innovation, creativity, and positive employee experiences. Our research also revealed that companies who hire and develop leaders with these traits perform better than those who hire and develop leaders with traditional leadership behaviors.`
  });
  
  return (
    <Card className="pdf-header">
      <CardContent className="p-6">
        <div className="prose max-w-none">
          <h2 className="text-center text-xl font-semibold mb-4 pdf-title">{title}</h2>
          {content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportHeader;
