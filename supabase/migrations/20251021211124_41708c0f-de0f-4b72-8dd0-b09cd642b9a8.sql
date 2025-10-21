-- =====================================================================
-- Fix: Allow public lead submissions while protecting data access
-- =====================================================================

-- Drop the restrictive INSERT policy for leads
DROP POLICY IF EXISTS "Admin users can insert leads" ON public.leads;

-- Create new policy to allow public lead submission (anonymous users)
CREATE POLICY "Public can submit leads"
ON public.leads
FOR INSERT
WITH CHECK (true);

-- Keep admin-only policies for viewing and modifying leads
-- (Already exists: "Admin users can view all leads")
-- (Already exists: "Admin users can update leads")
-- (Already exists: "Admin users can delete leads")

-- Drop the restrictive INSERT policy for lead_interactions
DROP POLICY IF EXISTS "Admin users can insert interactions" ON public.lead_interactions;

-- Create new policy to allow public interaction tracking
CREATE POLICY "Public can track interactions"
ON public.lead_interactions
FOR INSERT
WITH CHECK (true);

-- Keep admin-only policy for viewing interactions
-- (Already exists: "Admin users can view all interactions")