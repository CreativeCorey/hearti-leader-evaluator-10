
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { formatDataForRadarChart } from '@/utils/calculations';
import { getDimensionReportContent } from '@/utils/calculations';

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
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  const userColor = "#6366f1";
  const comparisonColors = {
    average: "#8b5cf6",
    men: "#ec4899",
    women: "#f97316"
  };
  
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
      <Card>
        <CardContent className="p-6">
          <div className="prose max-w-none">
            <h2 className="text-center text-xl font-semibold mb-4">Dear 21st Century Leader:</h2>
            <p className="mb-4">You represent the future, not the past. You were likely encouraged to develop your leadership skills by focusing on competencies designed for yesterday's Industrial Age instead of those relevant today—let alone tomorrow.</p>
            <p className="mb-4">We understand because we identified the essential leadership skills required for tomorrow's workplace. We studied recent breakthroughs in cognitive and positive psychology, organizational design, and performance management. We also talked to modern leaders across dozens of industries.</p>
            <p className="mb-4">Through this process, we understood the core competencies required for the 21st-century workplace are traits that transformational leaders use intentionally to encourage better outcomes. They are Humility, Empathy, Accountability, Resiliency, Transparency, and Inclusivity. Leaders leveraging these competencies will forge paths of innovation, creativity, and positive employee experiences. Our research also revealed that companies who hire and develop leaders with these traits perform better than those who hire and develop leaders with traditional leadership behaviors.</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="my-8">
        <h3 className="text-lg font-medium mb-4">Your HEARTI:Leader Spectra</h3>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-slate-50 p-6 rounded-lg">
            <p className="text-center font-medium text-indigo-600 mb-2">Your Results</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid gridType="polygon" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6b7280' }} />
                  <Radar
                    name="Your Score"
                    dataKey="value"
                    stroke={userColor}
                    fill={userColor}
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="flex-1 bg-slate-50 p-6 rounded-lg">
            <p className="text-center font-medium text-purple-600 mb-2">Global Benchmark</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={formatDataForRadarChart(aggregateData.averageScores)}>
                  <PolarGrid gridType="polygon" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6b7280' }} />
                  <Radar
                    name="Global Average"
                    dataKey="value"
                    stroke={comparisonColors.average}
                    fill={comparisonColors.average}
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          The HEARTI:Leader Quotient report provides you with information about your strengths and areas that you can develop further. 
          On the left side is your HEARTI:Leader Spectra - a visualization of your HEARTI competencies based on your responses. 
          On the right is the global benchmark for visual comparison. This information is a reference point only. 
          No leader is strongest in every competency, but learning how your results compare to other 21st century leaders can be insightful.
        </p>
      </div>
      
      {sortDimensionsForReport().map((dimension) => {
        const dimensionKey = dimension as HEARTIDimension;
        const status = getDimensionStatus(dimensionKey);
        const score = assessment.dimensionScores[dimensionKey];
        const userName = getUserName();
        
        const { statusContent, description, levels, tips } = getDimensionReportContent(dimensionKey, status, userName);
        
        return (
          <Card key={dimension} className="mb-8 overflow-hidden">
            <div className={`p-4 text-white ${
              status === 'strength' ? 'bg-green-600' : 
              status === 'vulnerability' ? 'bg-amber-600' : 
              'bg-blue-600'
            }`}>
              <h3 className="text-xl font-bold uppercase">{dimension}</h3>
              <div className="flex items-center mt-1">
                <Badge className="text-sm py-0.5 px-2 bg-white text-gray-800">
                  Score: {score}/5
                </Badge>
                <span className="ml-2 text-sm">
                  {status === 'strength' ? '(Strength)' : 
                   status === 'vulnerability' ? '(Vulnerability)' : 
                   '(Competent)'}
                </span>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="prose max-w-none">
                <div className="mb-4" dangerouslySetInnerHTML={{ __html: statusContent }} />
                
                <div className="mb-4" dangerouslySetInnerHTML={{ __html: description }} />
                
                {levels && (
                  <div className="mb-4">
                    <h4 className="text-lg font-medium uppercase mb-2">{dimension}</h4>
                    <div dangerouslySetInnerHTML={{ __html: levels }} />
                  </div>
                )}
                
                {tips && (
                  <div>
                    <h4 className="text-lg font-medium mb-2">Tips for increasing your {dimension} leadership:</h4>
                    <div dangerouslySetInnerHTML={{ __html: tips }} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="prose max-w-none">
            <h3 className="text-xl font-bold mb-4">Change the World:</h3>
            <p className="mb-4">
              In this HEARTI:Leader Assessment Report, we have provided you with the framework, tools, and resources 
              you need to help evolve your leadership for this new world of work—the rest is up to you. 
              We hope you will wake up every single day equipped and motivated to move our world forward.
            </p>
            <p>
              If you'd like more insights and information on how to be a HEARTI:Leader and how to foster a 
              best-in-class workplace, contact PrismWork. We have team dynamic and development workshops 
              to bring your team together with the HEARTI:Leader point of view.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ReportTab;
