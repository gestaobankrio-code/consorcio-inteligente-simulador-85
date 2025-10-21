-- Expand allowed max months for leads time_to_acquire to support long-term simulations
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_time_to_acquire_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_time_to_acquire_check CHECK (time_to_acquire >= 6 AND time_to_acquire <= 240);