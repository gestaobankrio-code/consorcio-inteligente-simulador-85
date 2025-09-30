import { useState, useEffect } from 'react';
import { LeadCaptureForm } from './LeadCaptureForm';
import { SimulatorInterface } from './SimulatorInterface';
import { ResultsChart } from './ResultsChart';
import { BlurredResults } from './BlurredResults';

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  chartValue: number;
  timeToAcquire: number;
  ownResources: number;
  leadScore: number;
  leadId?: string;
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

type Step = 'simulator' | 'blurred-results' | 'lead-capture' | 'results';

export const ConsortiumSimulator = () => {
  const [currentStep, setCurrentStep] = useState<Step>('simulator');
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [results, setResults] = useState<SimulationResult | null>(null);

  // Função para calcular os resultados da simulação
  const calculateResults = (data: SimulationData): SimulationResult => {
    const { category, chartValue, ownResources, timeToAcquire } = data;
    
    // Taxa de administração do consórcio (sempre mais econômica)
    let adminFeeRate: number;
    
    switch (category) {
      case 'auto':
        adminFeeRate = 0.20; // 20% para automóveis
        break;
      case 'imovel':
        adminFeeRate = 0.22; // 22% para imóveis (prazo mais longo)
        break;
      case 'caminhao':
        adminFeeRate = 0.20; // 20% para caminhões
        break;
      default:
        adminFeeRate = 0.20;
    }
    
    const netValue = chartValue - ownResources;
    
    // Cálculos do Consórcio - apenas taxa de administração
    const adminFee = chartValue * adminFeeRate;
    const consortiumTotal = chartValue + adminFee;
    const consortiumMonthly = consortiumTotal / timeToAcquire;
    
    // Definir taxas por categoria de financiamento conforme solicitado
    let monthlyRate, yearlyRate, iofDaily, iofFixed, trRate, insuranceRate, fees;
    
    switch (category) {
      case 'auto':
        // 🚗 Automóveis (CDC pessoa física)
        // IOF: 0,0082% ao dia + 0,38% fixo
        iofDaily = 0.000082;
        iofFixed = 0.0038;
        // Juros do financiamento: ~2,8% ao mês (~38% a.a.)
        monthlyRate = 0.028;
        // Seguros atrelados (proteção financeira, prestamista) - estimativa
        insuranceRate = 0.008; // ~0,8% a.m.
        // Tarifa de cadastro/abertura
        fees = 1200; // Média entre R$800-1500
        break;
      
      case 'imovel':
        // 🏠 Imóveis (financiamento habitacional / SBPE)
        // IOF: Isento em crédito imobiliário residencial
        iofDaily = 0;
        iofFixed = 0;
        // Juros: ~13,5% a 15% a.a. + TR (usando 14,5% a.a.)
        yearlyRate = 0.145;
        monthlyRate = Math.pow(1 + yearlyRate, 1/12) - 1;
        // TR (Taxa Referencial): ~0,08% a 0,12% a.m. (usando média)
        trRate = 0.001; // ~0,1% a.m.
        // Seguros obrigatórios: MIP + DFI (~0,03% a 0,05% do saldo ao mês)
        insuranceRate = 0.0004; // ~0,04% do saldo
        // Taxa de avaliação + tarifa administrativa
        fees = 5500; // Média entre R$4.500-6.500 + tarifa
        break;
      
      case 'caminhao':
        // 🚛 Caminhões - Financiamento BNDES/Operações de Investimento Produtivo
        // IOF: Geralmente isento em operações de investimento produtivo
        iofDaily = 0;
        iofFixed = 0;
        // TLP ou TJLP: Taxa base do BNDES (~8,96% a.a. TJLP) + Spread (até 6%)
        // CET final: ~15% a 20% a.a. (usando 18% como média realista)
        yearlyRate = 0.18; // 18% a.a.
        monthlyRate = Math.pow(1 + yearlyRate, 1/12) - 1;
        // Seguros obrigatórios (prestamista ou do bem)
        insuranceRate = 0.005; // ~0,5% a.m.
        // Tarifa de estruturação/administração: ~2% sobre o valor
        fees = chartValue * 0.02; // 2% do valor total
        break;
      
      default:
        iofDaily = 0.000082;
        iofFixed = 0.0038;
        monthlyRate = 0.028;
        insuranceRate = 0.008;
        fees = 1200;
    }
    
    // Calcular IOF total para automóveis (caminhões são isentos)
    let iofTotal = 0;
    if (category === 'auto') {
      // IOF diário: 0,0082% ao dia sobre o valor financiado durante o prazo
      const iofDailyAmount = chartValue * iofDaily * (timeToAcquire * 30); // aproximação em dias
      // IOF fixo: 0,38% sobre o valor financiado
      const iofFixedAmount = chartValue * iofFixed;
      iofTotal = iofDailyAmount + iofFixedAmount;
    }
    
    // Para imóveis, adicionar TR ao cálculo
    if (category === 'imovel') {
      monthlyRate = monthlyRate + trRate;
    }
    
    // Base de financiamento inclui o valor TOTAL (sem recursos próprios que seriam entrada) + taxas + IOF
    const financingBase = chartValue + fees + iofTotal;
    
    // Fórmula de financiamento PRICE (Sistema de Amortização Price)
    // Inclui juros + seguros
    const effectiveMonthlyRate = monthlyRate + insuranceRate;
    const financingMonthly = financingBase * (effectiveMonthlyRate * Math.pow(1 + effectiveMonthlyRate, timeToAcquire)) / 
                            (Math.pow(1 + effectiveMonthlyRate, timeToAcquire) - 1);
    const financingTotal = financingMonthly * timeToAcquire;
    const totalInterest = financingTotal - chartValue - fees - iofTotal;
    
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

  const handleSimulationSubmit = (data: SimulationData) => {
    setSimulationData(data);
    const calculatedResults = calculateResults(data);
    setResults(calculatedResults);
    setCurrentStep('blurred-results');
  };

  const handleBlurredResultsComplete = () => {
    setCurrentStep('lead-capture');
  };

  const handleLeadSubmit = (data: LeadData) => {
    setLeadData(data);
    setCurrentStep('results');
  };

  const handleBackToSimulator = () => {
    setCurrentStep('simulator');
  };

  const handleNewSimulation = () => {
    setCurrentStep('simulator');
    setLeadData(null);
    setSimulationData(null);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {currentStep === 'simulator' && (
          <SimulatorInterface 
            onSubmit={handleSimulationSubmit}
          />
        )}
        
        {currentStep === 'blurred-results' && (
          <BlurredResults onAnimationComplete={handleBlurredResultsComplete} />
        )}
        
        {currentStep === 'lead-capture' && simulationData && results && (
          <LeadCaptureForm 
            onSubmit={handleLeadSubmit}
            simulationData={simulationData}
            results={results}
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