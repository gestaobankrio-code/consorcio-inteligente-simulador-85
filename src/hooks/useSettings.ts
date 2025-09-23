
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RdStationConfig {
  token: string;
  conversionIdentifier: string;
  whatsappNumber: string;
}

interface LeadScoring {
  chartValue: {
    min: number;
    mid: number;
    low: number;
    high: number;
    medium: number;
    low_score: number;
  };
  resources: {
    high: number;
    medium: number;
    high_score: number;
    medium_score: number;
  };
  timeToAcquire: {
    fast: number;
    medium: number;
    fast_score: number;
    medium_score: number;
  };
}

export const useSettings = () => {
  const [rdStationConfig, setRdStationConfig] = useState<RdStationConfig>({
    token: '',
    conversionIdentifier: 'simulador-consorcio',
    whatsappNumber: '5511999999999'
  });

  const [leadScoring, setLeadScoring] = useState<LeadScoring>({
    chartValue: { min: 300000, mid: 150000, low: 75000, high: 3, medium: 2, low_score: 1 },
    resources: { high: 30, medium: 15, high_score: 2, medium_score: 1 },
    timeToAcquire: { fast: 24, medium: 48, fast_score: 2, medium_score: 1 }
  });

  const [loading, setLoading] = useState(false);

  // Load settings from Supabase
  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Load RD Station config
      const { data: rdData } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'rdstation_config')
        .single();

      if (rdData) {
        setRdStationConfig(rdData.value as unknown as RdStationConfig);
      }

      // Load Lead Scoring config
      const { data: leadData } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'lead_scoring')
        .single();

      if (leadData) {
        setLeadScoring(leadData.value as unknown as LeadScoring);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save RD Station config
  const saveRdStationConfig = async (config: RdStationConfig) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'rdstation_config',
          value: config as unknown as any
        }, {
          onConflict: 'key'
        });

      if (error) throw error;
      
      setRdStationConfig(config);
      return true;
    } catch (error) {
      console.error('Error saving RD Station config:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Save Lead Scoring config
  const saveLeadScoring = async (scoring: LeadScoring) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'lead_scoring',
          value: scoring as unknown as any
        }, {
          onConflict: 'key'
        });

      if (error) throw error;
      
      setLeadScoring(scoring);
      return true;
    } catch (error) {
      console.error('Error saving lead scoring:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    rdStationConfig,
    leadScoring,
    loading,
    saveRdStationConfig,
    saveLeadScoring,
    setRdStationConfig,
    setLeadScoring
  };
};
