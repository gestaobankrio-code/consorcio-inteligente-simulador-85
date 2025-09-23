
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RefreshCw, TrendingDown, Calculator, Phone, Share2, Settings } from 'lucide-react';
import { LeadData, SimulationData, SimulationResult } from './ConsortiumSimulator';
import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';
import { useLeads } from '@/hooks/useLeads';
import { useToast } from '@/hooks/use-toast';

interface ResultsChartProps {
  leadData: LeadData;
  simulationData: SimulationData;
  results: SimulationResult;
  onBackToSimulator: () => void;
  onNewSimulation: () => void;
}

export const ResultsChart = ({ 
  leadData, 
  simulationData, 
  results, 
  onBackToSimulator, 
  onNewSimulation 
}: ResultsChartProps) => {
  const { rdStationConfig } = useSettings();
  const { saveLeadInteraction } = useLeads();
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const categoryNames = {
    auto: 'Automóvel',
    imovel: 'Imóvel', 
    caminhao: 'Caminhão'
  };

  const showSpecialistCTA = leadData.leadScore >= 5; // Lead scoring configurável
  
  // Debug lead scoring (remover em produção)
  console.log('Lead Score:', leadData.leadScore, 'Show Specialist CTA:', showSpecialistCTA);

  const handleWhatsAppClick = async () => {
    try {
      // Registrar clique no WhatsApp
      if (leadData.leadId) {
        await saveLeadInteraction(leadData.leadId, 'whatsapp_click');
      }

      // Criar mensagem detalhada
      const categoryName = categoryNames[simulationData.category];
      const message = `Olá! Acabei de fazer uma simulação de consórcio e gostaria de falar com um especialista.

📊 *Dados da Simulação:*
• Categoria: ${categoryName}
• Valor da Carta: ${formatCurrency(simulationData.chartValue)}
• Prazo de Aquisição: ${simulationData.timeToAcquire} meses
• Recurso para Lance: ${formatCurrency(simulationData.ownResources)}
• Valor da Parcela: ${formatCurrency(results.consortium.monthlyPayment)}

💰 *Resultado:*
• Economia Total: ${formatCurrency(results.savings)}
• Percentual de Economia: ${results.savingsPercentage.toFixed(1)}%

Gostaria de mais informações sobre como fazer parte de um consórcio e aproveitar essa economia!`;

      // Abrir WhatsApp
      const whatsappNumber = rdStationConfig.whatsappNumber || '5511999999999';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      toast({
        title: "Redirecionando para WhatsApp",
        description: "Você será direcionado para conversar com nosso especialista.",
      });

    } catch (error) {
      console.error('Erro ao processar clique no WhatsApp:', error);
      toast({
        title: "Erro",
        description: "Houve um problema. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    const text = `🎯 Descobri uma economia incrível com consórcio!\n\n💰 Economia total: ${formatCurrency(results.savings)}\n📊 Isso representa ${results.savingsPercentage.toFixed(1)}% de economia!\n\n✅ Parcelas sem juros\n✅ Valores reduzidos\n\nSimule você também: [seu-link-aqui]`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Minha Simulação de Consórcio',
        text: text
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header com Resultado Destacado */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full mb-4">
          <TrendingDown className="w-5 h-5" />
          <span className="font-semibold">Resultado da Simulação</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Parabéns, {leadData.name.split(' ')[0]}! 🎉
        </h1>
        
        {/* Destaque da Economia */}
        <div className="bg-gradient-to-r from-success/20 to-primary/20 rounded-2xl p-8 mb-6 animate-bounce-in">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-success mb-2">
              Você pode economizar
            </h2>
            <div className="text-4xl md:text-6xl font-bold gradient-text mb-2">
              {formatCurrency(results.savings)}
            </div>
            <p className="text-xl text-muted-foreground">
              Isso representa <strong className="text-success">{results.savingsPercentage.toFixed(1)}%</strong> de economia!
            </p>
          </div>
        </div>
      </div>

      {/* Resumo da Simulação */}
      <Card className="card-elevated mb-6 animate-slide-up">
        <CardHeader>
          <CardTitle>Resumo da Simulação - {categoryNames[simulationData.category]}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Valor da Carta</p>
              <p className="text-lg font-bold">{formatCurrency(simulationData.chartValue)}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Prazo</p>
              <p className="text-lg font-bold">{simulationData.timeToAcquire} meses</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Recursos Próprios</p>
              <p className="text-lg font-bold">{formatCurrency(simulationData.ownResources)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparação Detalhada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Consórcio */}
        <Card className="card-elevated animate-slide-up border-success/20">
          <CardHeader className="bg-success/5">
            <CardTitle className="text-success flex items-center gap-2">
              ✅ Consórcio (Recomendado)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Parcela Mensal:</span>
                <span className="font-bold text-lg">{formatCurrency(results.consortium.monthlyPayment)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Valor Total:</span>
                <span className="font-bold text-lg">{formatCurrency(results.consortium.totalAmount)}</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-success text-sm">
                  <span>✓ Sem juros</span>
                  <span>✓ Parcelas reduzidas</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financiamento */}
        <Card className="card-elevated animate-slide-up border-destructive/20">
          <CardHeader className="bg-destructive/5">
            <CardTitle className="text-destructive flex items-center gap-2">
              ❌ Financiamento Tradicional
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Parcela Mensal:</span>
                <span className="font-bold text-lg">{formatCurrency(results.financing.monthlyPayment)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Valor Total:</span>
                <span className="font-bold text-lg">{formatCurrency(results.financing.totalAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-destructive">
                <span>Total de Juros:</span>
                <span className="font-bold">{formatCurrency(results.financing.totalInterest)}</span>
              </div>
              <div className="pt-4 border-t">
                <div className="text-destructive text-sm">
                  ❌ Inclui IOF, juros, seguro e tarifas
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call-to-Action */}
      <Card className="card-elevated gradient-bg text-white animate-slide-up">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Transforme essa economia em realidade! 🚀
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Com o consórcio você pode economizar <strong>{formatCurrency(results.savings)}</strong> 
            e ainda realizar o sonho do seu {categoryNames[simulationData.category].toLowerCase()}
          </p>
          
          <div className="flex justify-center">
            {showSpecialistCTA ? (
              <Button
                size="xl"
                variant="hero"
                className="bg-white text-primary hover:bg-white/90 font-bold flex items-center gap-2 animate-pulse"
                onClick={handleWhatsAppClick}
              >
                <Phone className="w-5 h-5" />
                💬 Fale com Especialista Agora!
              </Button>
            ) : (
              <div className="text-center">
                <p className="text-white/80 mb-4">
                  Para falar com um especialista, simule novamente com valores mais altos
                </p>
                <Button
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  onClick={onBackToSimulator}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Ajustar Simulação
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={onBackToSimulator}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Ajustar Simulação
          </Button>
          
          <Button
            variant="outline"
            onClick={onNewSimulation}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Nova Simulação
          </Button>
        </div>

        <Link to="/integracao">
          <Button
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Integração WordPress
          </Button>
        </Link>
      </div>

      {/* Footer Info */}
      <div className="text-center mt-8 p-6 bg-muted/20 rounded-lg">
        <h4 className="font-semibold mb-2">⚡ Vantagens exclusivas do Consórcio:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <strong>✅ Sem Juros:</strong> Você não paga juros bancários sobre o valor
          </div>
          <div>
            <strong>✅ Parcelas Menores:</strong> Mensalidades até {results.savingsPercentage.toFixed(0)}% menores
          </div>
          <div>
            <strong>✅ Flexibilidade:</strong> Use recursos próprios para ser contemplado mais rápido
          </div>
        </div>
      </div>
    </div>
  );
};
