
import React, { useState } from 'react';
import { HEARTIDimension, HEARTIAssessment } from '@/types';
import DimensionTabs from './development/DimensionTabs';
import InfoBanner from './development/InfoBanner';
import ChartSection from './development/ChartSection';
import ActivitySection from './development/ActivitySection';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface DevelopmentTabProps {
  focusDimension: HEARTIDimension;
  assessments?: HEARTIAssessment[];
}

const DevelopmentTab: React.FC<DevelopmentTabProps> = ({ focusDimension, assessments = [] }) => {
  const [activeDimension, setActiveDimension] = useState<HEARTIDimension>(focusDimension);
  const [showActivities, setShowActivities] = useState(true);
  const { t } = useLanguage();
  
  // Get the most recent assessment's dimension scores
  const latestAssessment = assessments.length > 0 ? assessments[0] : null;
  const dimensionScores = latestAssessment ? latestAssessment.dimensionScores : {
    humility: 0,
    empathy: 0,
    accountability: 0,
    resiliency: 0,
    transparency: 0,
    inclusivity: 0
  };
  
  const toggleActivities = () => {
    setShowActivities(prev => !prev);
  };
  
  return (
    <div className="mb-4">
      <InfoBanner focusDimension={focusDimension} />
      
      <DimensionTabs 
        activeDimension={activeDimension} 
        onDimensionChange={setActiveDimension}
      />
      
      <ChartSection 
        activeDimension={activeDimension}
        dimensionScores={dimensionScores}
      />
      
      <ActivitySection 
        activeDimension={activeDimension}
        showActivities={showActivities}
        toggleActivities={toggleActivities}
      />
    </div>
  );
};

export default DevelopmentTab;
