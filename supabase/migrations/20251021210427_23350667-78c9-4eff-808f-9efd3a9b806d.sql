-- =====================================================================
-- Security Fix: Separate sensitive lead data from configuration
-- =====================================================================

-- Create dedicated leads table for customer PII with proper RLS
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('auto', 'imovel', 'caminhao')),
  chart_value NUMERIC NOT NULL CHECK (chart_value > 0),
  time_to_acquire INTEGER NOT NULL CHECK (time_to_acquire >= 6 AND time_to_acquire <= 120),
  own_resources NUMERIC CHECK (own_resources >= 0),
  lead_score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on leads table
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create lead_interactions table for tracking
CREATE TABLE public.lead_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('whatsapp_click', 'specialist_click', 'form_submit')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on lead_interactions
ALTER TABLE public.lead_interactions ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- Authentication Infrastructure: User Roles
-- =====================================================================

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = check_user_id
    AND role = 'admin'
  );
$$;

-- =====================================================================
-- RLS Policies for Leads (Admin-only access)
-- =====================================================================

-- Only admins can view leads
CREATE POLICY "Admin users can view all leads"
ON public.leads
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Only admins can insert leads
CREATE POLICY "Admin users can insert leads"
ON public.leads
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

-- Only admins can update leads
CREATE POLICY "Admin users can update leads"
ON public.leads
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Only admins can delete leads
CREATE POLICY "Admin users can delete leads"
ON public.leads
FOR DELETE
USING (public.is_admin(auth.uid()));

-- =====================================================================
-- RLS Policies for Lead Interactions (Admin-only access)
-- =====================================================================

CREATE POLICY "Admin users can view all interactions"
ON public.lead_interactions
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin users can insert interactions"
ON public.lead_interactions
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

-- =====================================================================
-- RLS Policies for User Roles (Users can view own, admins can manage)
-- =====================================================================

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- =====================================================================
-- Update Settings Table RLS (Keep for non-sensitive config only)
-- =====================================================================

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow all operations on settings" ON public.settings;

-- Allow public read for non-sensitive config (rdstation_config, lead_scoring)
CREATE POLICY "Public read for configuration"
ON public.settings
FOR SELECT
USING (key IN ('rdstation_config', 'lead_scoring'));

-- Only admins can modify settings
CREATE POLICY "Admin users can manage settings"
ON public.settings
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- =====================================================================
-- Triggers for automatic timestamp updates
-- =====================================================================

CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================================
-- Indexes for performance
-- =====================================================================

CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_lead_interactions_lead_id ON public.lead_interactions(lead_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);