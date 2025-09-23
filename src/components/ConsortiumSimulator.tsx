import { useState, useEffect } from 'react';
import { LeadCaptureForm } from './LeadCaptureForm';
import { SimulatorInterface } from './SimulatorInterface';
import { ResultsChart } from './ResultsChart';

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  chartValue: number;
  timeToAcquire: number;
  ownResources: number;
  leadScore: number;
}

export interface SimulationData {
  category: 'auto' | 'imovel' | 'caminhao';
  chartValue: number;
  ownResources: number;
  timeToAcquire: number;
}

export interface SimulationResult {
  consortium: {
    monthlyPayment: number;
    totalAmount: number;
    adminFee: number;
  };
  financing: {
    monthlyPayment: number;
    totalAmount: number;
    totalInterest: number;
  };
  savings: number;
  savingsPercentage: number;
}

type Step = 'lead-capture' | 'simulator' | 'results';

export const ConsortiumSimulator = () => {
  const [currentStep, setCurrentStep] = useState<Step>('lead-capture');
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [results, setResults] = useState<SimulationResult | null>(null);

  // Função para calcular os resultados da simulação
  const calculateResults = (data: SimulationData): SimulationResult => {
    const { category, chartValue, ownResources, timeToAcquire } = data;
    
    // Taxa de administração do consórcio (23% - não mostrar)
    const adminFeeRate = 0.23;
    const netValue = chartValue - ownResources;
    
    // Cálculos do Consórcio - apenas taxa de administração
    const adminFee = chartValue * adminFeeRate;
    const consortiumTotal = chartValue + adminFee;
    const consortiumMonthly = consortiumTotal / timeToAcquire;
    
    // Definir taxas por categoria de financiamento
    let monthlyRate, yearlyRate, iofRate, insuranceRate, fees;
    
    switch (category) {
      case 'imovel':
        yearlyRate = 0.145; // 14.5% a.a. (média entre 11-13.5% + TR)
        monthlyRate = Math.pow(1 + yearlyRate, 1/12) - 1;
        iofRate = 0; // Isento para imóveis
        insuranceRate = 0.02 / 12; // MIP + DFI (~2% a.a.)
        fees = 3000; // Avaliação + admin
        break;
      
      case 'auto':
        monthlyRate = 0.016; // 1.6% a.m. (média entre 1.3-1.9%)
        iofRate = 0.0038 + (0.0082 / 30); // IOF + taxa diária
        insuranceRate = 0.025; // Prestamista + seguro do carro (~2.5% a.m.)
        fees = 1500; // Cadastro + gravame
        break;
      
      case 'caminhao':
        monthlyRate = 0.01075; // 1.075% a.m. (média entre 0.95-1.2%)
        iofRate = 0.0038 + (0.0082 / 30); // IOF + taxa diária
        insuranceRate = 0.02; // Prestamista + seguro do caminhão (~2% a.m.)
        fees = 2000; // Cadastro + cartório
        break;
      
      default:
        monthlyRate = 0.016;
        iofRate = 0.0038;
        insuranceRate = 0.025;
        fees = 1500;
    }
    
    const totalMonthlyRate = monthlyRate + iofRate + insuranceRate;
    const financingBase = netValue + fees;
    
    // Fórmula de financiamento PRICE
    const financingMonthly = financingBase * (totalMonthlyRate * Math.pow(1 + totalMonthlyRate, timeToAcquire)) / 
                            (Math.pow(1 + totalMonthlyRate, timeToAcquire) - 1);
    const financingTotal = financingMonthly * timeToAcquire;
    const totalInterest = financingTotal - financingBase;
    
    // Economia
    const savings = financingTotal - consortiumTotal;
    const savingsPercentage = (savings / financingTotal) * 100;
    
    return {
      consortium: {
        monthlyPayment: consortiumMonthly,
        totalAmount: consortiumTotal,
        adminFee
      },
      financing: {
        monthlyPayment: financingMonthly,
        totalAmount: financingTotal,
        totalInterest
      },
      savings,
      savingsPercentage
    };
  };

  const handleLeadSubmit = (data: LeadData) => {
    setLeadData(data);
    setCurrentStep('simulator');
  };

  const handleSimulationSubmit = (data: SimulationData) => {
    setSimulationData(data);
    const calculatedResults = calculateResults(data);
    setResults(calculatedResults);
    setCurrentStep('results');
  };

  const handleBackToSimulator = () => {
    setCurrentStep('simulator');
  };

  const handleNewSimulation = () => {
    setCurrentStep('lead-capture');
    setLeadData(null);
    setSimulationData(null);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {currentStep === 'lead-capture' && (
          <LeadCaptureForm onSubmit={handleLeadSubmit} />
        )}
        
        {currentStep === 'simulator' && leadData && (
          <SimulatorInterface 
            leadData={leadData}
            onSubmit={handleSimulationSubmit}
            onBack={() => setCurrentStep('lead-capture')}
          />
        )}
        
        {currentStep === 'results' && leadData && simulationData && results && (
          <ResultsChart
            leadData={leadData}
            simulationData={simulationData}
            results={results}
            onBackToSimulator={handleBackToSimulator}
            onNewSimulation={handleNewSimulation}
          />
        )}
      </div>
    </div>
  );
};