
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

export const useSimulatorConfig = () => {
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

  const loadConfig = async () => {
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
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateLeadScore = (formData: any) => {
    let score = 0;
    
    if (formData.chartValue >= leadScoring.chartValue.min) score += leadScoring.chartValue.high;
    else if (formData.chartValue >= leadScoring.chartValue.mid) score += leadScoring.chartValue.medium;
    else if (formData.chartValue >= leadScoring.chartValue.low) score += leadScoring.chartValue.low_score;
    
    const resourcesPercentage = (formData.ownResources / formData.chartValue) * 100;
    if (resourcesPercentage >= leadScoring.resources.high) score += leadScoring.resources.high_score;
    else if (resourcesPercentage >= leadScoring.resources.medium) score += leadScoring.resources.medium_score;
    
    if (formData.timeToAcquire <= leadScoring.timeToAcquire.fast) score += leadScoring.timeToAcquire.fast_score;
    else if (formData.timeToAcquire <= leadScoring.timeToAcquire.medium) score += leadScoring.timeToAcquire.medium_score;
    
    return score;
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return {
    rdStationConfig,
    leadScoring,
    loading,
    calculateLeadScore
  };
};
