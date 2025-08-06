-- Create pulse_tests table to track assessment pulse tests
CREATE TABLE public.pulse_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  original_assessment_id UUID NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  questions_selected JSONB NOT NULL, -- Array of selected question IDs
  answers JSONB NOT NULL, -- User answers to the pulse test
  dimension_scores JSONB NOT NULL, -- Calculated dimension scores
  overall_score NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pulse_tests ENABLE ROW LEVEL SECURITY;

-- Create policies for pulse tests
CREATE POLICY "Users can view their own pulse tests" 
ON public.pulse_tests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pulse tests" 
ON public.pulse_tests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pulse tests" 
ON public.pulse_tests 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create assessment_schedule table to track pulse test intervals
CREATE TABLE public.assessment_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  initial_assessment_id UUID NOT NULL,
  initial_assessment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  next_pulse_date TIMESTAMP WITH TIME ZONE NOT NULL,
  next_full_assessment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  pulse_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.assessment_schedule ENABLE ROW LEVEL SECURITY;

-- Create policies for assessment schedule
CREATE POLICY "Users can view their own schedule" 
ON public.assessment_schedule 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own schedule" 
ON public.assessment_schedule 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedule" 
ON public.assessment_schedule 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create promo_codes table for Stripe promo code functionality
CREATE TABLE public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  trial_days INTEGER NOT NULL DEFAULT 3,
  active BOOLEAN NOT NULL DEFAULT true,
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Create policy for promo codes (everyone can read active codes)
CREATE POLICY "Anyone can view active promo codes" 
ON public.promo_codes 
FOR SELECT 
USING (active = true AND (expires_at IS NULL OR expires_at > now()));

-- Create promo_code_uses table to track usage
CREATE TABLE public.promo_code_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID REFERENCES public.promo_codes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  trial_start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  trial_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.promo_code_uses ENABLE ROW LEVEL SECURITY;

-- Create policies for promo code uses
CREATE POLICY "Users can view their own promo code uses" 
ON public.promo_code_uses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own promo code uses" 
ON public.promo_code_uses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Insert the HEARTIFriend_COREY promo code
INSERT INTO public.promo_codes (code, trial_days, active, max_uses) 
VALUES ('HEARTIFriend_COREY', 3, true, NULL);

-- Create triggers for updating timestamps
CREATE TRIGGER update_pulse_tests_updated_at
BEFORE UPDATE ON public.pulse_tests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assessment_schedule_updated_at
BEFORE UPDATE ON public.assessment_schedule
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();