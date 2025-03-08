import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer, 
  Tooltip,
  Legend 
} from 'recharts';
import { 
  HEARTIAssessment, 
  HEARTIDimension
} from '../types';
import { 
  formatDataForRadarChart, 
  getFeedback,
  getDimensionDescription,
  getDimensionReportContent
} from '../utils/calculations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Heart, Users, Target, FileText, Download, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResultsDisplayProps {
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
  },
  demographics: {
    gender: {
      men: {
        humility: 3.6,
        empathy: 3.5,
        accountability: 4.0,
        resiliency: 3.8,
        transparency: 3.7,
        inclusivity: 3.3
      },
      women: {
        humility: 4.0,
        empathy: 3.9,
        accountability: 4.2,
        resiliency: 3.6,
        transparency: 4.1,
        inclusivity: 3.8
      }
    }
  }
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ assessment }) => {
  const { toast } = useToast();
  const [compareMode, setCompareMode] = useState<'none' | 'average' | 'men' | 'women'>('none');
  const [chartView, setChartView] = useState<'combined' | 'separate'>('combined');
  const [exportingPdf, setExportingPdf] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  const formattedDate = format(new Date(assessment.date), 'MMMM d, yyyy');
  
  const sortedDimensions = Object.entries(assessment.dimensionScores)
    .sort(([, a], [, b]) => b - a)
    .map(([dimension]) => dimension as HEARTIDimension);
  
  const topStrength = sortedDimensions[0];
  const developmentArea = sortedDimensions[sortedDimensions.length - 1];

  const getComparisonData = () => {
    if (compareMode === 'none') {
      return null;
    }
    
    let comparisonScores;
    
    if (compareMode === 'average') {
      comparisonScores = aggregateData.averageScores;
    } else if (compareMode === 'men') {
      comparisonScores = aggregateData.demographics.gender.men;
    } else if (compareMode === 'women') {
      comparisonScores = aggregateData.demographics.gender.women;
    }
    
    if (comparisonScores) {
      return formatDataForRadarChart(comparisonScores);
    }
    
    return null;
  };
  
  const combinedChartData = chartData.map((item, index) => {
    const comparisonData = getComparisonData();
    if (comparisonData) {
      return {
        ...item,
        comparisonValue: comparisonData[index].value
      };
    }
    return item;
  });

  const getBadgeVariant = (score: number) => {
    if (score >= 4.5) return "default";
    if (score >= 3.5) return "secondary";
    if (score >= 2.5) return "outline";
    return "destructive";
  };

  const getComparisonLabel = () => {
    switch (compareMode) {
      case 'average': return 'Average';
      case 'men': return 'Men';
      case 'women': return 'Women';
      default: return '';
    }
  };

  const userColor = "#6366f1";
  const comparisonColors = {
    average: "#8b5cf6",
    men: "#ec4899",
    women: "#f97316"
  };

  const getComparisonColor = () => {
    switch (compareMode) {
      case 'average': return comparisonColors.average;
      case 'men': return comparisonColors.men;
      case 'women': return comparisonColors.women;
      default: return "#000000";
    }
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

  const exportPDF = async () => {
    if (!reportRef.current) return;
    
    setExportingPdf(true);
    
    try {
      const userName = getUserName();
      const dateStr = format(new Date(assessment.date), 'yyyy-MM-dd');
      const fileName = `HEARTI-Leader-Report-${userName}-${dateStr}.pdf`;
      
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your report...",
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = 210;  // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 10;      // margin in mm
      const contentWidth = pageWidth - (margin * 2);
      
      const reportSections = [];
      
      const addSection = (element) => {
        if (!element) return;
        reportSections.push(element);
      };
      
      const introSection = reportRef.current.querySelector('.prose:first-child');
      const spectraSection = reportRef.current.querySelector('.my-8');
      const dimensionCards = reportRef.current.querySelectorAll('.mb-8.overflow-hidden');
      const conclusionCard = reportRef.current.querySelector('.mb-8:not(.overflow-hidden)');
      
      addSection(introSection);
      
      addSection(spectraSection);
      
      dimensionCards.forEach(card => {
        addSection(card);
      });
      
      addSection(conclusionCard);
      
      let currentPage = 1;
      
      for (let i = 0; i < reportSections.length; i++) {
        const section = reportSections[i];
        
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.top = '0';
        tempDiv.style.left = '0';
        tempDiv.style.width = `${reportRef.current.offsetWidth}px`;
        tempDiv.style.background = 'white';
        tempDiv.style.overflow = 'hidden';
        
        const sectionClone = section.cloneNode(true);
        tempDiv.appendChild(sectionClone);
        document.body.appendChild(tempDiv);
        
        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          logging: false,
          useCORS: true,
          backgroundColor: 'white'
        });
        
        document.body.removeChild(tempDiv);
        
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (i > 0) {
          pdf.addPage();
          currentPage++;
        }
        
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          margin,
          margin,
          imgWidth,
          imgHeight
        );
        
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          `Page ${currentPage}`,
          pageWidth / 2,
          pageHeight - 5,
          { align: 'center' }
        );
      }
      
      pdf.save(fileName);
      
      toast({
        title: "PDF Generated",
        description: "Your HEARTI Leader report has been downloaded.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error creating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExportingPdf(false);
    }
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
    <div className="space-y-8">
      <Card className="appear-animate shadow-md border-0">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Heart className="text-indigo-600" size={24} />
            HEARTI Assessment Results
          </CardTitle>
          <CardDescription>
            Completed on {formattedDate}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 grid grid-cols-4 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="report">Report</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-4">Your HEARTI Profile</h3>
                  <div className="bg-slate-50 p-4 rounded-lg h-[400px] w-full">
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
                        <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Overall Score</h3>
                    <div className="flex items-center gap-2">
                      <Badge className="text-lg py-1 px-3 score-pill" variant={getBadgeVariant(assessment.overallScore)}>
                        {assessment.overallScore} / 5
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Dimension Scores</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(assessment.dimensionScores).map(([dimension, score]) => (
                        <Badge 
                          key={dimension} 
                          variant={getBadgeVariant(score)}
                          className="score-pill flex justify-between py-1 px-3"
                        >
                          <span>{dimension.charAt(0).toUpperCase() + dimension.slice(1)}</span>
                          <span>{score}/5</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Key Insights</h3>
                    <div className="space-y-4 text-sm">
                      <div className="bg-green-50 p-3 rounded-md border border-green-100">
                        <p className="font-medium flex items-center text-green-800">
                          <Target size={16} className="mr-2" />
                          Top Strength: {topStrength.charAt(0).toUpperCase() + topStrength.slice(1)}
                        </p>
                        <p className="text-green-700 mt-1">{getFeedback(assessment.dimensionScores[topStrength], topStrength)}</p>
                      </div>
                      
                      <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
                        <p className="font-medium flex items-center text-amber-800">
                          <Target size={16} className="mr-2" />
                          Vulnerability: {developmentArea.charAt(0).toUpperCase() + developmentArea.slice(1)}
                        </p>
                        <p className="text-amber-700 mt-1">{getFeedback(assessment.dimensionScores[developmentArea], developmentArea)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="dimensions" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedDimensions.map((dimension) => (
                  <Card key={dimension} className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{dimension.charAt(0).toUpperCase() + dimension.slice(1)}</CardTitle>
                      <Badge variant={getBadgeVariant(assessment.dimensionScores[dimension])}>
                        {assessment.dimensionScores[dimension]}/5
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-2">{getDimensionDescription(dimension)}</p>
                      <p className="text-sm">{getFeedback(assessment.dimensionScores[dimension], dimension)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="comparison" className="space-y-6">
              <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Compare Your Results</h3>
                  <p className="text-sm text-muted-foreground">See how your scores compare to others</p>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    size="sm" 
                    variant={compareMode === 'none' ? "default" : "outline"}
                    onClick={() => setCompareMode('none')}
                  >
                    No Comparison
                  </Button>
                  <Button 
                    size="sm" 
                    variant={compareMode === 'average' ? "default" : "outline"}
                    onClick={() => setCompareMode('average')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Users size={16} className="mr-1" /> Average
                  </Button>
                  <Button 
                    size="sm" 
                    variant={compareMode === 'men' ? "default" : "outline"}
                    onClick={() => setCompareMode('men')}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    Men
                  </Button>
                  <Button 
                    size="sm" 
                    variant={compareMode === 'women' ? "default" : "outline"}
                    onClick={() => setCompareMode('women')}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Women
                  </Button>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="p-1 inline-flex items-center justify-center rounded-lg bg-muted text-xs mb-4">
                  <Button 
                    size="sm" 
                    variant={chartView === 'combined' ? "default" : "ghost"}
                    className="rounded-md text-xs h-7"
                    onClick={() => setChartView('combined')}
                  >
                    Combined
                  </Button>
                  <Button 
                    size="sm" 
                    variant={chartView === 'separate' ? "default" : "ghost"}
                    className="rounded-md text-xs h-7"
                    onClick={() => setChartView('separate')}
                  >
                    Separate
                  </Button>
                </div>
              
                {chartView === 'combined' ? (
                  <div className="bg-slate-50 p-6 rounded-lg h-[450px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={combinedChartData}>
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
                        {compareMode !== 'none' && (
                          <Radar
                            name={getComparisonLabel()}
                            dataKey="comparisonValue"
                            stroke={getComparisonColor()}
                            fill={getComparisonColor()}
                            fillOpacity={0.6}
                          />
                        )}
                        <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg h-[300px]">
                      <p className="text-center font-medium text-indigo-600 mb-2">Your Results</p>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                          <PolarGrid gridType="polygon" />
                          <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                          <Radar
                            name="Your Score"
                            dataKey="value"
                            stroke={userColor}
                            fill={userColor}
                            fillOpacity={0.6}
                          />
                          <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {compareMode !== 'none' && (
                      <div className="bg-slate-50 p-4 rounded-lg h-[300px]">
                        <p className="text-center font-medium" style={{ color: getComparisonColor() }}>{getComparisonLabel()} Results</p>
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getComparisonData()}>
                            <PolarGrid gridType="polygon" />
                            <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                            <Radar
                              name={getComparisonLabel()}
                              dataKey="value"
                              stroke={getComparisonColor()}
                              fill={getComparisonColor()}
                              fillOpacity={0.6}
                            />
                            <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                )}
                
                {compareMode !== 'none' && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium mb-2">Comparison Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sortedDimensions.map((dimension) => {
                        const userScore = assessment.dimensionScores[dimension];
                        let comparisonScore = 0;
                        
                        if (compareMode === 'average') {
                          comparisonScore = aggregateData.averageScores[dimension];
                        } else if (compareMode === 'men') {
                          comparisonScore = aggregateData.demographics.gender.men[dimension];
                        } else if (compareMode === 'women') {
                          comparisonScore = aggregateData.demographics.gender.women[dimension];
                        }
                        
                        const difference = userScore - comparisonScore;
                        const differenceText = difference > 0 
                          ? `${difference.toFixed(1)} higher than` 
                          : difference < 0 
                            ? `${Math.abs(difference).toFixed(1)} lower than` 
                            : 'same as';
                            
                        return (
                          <div key={dimension} className="p-3 bg-white rounded-md border">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{dimension.charAt(0).toUpperCase() + dimension.slice(1)}</span>
                              <div className="flex gap-2 items-center">
                                <Badge variant={getBadgeVariant(userScore)}>
                                  You: {userScore}
                                </Badge>
                                <span className="text-gray-500">|</span>
                                <Badge variant="outline" style={{ color: getComparisonColor(), borderColor: getComparisonColor() }}>
                                  {getComparisonLabel()}: {comparisonScore}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">
                              Your score is {differenceText} the {getComparisonLabel().toLowerCase()} score.
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="report" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium">HEARTI:Leader Quotient Report</h3>
                  <p className="text-sm text-muted-foreground">Measuring Leadership Competencies Designed for the New World of Work</p>
                </div>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={exportPDF}
                  disabled={exportingPdf}
                >
                  {exportingPdf ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                  Export PDF
                </Button>
              </div>
              
              <div ref={reportRef} className="space-y-6 p-4">
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
              </div>
            </TabsContent>
          </Tabs>

          {assessment.demographics && Object.keys(assessment.demographics).length > 0 && (
            <>
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Demographic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assessment.demographics.managementLevel && (
                    <div>
                      <p className="font-medium">Management Level</p>
                      <p className="text-muted-foreground">{assessment.demographics.managementLevel}</p>
                    </div>
                  )}
                  
                  {assessment.demographics.companySize && (
                    <div>
                      <p className="font-medium">Company Size</p>
                      <p className="text-muted-foreground">{assessment.demographics.companySize}</p>
                    </div>
                  )}
                  
                  {assessment.demographics.jobRole && (
                    <div>
                      <p className="font-medium">Job Role</p>
                      <p className="text-muted-foreground">{assessment.demographics.jobRole}</p>
                    </div>
                  )}
                  
                  {assessment.demographics.location && (
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{assessment.demographics.location}</p>
                    </div>
                  )}
                  
                  {assessment.demographics.ageRange && (
                    <div>
                      <p className="font-medium">Age Range</p>
                      <p className="text-muted-foreground">{assessment.demographics.ageRange}</p>
                    </div>
                  )}
                  
                  {assessment.demographics.genderIdentity && (
                    <div>
                      <p className="font-medium">Gender Identity</p>
                      <p className="text-muted-foreground">{assessment.demographics.genderIdentity}</p>
                    </div>
                  )}
                  
                  {assessment.demographics.raceEthnicity && assessment.demographics.raceEthnicity.length > 0 && (
                    <div>
                      <p className="font-medium">Race/Ethnicity</p>
                      <p className="text-muted-foreground">{assessment.demographics.raceEthnicity.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;

