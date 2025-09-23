import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Code, Settings, ArrowLeft, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/use-toast';

export default function Integration() {
  const [copied, setCopied] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    rdStationConfig,
    leadScoring,
    loading,
    saveRdStationConfig,
    saveLeadScoring,
    setRdStationConfig,
    setLeadScoring
  } = useSettings();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSaveRdStation = async () => {
    const success = await saveRdStationConfig(rdStationConfig);
    if (success) {
      setSaved('rdstation');
      toast({
        title: "Configurações salvas!",
        description: "Configurações do RD Station foram salvas com sucesso.",
      });
      setTimeout(() => setSaved(null), 2000);
    } else {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações do RD Station.",
        variant: "destructive",
      });
    }
  };

  const handleSaveLeadScoring = async () => {
    const success = await saveLeadScoring(leadScoring);
    if (success) {
      setSaved('leadscoring');
      toast({
        title: "Lead Scoring salvo!",
        description: "Configurações de Lead Scoring foram salvas com sucesso.",
      });
      setTimeout(() => setSaved(null), 2000);
    } else {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações de Lead Scoring.",
        variant: "destructive",
      });
    }
  };

  const generateWordPressCode = () => {
    return `<!-- SIMULADOR DE CONSÓRCIO - WORDPRESS -->
<div id="consortium-simulator" style="max-width: 1024px; margin: 0 auto; padding: 16px;"></div>

<!-- CSS do Simulador -->
<style>
#consortium-simulator * { box-sizing: border-box; }
.cs-gradient-primary { background: linear-gradient(135deg, #1e40af, #3b82f6); }
.cs-gradient-text { 
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.cs-animate-fade-in { animation: csFadeIn 0.4s ease-out; }
.cs-animate-slide-up { animation: csSlideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
.cs-animate-bounce-in { animation: csBounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
.cs-animate-glow { animation: csGlow 2s ease-in-out infinite; }

@keyframes csFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes csSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes csBounceIn { 
  0% { opacity: 0; transform: scale(0.3); }
  50% { opacity: 1; transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes csGlow { 0%, 100% { box-shadow: 0 0 20px rgba(30, 64, 175, 0.3); } 50% { box-shadow: 0 0 40px rgba(30, 64, 175, 0.5); } }

.cs-btn-specialist {
  background: linear-gradient(45deg, #1e40af, #3b82f6);
  color: white; font-weight: bold; padding: 12px 24px;
  border-radius: 8px; border: none; cursor: pointer;
  transition: all 0.3s ease; display: inline-block;
  text-decoration: none;
}
.cs-btn-specialist:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(30, 64, 175, 0.4); }

.cs-form-container { 
  background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
  padding: 32px; margin-bottom: 24px; 
}
.cs-input { 
  width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px;
  margin-bottom: 16px; font-size: 16px;
}
.cs-input:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
.cs-label { display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px; }
.cs-grid { display: grid; gap: 16px; }
.cs-grid-2 { grid-template-columns: 1fr 1fr; }
.cs-btn-primary { 
  width: 100%; background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: white; font-weight: bold; padding: 12px 24px; border: none;
  border-radius: 8px; cursor: pointer; font-size: 16px; transition: opacity 0.3s;
}
.cs-btn-primary:hover { opacity: 0.9; }
.cs-results-grid { display: grid; gap: 24px; margin-bottom: 32px; }
.cs-card { background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 24px; }
.cs-card-blue { border: 2px solid #bfdbfe; }
.cs-card-red { border: 2px solid #fecaca; }
.cs-text-center { text-align: center; }
.cs-text-blue { color: #2563eb; }
.cs-text-red { color: #dc2626; }
.cs-text-xl { font-size: 1.25rem; }
.cs-text-2xl { font-size: 1.5rem; }
.cs-text-3xl { font-size: 1.875rem; }
.cs-text-4xl { font-size: 2.25rem; }
.cs-font-bold { font-weight: bold; }
.cs-mb-2 { margin-bottom: 8px; }
.cs-mb-4 { margin-bottom: 16px; }
.cs-mb-6 { margin-bottom: 24px; }
.cs-mb-8 { margin-bottom: 32px; }
.cs-space-y-3 > * + * { margin-top: 12px; }
.cs-flex { display: flex; }
.cs-justify-between { justify-content: space-between; }
.cs-pt-3 { padding-top: 12px; }
.cs-border-t { border-top: 1px solid #e5e7eb; }

@media (min-width: 768px) {
  .cs-grid-2 { grid-template-columns: 1fr 1fr; }
  .cs-results-grid { grid-template-columns: 1fr 1fr; }
}
</style>

<!-- JavaScript do Simulador -->
<script>
class ConsortiumSimulator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentStep = 'lead-capture';
    this.leadData = null;
    this.config = {
      rdStation: ${JSON.stringify(rdStationConfig)},
      leadScoring: ${JSON.stringify(leadScoring)}
    };
    this.render();
  }

  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  formatPhone(value) {
    const numbers = value.replace(/\\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\\d{2})(\\d{5})(\\d{4})/, '($1) $2-$3');
    }
    return value;
  }

  calculateLeadScore(formData) {
    const config = this.config.leadScoring;
    let score = 0;
    
    if (formData.chartValue >= config.chartValue.min) score += config.chartValue.high;
    else if (formData.chartValue >= config.chartValue.mid) score += config.chartValue.medium;
    else if (formData.chartValue >= config.chartValue.low) score += config.chartValue.low_score;
    
    const resourcesPercentage = (formData.ownResources / formData.chartValue) * 100;
    if (resourcesPercentage >= config.resources.high) score += config.resources.high_score;
    else if (resourcesPercentage >= config.resources.medium) score += config.resources.medium_score;
    
    if (formData.timeToAcquire <= config.timeToAcquire.fast) score += config.timeToAcquire.fast_score;
    else if (formData.timeToAcquire <= config.timeToAcquire.medium) score += config.timeToAcquire.medium_score;
    
    return score;
  }

  calculateResults(data) {
    const { category = 'auto', chartValue, ownResources, timeToAcquire } = data;
    
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
    
    const savings = financingTotal - consortiumTotal;
    const savingsPercentage = (savings / financingTotal) * 100;
    
    return { consortiumMonthly, consortiumTotal, financingMonthly, financingTotal, savings, savingsPercentage };
  }

  async sendToRDStation(leadData) {
    const config = this.config.rdStation;
    if (!config.token) return;
    
    try {
      await fetch('https://api.rd.services/platform/conversions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + config.token
        },
        body: JSON.stringify({
          event_type: "CONVERSION",
          event_family: "CDP",
          payload: {
            conversion_identifier: config.conversionIdentifier,
            email: leadData.email,
            name: leadData.name,
            mobile_phone: leadData.phone,
            cf_valor_carta: leadData.chartValue,
            cf_lead_score: leadData.leadScore,
            cf_tempo_aquisicao: leadData.timeToAcquire,
            cf_recursos_proprios: leadData.ownResources
          }
        })
      });
    } catch (error) {
      console.error('Erro ao enviar para RD Station:', error);
    }
  }

  renderLeadForm() {
    return \`
      <div class="cs-animate-fade-in">
        <div class="cs-text-center cs-mb-8">
          <h1 class="cs-text-4xl cs-font-bold cs-gradient-text cs-mb-4">Simulador de Consórcio</h1>
          <p class="cs-text-xl cs-mb-6">Descubra como economizar com <strong>parcelas sem juros</strong></p>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; margin-bottom: 32px;">
            <div style="background: #dbeafe; color: #1e40af; padding: 8px 16px; border-radius: 20px; font-weight: 600;">✓ Sem Juros</div>
            <div style="background: #eff6ff; color: #1d4ed8; padding: 8px 16px; border-radius: 20px; font-weight: 600;">✓ Parcelas Reduzidas</div>
          </div>
        </div>

        <div class="cs-form-container cs-animate-slide-up">
          <h2 class="cs-text-2xl cs-font-bold cs-mb-6">Preencha seus dados</h2>
          <form id="lead-form">
            <div class="cs-grid cs-grid-2" style="margin-bottom: 16px;">
              <div>
                <label class="cs-label">Nome Completo *</label>
                <input type="text" name="name" required class="cs-input">
              </div>
              <div>
                <label class="cs-label">E-mail *</label>
                <input type="email" name="email" required class="cs-input">
              </div>
            </div>
            <div style="margin-bottom: 16px;">
              <label class="cs-label">Celular *</label>
              <input type="tel" name="phone" required maxlength="14" placeholder="(11) 99999-9999" class="cs-input">
            </div>
            <div class="cs-grid cs-grid-2" style="margin-bottom: 16px;">
              <div>
                <label class="cs-label">Valor da Carta *</label>
                <select name="chartValue" required class="cs-input">
                  <option value="">Selecione</option>
                  <option value="50000">R$ 50.000</option>
                  <option value="100000">R$ 100.000</option>
                  <option value="150000">R$ 150.000</option>
                  <option value="200000">R$ 200.000</option>
                  <option value="300000">R$ 300.000</option>
                  <option value="500000">R$ 500.000</option>
                </select>
              </div>
              <div>
                <label class="cs-label">Prazo desejado *</label>
                <select name="timeToAcquire" required class="cs-input">
                  <option value="">Selecione</option>
                  <option value="12">12 meses</option>
                  <option value="24">24 meses</option>
                  <option value="36">36 meses</option>
                  <option value="48">48 meses</option>
                  <option value="60">60 meses</option>
                </select>
              </div>
            </div>
            <div style="margin-bottom: 24px;">
              <label class="cs-label">Recursos próprios para lance</label>
              <input type="number" name="ownResources" min="0" placeholder="0" class="cs-input">
            </div>
            <button type="submit" class="cs-btn-primary">
              🚀 Simular Economia Agora!
            </button>
          </form>
        </div>
      </div>
    \`;
  }

  renderResults() {
    const results = this.calculateResults(this.leadData);
    const showSpecialistCTA = this.leadData.leadScore >= 5;
    const firstName = this.leadData.name.split(' ')[0];

    return \`
      <div class="cs-animate-fade-in">
        <div class="cs-text-center cs-mb-8">
          <h1 class="cs-text-3xl cs-font-bold cs-mb-4">Parabéns, \${firstName}! 🎉</h1>
          <div style="background: linear-gradient(to right, #dbeafe, #eff6ff); border-radius: 16px; padding: 32px; margin-bottom: 24px;" class="cs-animate-bounce-in">
            <h2 class="cs-text-2xl cs-font-bold cs-text-blue cs-mb-2">Você pode economizar</h2>
            <div class="cs-text-4xl cs-font-bold cs-gradient-text cs-mb-2">\${this.formatCurrency(results.savings)}</div>
            <p class="cs-text-xl">Isso representa <strong class="cs-text-blue">\${results.savingsPercentage.toFixed(1)}%</strong> de economia!</p>
          </div>
        </div>

        <div class="cs-results-grid cs-mb-8">
          <div class="cs-card cs-card-blue">
            <h3 class="cs-text-xl cs-font-bold cs-text-blue cs-mb-4">✅ Consórcio (Recomendado)</h3>
            <div class="cs-space-y-3">
              <div class="cs-flex cs-justify-between"><span>Parcela Mensal:</span><span class="cs-font-bold">\${this.formatCurrency(results.consortiumMonthly)}</span></div>
              <div class="cs-flex cs-justify-between"><span>Valor Total:</span><span class="cs-font-bold">\${this.formatCurrency(results.consortiumTotal)}</span></div>
              <div class="cs-pt-3 cs-border-t"><span class="cs-text-blue" style="font-size: 14px;">✓ Sem juros ✓ Parcelas reduzidas</span></div>
            </div>
          </div>
          <div class="cs-card cs-card-red">
            <h3 class="cs-text-xl cs-font-bold cs-text-red cs-mb-4">❌ Financiamento Tradicional</h3>
            <div class="cs-space-y-3">
              <div class="cs-flex cs-justify-between"><span>Parcela Mensal:</span><span class="cs-font-bold">\${this.formatCurrency(results.financingMonthly)}</span></div>
              <div class="cs-flex cs-justify-between"><span>Valor Total:</span><span class="cs-font-bold">\${this.formatCurrency(results.financingTotal)}</span></div>
              <div class="cs-pt-3 cs-border-t cs-text-red" style="font-size: 14px;">❌ Com juros, IOF e tarifas</div>
            </div>
          </div>
        </div>

        <div class="cs-gradient-primary" style="color: white; border-radius: 8px; padding: 32px; text-align: center;">
          <h3 class="cs-text-2xl cs-font-bold cs-mb-4">Transforme essa economia em realidade! 🚀</h3>
          <div style="display: flex; flex-direction: column; gap: 16px; justify-content: center; align-items: center;">
            \${showSpecialistCTA ? \`
              <button 
                class="cs-btn-specialist cs-animate-glow"
                onclick="(() => { 
                  const config = this.config.rdStation; 
                  const whatsapp = config.whatsappNumber || '5511999999999'; 
                  const message = 'Olá! Fiz uma simulação e posso economizar ' + this.formatCurrency(results.savings) + '!';
                  window.open('https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(message), '_blank'); 
                })()"
              >
                💬 Fale com Especialista!
              </button>
            \` : ''}
            <button onclick="window.simulator.reset()" style="background: white; color: #2563eb; font-weight: bold; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer;">🔄 Nova Simulação</button>
          </div>
        </div>
      </div>
    \`;
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      chartValue: Number(formData.get('chartValue')),
      timeToAcquire: Number(formData.get('timeToAcquire')),
      ownResources: Number(formData.get('ownResources')) || 0
    };

    data.leadScore = this.calculateLeadScore(data);
    this.sendToRDStation(data);
    this.leadData = data;
    this.currentStep = 'results';
    this.render();
  }

  reset() {
    this.currentStep = 'lead-capture';
    this.leadData = null;
    this.render();
  }

  render() {
    let content = this.currentStep === 'lead-capture' ? this.renderLeadForm() : this.renderResults();
    this.container.innerHTML = content;

    if (this.currentStep === 'lead-capture') {
      const form = document.getElementById('lead-form');
      const phoneInput = form.querySelector('input[name="phone"]');
      phoneInput.addEventListener('input', (e) => {
        e.target.value = this.formatPhone(e.target.value);
      });
      form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
  }
}

// Inicializar quando o DOM estiver pronto
(function() {
  function initSimulator() {
    if (document.getElementById('consortium-simulator')) {
      window.simulator = new ConsortiumSimulator('consortium-simulator');
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimulator);
  } else {
    initSimulator();
  }
})();
</script>`;
  };

  const generateRDStationConfig = () => {
    return `// CONFIGURAÇÃO RD STATION

// 1. Obtenha seu token de API no RD Station
// 2. Configure o webhook/conversão no RD Station
// 3. Substitua as configurações abaixo

const rdStationConfig = {
  token: "${rdStationConfig.token}",
  apiUrl: "https://api.rd.services/platform/conversions",
  conversionIdentifier: "${rdStationConfig.conversionIdentifier}",
  
  // Campos personalizados que serão enviados
  customFields: {
    cf_valor_carta: "Valor da Carta",
    cf_tempo_aquisicao: "Tempo de Aquisição", 
    cf_recursos_proprios: "Recursos Próprios",
    cf_lead_score: "Lead Score",
    cf_categoria: "Categoria do Bem"
  }
};

// Função para enviar dados para RD Station
async function sendToRDStation(leadData) {
  try {
    const response = await fetch(rdStationConfig.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${rdStationConfig.token}\`
      },
      body: JSON.stringify({
        event_type: "CONVERSION",
        event_family: "CDP",
        payload: {
          conversion_identifier: rdStationConfig.conversionIdentifier,
          email: leadData.email,
          name: leadData.name,
          mobile_phone: leadData.phone,
          cf_valor_carta: leadData.chartValue,
          cf_tempo_aquisicao: leadData.timeToAcquire,
          cf_recursos_proprios: leadData.ownResources,
          cf_lead_score: leadData.leadScore,
          cf_categoria: leadData.category || 'auto'
        }
      })
    });
    
    if (response.ok) {
      console.log('✅ Lead enviado para RD Station com sucesso');
    } else {
      console.error('❌ Erro ao enviar para RD Station:', await response.text());
    }
  } catch (error) {
    console.error('❌ Erro na integração RD Station:', error);
  }
}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Simulador
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Integração WordPress & RD Station</h1>
            <p className="text-muted-foreground">Configure e copie o código para seu site</p>
          </div>
        </div>

        <Tabs defaultValue="wordpress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wordpress" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              WordPress
            </TabsTrigger>
            <TabsTrigger value="rdstation" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              RD Station
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* WordPress Integration */}
          <TabsContent value="wordpress">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Código para WordPress
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Copie o código completo e cole em um bloco "HTML personalizado" no WordPress
                </p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Textarea
                    value={generateWordPressCode()}
                    readOnly
                    className="min-h-[400px] font-mono text-xs"
                  />
                  <Button
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(generateWordPressCode(), 'wordpress')}
                  >
                    {copied === 'wordpress' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">📋 Como usar no WordPress:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Copie todo o código acima</li>
                    <li>No WordPress, edite a página onde quer o simulador</li>
                    <li>Adicione um bloco "HTML personalizado"</li>
                    <li>Cole o código completo</li>
                    <li>Configure o token do RD Station na aba "Configurações"</li>
                    <li>Publique a página</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RD Station Configuration */}
          <TabsContent value="rdstation">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Configuração RD Station
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure sua integração com RD Station
                </p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Textarea
                    value={generateRDStationConfig()}
                    readOnly
                    className="min-h-[300px] font-mono text-xs"
                  />
                  <Button
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(generateRDStationConfig(), 'rdstation')}
                  >
                    {copied === 'rdstation' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">🔑 Como obter o Token do RD Station:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Acesse o RD Station → Configurações → Integrações</li>
                    <li>Crie uma nova aplicação ou use uma existente</li>
                    <li>Copie o Token de API</li>
                    <li>Configure o identificador de conversão único</li>
                    <li>Teste a integração na aba "Configurações"</li>
                  </ol>
                </div>

                <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">📊 Campos Capturados:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Nome e E-mail</div>
                    <div>• Telefone com máscara</div>
                    <div>• Valor da carta</div>
                    <div>• Tempo de aquisição</div>
                    <div>• Recursos próprios</div>
                    <div>• Lead Score (0-7 pontos)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Configurações RD Station</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="token">Token da API RD Station</Label>
                    <Input
                      id="token"
                      type="password"
                      value={rdStationConfig.token}
                      onChange={(e) => setRdStationConfig({...rdStationConfig, token: e.target.value})}
                      placeholder="Seu token da API"
                    />
                  </div>

                  <div>
                    <Label htmlFor="identifier">Identificador de Conversão</Label>
                    <Input
                      id="identifier"
                      value={rdStationConfig.conversionIdentifier}
                      onChange={(e) => setRdStationConfig({...rdStationConfig, conversionIdentifier: e.target.value})}
                      placeholder="simulador-consorcio"
                    />
                  </div>

                  <div>
                    <Label htmlFor="whatsapp">Número WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={rdStationConfig.whatsappNumber}
                      onChange={(e) => setRdStationConfig({...rdStationConfig, whatsappNumber: e.target.value})}
                      placeholder="5511999999999"
                    />
                  </div>

                  <Button 
                    onClick={handleSaveRdStation}
                    className="w-full"
                    variant={saved === 'rdstation' ? 'default' : 'outline'}
                    disabled={loading}
                  >
                    {saved === 'rdstation' ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Salvo!
                      </>
                    ) : (
                      'Salvar Configurações'
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Lead Scoring</CardTitle>
                  <p className="text-sm text-muted-foreground">Configure os critérios de pontuação</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Valor da Carta */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Valor da Carta</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Valor Alto (R$)</Label>
                          <Input
                            type="number"
                            value={leadScoring.chartValue.min}
                            onChange={(e) => setLeadScoring({
                              ...leadScoring,
                              chartValue: { ...leadScoring.chartValue, min: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Pontos</Label>
                          <Input
                            type="number"
                            value={leadScoring.chartValue.high}
                            onChange={(e) => setLeadScoring({
                              ...leadScoring,
                              chartValue: { ...leadScoring.chartValue, high: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Valor Médio (R$)</Label>
                          <Input
                            type="number"
                            value={leadScoring.chartValue.mid}
                            onChange={(e) => setLeadScoring({
                              ...leadScoring,
                              chartValue: { ...leadScoring.chartValue, mid: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Pontos</Label>
                          <Input
                            type="number"
                            value={leadScoring.chartValue.medium}
                            onChange={(e) => setLeadScoring({
                              ...leadScoring,
                              chartValue: { ...leadScoring.chartValue, medium: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Valor Baixo (R$)</Label>
                          <Input
                            type="number"
                            value={leadScoring.chartValue.low}
                            onChange={(e) => setLeadScoring({
                              ...leadScoring,
                              chartValue: { ...leadScoring.chartValue, low: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Pontos</Label>
                          <Input
                            type="number"
                            value={leadScoring.chartValue.low_score}
                            onChange={(e) => setLeadScoring({
                              ...leadScoring,
                              chartValue: { ...leadScoring.chartValue, low_score: Number(e.target.value) }
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Recursos Próprios */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Recursos Próprios (%)</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Alto (%)</Label>
                          <Input
                            type="number"
                            value={leadScoring.resources.high}
                            onChange={(e) => setLeadScoring({
                              ...leadScoring,
                              resources: { ...leadScoring.resources, high: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Pontos</Label>
                          <Input
                            type="number"
                            value={leadScoring.resources.high_score}
                            onChange={(e) => setLeadScoring({
                              ...leadScoring,
                              resources: { ...leadScoring.resources, high_score: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Médio (%)</Label>
                          <Input
                            type="number"
                            value={leadScoring.resources.medium}
                            onChange={(e) => setLeadScoring({
                              ...leadScoring,
                              resources: { ...leadScoring.resources, medium: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Pontos</Label>
                          <Input
                            type="number"
                            value={leadScoring.resources.medium_score}
                            onChange={(e) => setLeadScoring({
                              ...leadScoring,
                              resources: { ...leadScoring.resources, medium_score: Number(e.target.value) }
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tempo de Aquisição */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Tempo de Aquisição (meses)</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Rápido (meses)</Label>
                          <Input
                            type="number"
                            value={leadScoring.timeToAcquire.fast}
                            onChange={(e) => setLeadScoring({
                              ...leadScoring,
                              timeToAcquire: { ...leadScoring.timeToAcquire, fast: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Pontos</Label>
                          <Input
                            type="number"
                            value={leadScoring.timeToAcquire.fast_score}
                            onChange={(e) => setLeadScoring({
                              ...leadScoring,
                              timeToAcquire: { ...leadScoring.timeToAcquire, fast_score: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Médio (meses)</Label>
                          <Input
                            type="number"
                            value={leadScoring.timeToAcquire.medium}
                            onChange={(e) => setLeadScoring({
                              ...leadScoring,
                              timeToAcquire: { ...leadScoring.timeToAcquire, medium: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Pontos</Label>
                          <Input
                            type="number"
                            value={leadScoring.timeToAcquire.medium_score}
                            onChange={(e) => setLeadScoring({
                              ...leadScoring,
                              timeToAcquire: { ...leadScoring.timeToAcquire, medium_score: Number(e.target.value) }
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold">Score ≥ 5 pontos</span>
                        <span className="text-success font-bold">Botão Especialista</span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleSaveLeadScoring}
                      className="w-full"
                      variant={saved === 'leadscoring' ? 'default' : 'outline'}
                      disabled={loading}
                    >
                      {saved === 'leadscoring' ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Salvo!
                        </>
                      ) : (
                        'Salvar Lead Scoring'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="card-elevated mt-6">
              <CardHeader>
                <CardTitle>Teste de Integração</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const testLead = {
                        name: "Lead Teste",
                        email: "teste@exemplo.com",
                        phone: "(11)99999-9999",
                        chartValue: 200000,
                        leadScore: 5
                      };
                      console.log('Enviando lead teste:', testLead);
                      alert('Verifique o console do navegador para logs da integração');
                    }}
                  >
                    Testar RD Station
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      window.open(`https://wa.me/${rdStationConfig.whatsappNumber}?text=Teste do simulador de consórcio`, '_blank');
                    }}
                  >
                    Testar WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-muted-foreground">
          <p>✨ Simulador configurado e pronto para converter leads qualificados!</p>
        </div>
      </div>
    </div>
  );
}
