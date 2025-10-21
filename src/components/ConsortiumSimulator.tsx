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
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CONSÓRCIO: Taxa de administração reduzida (sem juros, IOF ou seguros)
    // ═══════════════════════════════════════════════════════════════════════════
    const adminFeeRate = 0.15; // 15% para todas as categorias
    const adminFee = chartValue * adminFeeRate;
    const consortiumTotal = chartValue + adminFee;
    const consortiumMonthly = consortiumTotal / timeToAcquire;
    
    // ═══════════════════════════════════════════════════════════════════════════
    // FINANCIAMENTO: Configuração por categoria
    // ═══════════════════════════════════════════════════════════════════════════
    let monthlyRate: number;
    let yearlyRate: number;
    let iofDaily: number;
    let iofFixed: number;
    let bankFees: number;
    let yearlyInsurance: number;
    
    switch (category) {
      case 'auto':
        // 🚗 Automóveis
        // IOF: 0,38% + 0,0082% ao dia (≈1,5% total/ano)
        iofFixed = 0.0038; // 0,38%
        iofDaily = 0.000082; // 0,0082% ao dia
        // Juros médios: 1,6% a 2,2% ao mês (usando 2,2% para pior cenário)
        monthlyRate = 0.022; // 2,2% ao mês
        // Tarifas bancárias: até 3%
        bankFees = chartValue * 0.03; // 3% do valor
        // Sem seguros separados (já incluídos nas tarifas)
        yearlyInsurance = 0;
        break;
      
      case 'imovel':
        // 🏠 Imóveis
        // IOF: isento (residencial PF)
        iofFixed = 0;
        iofDaily = 0;
        // Juros médios: 9% a 13% ao ano (usando 13% para pior cenário)
        yearlyRate = 0.13; // 13% ao ano
        monthlyRate = Math.pow(1 + yearlyRate, 1/12) - 1; // Conversão para mensal
        // Seguros obrigatórios (MIP + DFI): 1,5% a 2% ao ano (usando 2%)
        yearlyInsurance = 0.02; // 2% ao ano
        // Tarifas administrativas: 1% a 2% (usando 2%)
        bankFees = chartValue * 0.02; // 2% do valor
        break;
      
      case 'caminhao':
        // 🚛 Caminhões
        // IOF: 0,38% + 0,0082% ao dia (≈1,5% total/ano)
        iofFixed = 0.0038; // 0,38%
        iofDaily = 0.000082; // 0,0082% ao dia
        // Juros médios: 1,8% a 2,4% ao mês (usando 2,4% para pior cenário)
        monthlyRate = 0.024; // 2,4% ao mês
        // Tarifas e seguro obrigatório: até 4%
        bankFees = chartValue * 0.04; // 4% do valor
        // Seguros já incluídos nas tarifas
        yearlyInsurance = 0;
        break;
      
      default:
        iofFixed = 0.0038;
        iofDaily = 0.000082;
        monthlyRate = 0.019;
        bankFees = chartValue * 0.03;
        yearlyInsurance = 0;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CÁLCULO DO IOF TOTAL
    // ═══════════════════════════════════════════════════════════════════════════
    let iofTotal = 0;
    if (category === 'auto' || category === 'caminhao') {
      // IOF diário acumulado durante todo o prazo
      const totalDays = timeToAcquire * 30; // Aproximação em dias
      const iofDailyAmount = chartValue * iofDaily * totalDays;
      // IOF fixo sobre o valor total
      const iofFixedAmount = chartValue * iofFixed;
      iofTotal = iofDailyAmount + iofFixedAmount;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CÁLCULO DO FINANCIAMENTO (Sistema PRICE)
    // ═══════════════════════════════════════════════════════════════════════════
    
    // Base do financiamento: valor do bem + IOF + tarifas bancárias
    const financingBase = chartValue + iofTotal + bankFees;
    
    // Para imóveis, adicionar seguro mensal ao cálculo
    let monthlyInsurance = 0;
    if (category === 'imovel' && yearlyInsurance > 0) {
      // Converter seguro anual para mensal (simplificado)
      monthlyInsurance = (chartValue * yearlyInsurance) / 12 / timeToAcquire;
    }
    
    // Taxa efetiva mensal
    const effectiveMonthlyRate = monthlyRate;
    
    // Fórmula PRICE: M = P * [i * (1+i)^n] / [(1+i)^n - 1]
    const factor = Math.pow(1 + effectiveMonthlyRate, timeToAcquire);
    const financingMonthly = (financingBase * effectiveMonthlyRate * factor) / (factor - 1) + monthlyInsurance;
    
    // Total pago no financiamento
    const financingTotal = financingMonthly * timeToAcquire;
    
    // Total de juros pagos
    const totalInterest = financingTotal - chartValue - iofTotal - bankFees;
    
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