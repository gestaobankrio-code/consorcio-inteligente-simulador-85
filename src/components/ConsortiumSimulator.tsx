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
    
    // Taxa de administração do consórcio (23% dividido pelo prazo)
    const adminFeeRate = 0.23;
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
        // Juros do financiamento: ~2,25% ao mês (~28% a.a.)
        monthlyRate = 0.0225;
        // Seguros atrelados (proteção financeira, prestamista) - estimativa
        insuranceRate = 0.005; // ~0,5% a.m.
        // Tarifa de cadastro/abertura
        fees = 700; // Média entre R$500-900
        break;
      
      case 'imovel':
        // 🏠 Imóveis (financiamento habitacional / SBPE)
        // IOF: Isento em crédito imobiliário residencial
        iofDaily = 0;
        iofFixed = 0;
        // Juros: ~11,29% a 13,50% a.a. + TR (usando média de 12,4% a.a.)
        yearlyRate = 0.124;
        monthlyRate = Math.pow(1 + yearlyRate, 1/12) - 1;
        // TR (Taxa Referencial): ~0,05% a 0,10% a.m. (usando média)
        trRate = 0.00075; // ~0,075% a.m.
        // Seguros obrigatórios: MIP + DFI (~0,02% a 0,04% do saldo ao mês)
        insuranceRate = 0.0003; // ~0,03% do saldo
        // Taxa de avaliação + tarifa administrativa
        fees = 4000; // Média entre R$3.000-5.000 + tarifa
        break;
      
      case 'caminhao':
        // 🚛 Caminhões - Financiamento BNDES/Operações de Investimento Produtivo
        // IOF: Geralmente isento em operações de investimento produtivo
        iofDaily = 0;
        iofFixed = 0;
        // TLP ou TJLP: Taxa base do BNDES (~8,96% a.a. TJLP) + Spread (1,5% a 4% - usando média de 2,75%)
        // CET final: ~11% a 15% a.a. (usando 13% como média)
        yearlyRate = 0.13; // 13% a.a.
        monthlyRate = Math.pow(1 + yearlyRate, 1/12) - 1;
        // Seguros obrigatórios (prestamista ou do bem)
        insuranceRate = 0.003; // ~0,3% a.m.
        // Tarifa de estruturação/administração: ~1% sobre o valor
        fees = netValue * 0.01; // 1% do valor financiado
        break;
      
      default:
        iofDaily = 0.000082;
        iofFixed = 0.0038;
        monthlyRate = 0.0225;
        insuranceRate = 0.005;
        fees = 700;
    }
    
    // Calcular IOF total para automóveis e caminhões
    let iofTotal = 0;
    if (category === 'auto' || category === 'caminhao') {
      // IOF diário: 0,0082% ao dia sobre o valor financiado durante o prazo
      const iofDailyAmount = netValue * iofDaily * (timeToAcquire * 30); // aproximação em dias
      // IOF fixo: 0,38% sobre o valor financiado
      const iofFixedAmount = netValue * iofFixed;
      iofTotal = iofDailyAmount + iofFixedAmount;
    }
    
    // Para imóveis, adicionar TR ao cálculo
    if (category === 'imovel') {
      monthlyRate = monthlyRate + trRate;
    }
    
    // Base de financiamento inclui o valor líquido + taxas + IOF
    const financingBase = netValue + fees + iofTotal;
    
    // Fórmula de financiamento PRICE (Sistema de Amortização Price)
    // Inclui juros + seguros
    const effectiveMonthlyRate = monthlyRate + insuranceRate;
    const financingMonthly = financingBase * (effectiveMonthlyRate * Math.pow(1 + effectiveMonthlyRate, timeToAcquire)) / 
                            (Math.pow(1 + effectiveMonthlyRate, timeToAcquire) - 1);
    const financingTotal = financingMonthly * timeToAcquire;
    const totalInterest = financingTotal - netValue - fees - iofTotal;
    
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