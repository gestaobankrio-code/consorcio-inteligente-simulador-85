-- Create settings table to store application configuration
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is configuration data)
CREATE POLICY "Settings are accessible to everyone" 
ON public.settings 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.settings (key, value) VALUES 
  ('rdstation_config', '{"token": "", "conversionIdentifier": "simulador-consorcio", "whatsappNumber": "5511999999999"}'),
  ('lead_scoring', '{"chartValue": {"min": 300000, "mid": 150000, "low": 75000, "high": 3, "medium": 2, "low_score": 1}, "resources": {"high": 30, "medium": 15, "high_score": 2, "medium_score": 1}, "timeToAcquire": {"fast": 24, "medium": 48, "fast_score": 2, "medium_score": 1}}')
ON CONFLICT (key) DO NOTHING;