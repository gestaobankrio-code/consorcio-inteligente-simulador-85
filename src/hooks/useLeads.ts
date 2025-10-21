import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Lead {
  id?: string;
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
  created_at?: string;
}

export interface LeadInteraction {
  lead_id: string;
  interaction_type: 'whatsapp_click' | 'form_submission';
  created_at?: string;
}

export const useLeads = () => {
  const [loading, setLoading] = useState(false);

  const saveLead = async (leadData: Omit<Lead, 'id' | 'created_at'>): Promise<Lead | null> => {
    try {
      setLoading(true);
      
      // Insert into the new secure leads table
      const { data, error } = await supabase
        .from('leads')
        .insert({
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          category: leadData.category,
          chart_value: leadData.chart_value,
          time_to_acquire: leadData.time_to_acquire,
          own_resources: leadData.own_resources,
          lead_score: leadData.lead_score
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving lead:', error);
        return null;
      }

      return {
        ...data,
        monthly_payment: leadData.monthly_payment,
        total_savings: leadData.total_savings,
        savings_percentage: leadData.savings_percentage
      } as Lead;
    } catch (error) {
      console.error('Error in saveLead:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveLeadInteraction = async (
    leadId: string,
    interactionType: LeadInteraction['interaction_type']
  ): Promise<boolean> => {
    try {
      // Insert into the new secure lead_interactions table
      const { error } = await supabase
        .from('lead_interactions')
        .insert({
          lead_id: leadId,
          interaction_type: interactionType
        });

      if (error) {
        console.error('Error saving lead interaction:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveLeadInteraction:', error);
      return false;
    }
  };

  return {
    loading,
    saveLead,
    saveLeadInteraction
  };
};