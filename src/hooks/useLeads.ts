import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: 'auto' | 'imovel' | 'caminhao';
  chart_value: number;
  time_to_acquire: number;
  own_resources: number;
  lead_score: number;
  monthly_payment: number;
  total_savings: number;
  savings_percentage: number;
  created_at: string;
}

export interface LeadInteraction {
  lead_id: string;
  interaction_type: 'whatsapp_click' | 'form_submission';
  created_at: string;
}

export const useLeads = () => {
  const [loading, setLoading] = useState(false);

  const saveLead = async (leadData: Omit<Lead, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      
      const leadId = crypto.randomUUID();
      const timestamp = new Date().toISOString();
      
      const lead: Lead = {
        id: leadId,
        ...leadData,
        created_at: timestamp
      };

      // Save lead data using settings table
      const { error } = await supabase
        .from('settings')
        .insert({
          key: `lead_${leadId}`,
          value: lead as any
        });

      if (error) throw error;
      return lead;
    } catch (error) {
      console.error('Error saving lead:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveLeadInteraction = async (leadId: string, interactionType: LeadInteraction['interaction_type']) => {
    try {
      const interaction: LeadInteraction = {
        lead_id: leadId,
        interaction_type: interactionType,
        created_at: new Date().toISOString()
      };

      const interactionId = crypto.randomUUID();

      // Save interaction using settings table
      const { error } = await supabase
        .from('settings')
        .insert({
          key: `interaction_${interactionId}`,
          value: interaction as any
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving lead interaction:', error);
      return false;
    }
  };

  return {
    loading,
    saveLead,
    saveLeadInteraction
  };
};