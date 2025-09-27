import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Shield, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/language/LanguageContext';

const Intro = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  useEffect(() => {
    // Set document title
    document.title = `HEARTI™ - ${currentLanguage === 'en' ? 'Welcome' : 'Welcome'}`;
    
    // Check if user has already seen the intro
    const seenIntro = localStorage.getItem('hearti_intro_seen');
    if (seenIntro) {
      navigate('/', { replace: true });
    }
  }, [currentLanguage, navigate]);

  const handleContinue = () => {
    // Mark intro as seen
    localStorage.setItem('hearti_intro_seen', 'true');
    setHasSeenIntro(true);
    
    // Navigate to main assessment
    navigate('/', { replace: true });
  };

  const benefits = [
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: "Understanding of your strongest and weakest HEARTI Traits"
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: "Your HEARTI:Spectra - A visual representation of your HEARTI score"
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: "A custom report that gives you practical tools and resources to develop your personal 21st-Century Leadership Skills"
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: "Tools to communicate more effectively with your team"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col items-center space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Congratulations!
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl">
              You are accelerating your leadership journey and preparing yourself for 
              <span className="font-semibold text-primary"> 21st-Century Leadership</span> by taking the 
              <span className="font-bold"> HEARTI™ Quotient Self-Assessment</span>.
            </p>
          </div>

          {/* Main Content Card */}
          <Card className="w-full max-w-3xl shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-primary">
                Here's what you'll get:
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Benefits List */}
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="text-primary mt-0.5">
                      {benefit.icon}
                    </div>
                    <p className="text-foreground/90 leading-relaxed">
                      {benefit.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mission Statement */}
              <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                <p className="text-foreground/90 leading-relaxed text-center italic">
                  Our mission is to inspire and motivate a new population of leaders who wake up every day to make the world better for all. 
                  We're creating the tools for leaders who want to build skills and competencies designed for 21st-century success.
                </p>
              </div>

              {/* Assessment Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-secondary/20 rounded-lg">
                  <Clock className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium">Quick Assessment</p>
                    <p className="text-sm text-foreground/70">~15 minutes to complete</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-secondary/20 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium">Instant Results</p>
                    <p className="text-sm text-foreground/70">Custom report via email</p>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-start space-x-2 text-sm">
                  <Shield className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-foreground/80">
                    <strong>Important:</strong> Please complete in one sitting or progress may be lost.
                  </p>
                </div>
                
                <div className="text-xs text-foreground/70">
                  <p>
                    By continuing with the assessment you acknowledge and agree to PrismWork's{' '}
                    <a 
                      href="https://www.prismwork.com/privacy-policy-hearti-leader-quotient" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 underline"
                    >
                      HEARTI:Leader Quotient privacy policy
                    </a>.
                  </p>
                </div>
              </div>

              {/* Continue Button */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={handleContinue}
                  size="lg"
                  className="px-8 py-3 text-lg font-semibold min-w-[200px]"
                >
                  Start Your Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Intro;