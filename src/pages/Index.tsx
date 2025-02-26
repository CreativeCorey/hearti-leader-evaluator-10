
import React, { useState } from 'react';
import { HEARTIAssessment, HEARTIDimension } from '../types';
import { getAssessments } from '../utils/localStorage';
import AssessmentForm from '../components/AssessmentForm';
import ResultsDisplay from '../components/ResultsDisplay';
import HistoricalResults from '../components/HistoricalResults';
import Layout from '../components/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, BarChart3, Target, ArrowRight, CheckCircle, PieChart, ChevronDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentAssessment, setCurrentAssessment] = useState<HEARTIAssessment | null>(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const assessments = getAssessments();

  const handleStartAssessment = () => {
    setShowAssessment(true);
    setActiveTab('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAssessmentComplete = (assessment: HEARTIAssessment) => {
    setCurrentAssessment(assessment);
    setShowAssessment(false);
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewHistory = () => {
    setActiveTab('history');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setActiveTab('home');
    setShowAssessment(false);
  };

  const dimensionDescriptions: Record<HEARTIDimension, string> = {
    humility: 'Recognize your limitations, be open to feedback, and show a willingness to learn and grow.',
    empathy: 'Understand others\' perspectives and feelings, respond with compassion, and build meaningful connections.',
    accountability: 'Take responsibility for your actions, meet commitments, and hold yourself to high standards.',
    resiliency: 'Adapt to change, bounce back from setbacks, and maintain positivity through challenges.',
    transparency: 'Communicate openly, share information freely, and explain the reasoning behind decisions.',
    inclusivity: 'Create environments where everyone feels welcome, valued, and empowered to contribute.'
  };

  return (
    <Layout>
      <div className="min-h-screen">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-16">
            {/* Hero Section */}
            <section className="text-center py-10">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-6">Lead Your Best Life Using Your Strengths</h1>
                <p className="text-xl text-gray-600 mb-8">
                  Our HEARTI Leadership Assessment helps you identify and leverage your unique leadership strengths.
                </p>
                <Button onClick={handleStartAssessment} size="lg" className="gap-2">
                  Start Your Assessment <ArrowRight size={16} />
                </Button>
              </div>
            </section>

            {/* Stats Section */}
            <section className="text-center">
              <div className="flex justify-center">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Join 47,000+ Leaders</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Using their HEARTI Strengths to thrive at work and everywhere else
                  </p>
                  <Button onClick={handleStartAssessment} variant="outline" size="lg">Learn More</Button>
                </div>
              </div>
            </section>

            {/* Strengths Cards */}
            <section>
              <h2 className="text-center text-2xl font-bold mb-8">You Are Unique. Your Potential Is Too.</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Object.entries(dimensionDescriptions).slice(0, 3).map(([dimension, description]) => (
                  <Card key={dimension} className="assessment-card">
                    <CardHeader>
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <Heart className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <CardTitle className="text-center capitalize">{dimension}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center text-gray-600">{description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <Button variant="ghost" className="gap-1" onClick={handleStartAssessment}>
                        Discover Yours <ChevronDown size={16} />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-block bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium mb-4">
                  Step 1
                </div>
                <h3 className="text-2xl font-bold mb-4">Take the HEARTI Assessment</h3>
                <p className="text-gray-600 mb-6">
                  Complete our comprehensive assessment to identify your leadership strengths and areas for growth.
                </p>
                <Button onClick={handleStartAssessment}>Start Now</Button>
              </div>
              <div className="bg-gray-100 rounded-lg p-6 shadow-md">
                <div className="aspect-[3/4] bg-white rounded-md border flex items-center justify-center">
                  <div className="w-3/4 space-y-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded-full w-full"></div>
                      <div className="flex justify-between">
                        <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                        <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                        <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                        <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                        <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded-full w-full"></div>
                      <div className="flex justify-between">
                        <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                        <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                        <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                        <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                        <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 bg-gray-100 rounded-lg p-6 shadow-md">
                <div className="aspect-[3/4] bg-white rounded-md border flex items-center justify-center">
                  <div className="w-3/4 h-3/4">
                    <div className="w-full h-full rounded-md bg-gray-100 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full border-8 border-gray-300 border-t-primary"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-block bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium mb-4">
                  Step 2
                </div>
                <h3 className="text-2xl font-bold mb-4">Get Your Personalized Results</h3>
                <p className="text-gray-600 mb-6">
                  Receive detailed insights about your HEARTI dimensions with personalized recommendations.
                </p>
                <Button onClick={handleStartAssessment}>See Sample Results</Button>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-block bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium mb-4">
                  Step 3
                </div>
                <h3 className="text-2xl font-bold mb-4">Track Your Progress</h3>
                <p className="text-gray-600 mb-6">
                  Monitor your growth over time and see how your leadership skills evolve through regular assessments.
                </p>
                <Button onClick={handleStartAssessment}>Learn More</Button>
              </div>
              <div className="bg-gray-100 rounded-lg p-6 shadow-md">
                <div className="aspect-[3/4] bg-white rounded-md border flex items-center justify-center">
                  <div className="w-3/4 h-3/4">
                    <div className="w-full h-full rounded-md bg-gray-100 flex items-center justify-center">
                      <div className="space-y-4 w-full px-4">
                        <div className="h-2 bg-green-500 rounded-full w-full"></div>
                        <div className="h-2 bg-blue-500 rounded-full w-3/4"></div>
                        <div className="h-2 bg-purple-500 rounded-full w-1/2"></div>
                        <div className="h-2 bg-red-500 rounded-full w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing Section */}
            <section className="py-10">
              <h2 className="text-center text-3xl font-bold mb-12">Find the Report That's Right For You</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Basic</CardTitle>
                    <CardDescription>Essential insights</CardDescription>
                    <div className="mt-4 text-3xl font-bold">Free</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span>HEARTI Assessment</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span>Basic Results</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span>Progress Tracking</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleStartAssessment} className="w-full">Start Now</Button>
                  </CardFooter>
                </Card>

                <Card className="border-2 border-primary shadow-md">
                  <CardHeader>
                    <CardTitle>Professional</CardTitle>
                    <CardDescription>Detailed analysis</CardDescription>
                    <div className="mt-4 text-3xl font-bold">$29.99</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span>Everything in Basic</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span>Detailed Recommendations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span>Development Resources</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleStartAssessment} className="w-full">Upgrade</Button>
                  </CardFooter>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Teams</CardTitle>
                    <CardDescription>For organizations</CardDescription>
                    <div className="mt-4 text-3xl font-bold">Contact Us</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span>Everything in Professional</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span>Team Analytics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span>Facilitated Workshops</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleStartAssessment} variant="outline" className="w-full">Contact Sales</Button>
                  </CardFooter>
                </Card>
              </div>
            </section>

            {/* Testimonials/Use Cases */}
            <section className="py-10">
              <h2 className="text-center text-3xl font-bold mb-12">Trusted by Leaders Everywhere</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Leadership Development</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      "The HEARTI assessment helped me identify my leadership strengths and has been invaluable for my professional growth."
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Team Building</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      "We use HEARTI assessments with our entire team. Understanding each other's strengths has transformed our collaboration."
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Call to Action */}
            <section className="text-center py-10">
              <h2 className="text-3xl font-bold mb-6">Ready to Discover Your Leadership Strengths?</h2>
              <Button onClick={handleStartAssessment} size="lg" className="gap-2">
                Start Assessment Now <ArrowRight size={16} />
              </Button>
            </section>
          </TabsContent>

          <TabsContent value="assessment">
            {showAssessment ? (
              <AssessmentForm onComplete={handleAssessmentComplete} />
            ) : (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-6">Ready to Take Your HEARTI Assessment?</h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  This assessment takes about 5-10 minutes to complete. You'll answer questions about your leadership style across six dimensions: Humility, Empathy, Accountability, Resiliency, Transparency, and Inclusivity.
                </p>
                <Button onClick={handleStartAssessment} size="lg" className="gap-2">
                  Start Now <ArrowRight size={16} />
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results">
            {currentAssessment ? (
              <ResultsDisplay assessment={currentAssessment} />
            ) : assessments.length > 0 ? (
              <ResultsDisplay assessment={assessments[assessments.length - 1]} />
            ) : (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-6">No Results Yet</h2>
                <p className="text-gray-600 mb-8">
                  Complete an assessment to see your leadership profile.
                </p>
                <Button onClick={handleStartAssessment}>Take Assessment</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {assessments.length > 0 ? (
              <HistoricalResults assessments={assessments} />
            ) : (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-6">No Assessment History</h2>
                <p className="text-gray-600 mb-8">
                  Complete your first assessment to start tracking your leadership growth journey.
                </p>
                <Button onClick={handleStartAssessment}>Take Assessment</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
