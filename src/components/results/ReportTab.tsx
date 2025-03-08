
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { ReportHeader, SpectraCharts, DimensionCard, ReportFooter } from './report';

interface ReportTabProps {
  assessment: HEARTIAssessment;
}

const aggregateData = {
  averageScores: {
    humility: 3.8,
    empathy: 3.6,
    accountability: 4.1,
    resiliency: 3.7,
    transparency: 3.9,
    inclusivity: 3.5
  }
};

const ReportTab: React.FC<ReportTabProps> = ({ assessment }) => {
  const getDimensionStatus = (dimension: HEARTIDimension): 'strength' | 'vulnerability' | 'neutral' => {
    const score = assessment.dimensionScores[dimension];
    const average = aggregateData.averageScores[dimension];
    
    if (score >= 4.0) return 'strength';
    if (score <= 2.5) return 'vulnerability';
    return 'neutral';
  };

  const getUserName = (): string => {
    return assessment.demographics?.name || "Leader";
  };
  
  const sortDimensionsForReport = () => {
    const dimensions: HEARTIDimension[] = ['inclusivity', 'humility', 'transparency', 'empathy', 'accountability', 'resiliency'];
    
    const strengths: HEARTIDimension[] = [];
    const vulnerabilities: HEARTIDimension[] = [];
    const competentSkills: HEARTIDimension[] = [];
    
    dimensions.forEach(dimension => {
      const status = getDimensionStatus(dimension);
      if (status === 'strength') strengths.push(dimension);
      else if (status === 'vulnerability') vulnerabilities.push(dimension);
      else competentSkills.push(dimension);
    });
    
    return [...strengths, ...vulnerabilities, ...competentSkills];
  };

  return (
    <>
      <ReportHeader />
      <SpectraCharts assessment={assessment} />
      
      {sortDimensionsForReport().map((dimension) => {
        const dimensionKey = dimension as HEARTIDimension;
        const status = getDimensionStatus(dimensionKey);
        const userName = getUserName();
        
        return (
          <DimensionCard 
            key={dimension}
            dimension={dimensionKey}
            assessment={assessment}
            status={status}
            userName={userName}
          />
        );
      })}
      
      <ReportFooter />
    </>
  );
};

export default ReportTab;
