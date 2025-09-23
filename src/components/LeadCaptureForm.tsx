import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, ArrowRight, Calculator, TrendingUp, CreditCard, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LeadData } from './ConsortiumSimulator';
import { useSimulatorConfig } from '@/hooks/useSimulatorConfig';

interface LeadCaptureFormProps {
  onSubmit: (data: LeadData) => void;
}

type FormStep = 'personal' | 'financial';

export const LeadCaptureForm = ({ onSubmit }: LeadCaptureFormProps) => {
  const { calculateLeadScore } = useSimulatorConfig();
  
  const [currentStep, setCurrentStep] = useState<FormStep>('personal');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    chartValue: 0,
    timeToAcquire: 12,
    ownResources: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Máscara para telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3');
    }
    return value;
  };

  // Função para formatar valor em BRL
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const validateStep = (step: FormStep): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 'personal') {
      if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
      if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'E-mail inválido';
      if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
      else if (formData.phone.replace(/\D/g, '').length < 11) newErrors.phone = 'Telefone inválido';
    }

    if (step === 'financial') {
      // Validação removida pois o chartValue não é mais coletado nesta etapa
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 'personal') setCurrentStep('financial');
      else handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep === 'financial') setCurrentStep('personal');
  };

  const handleSubmit = () => {
    if (validateStep('financial')) {
      const leadScore = calculateLeadScore(formData);
      const leadData: LeadData = {
        ...formData,
        leadScore
      };
      
      // Aqui você pode adicionar a integração com RD Station
      // fetch('sua-api-endpoint', { method: 'POST', body: JSON.stringify(leadData) })
      
      onSubmit(leadData);
    }
  };

  const getProgressValue = () => {
    if (currentStep === 'personal') return 50;
    return 100;
  };

  const stepIcons = {
    personal: <CreditCard className="w-5 h-5" />,
    financial: <Calculator className="w-5 h-5" />
  };

  const stepTitles = {
    personal: 'Dados Pessoais',
    financial: 'Informações Financeiras'
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
          Simulador de Consórcio
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Descubra como economizar com <strong>parcelas sem juros</strong> e <strong>valores reduzidos</strong>
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center bg-success/10 text-success px-4 py-2 rounded-full">
            <span className="font-semibold">✓ Sem Juros</span>
          </div>
          <div className="flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full">
            <span className="font-semibold">✓ Parcelas Reduzidas</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {Object.entries(stepTitles).map(([key, title], index) => (
            <div 
              key={key}
              className={`flex items-center gap-2 ${
                currentStep === key ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {stepIcons[key as FormStep]}
              <span className="hidden md:block text-sm font-medium">{title}</span>
            </div>
          ))}
        </div>
        <Progress value={getProgressValue()} className="h-2" />
      </div>

      {/* Form */}
      <Card className="card-elevated animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {stepIcons[currentStep]}
            {stepTitles[currentStep]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Dados Pessoais */}
          {currentStep === 'personal' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={errors.name ? 'border-destructive' : ''}
                  placeholder="Digite seu nome completo"
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={errors.email ? 'border-destructive' : ''}
                  placeholder="seu@email.com"
                />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Celular *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: formatPhone(e.target.value)})}
                  className={errors.phone ? 'border-destructive' : ''}
                  placeholder="(11)99999-9999"
                  maxLength={14}
                />
                {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
              </div>
            </div>
          )}

          {/* Informações Financeiras */}
          {currentStep === 'financial' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label htmlFor="ownResources">Qual o valor de recurso próprio para o lance?</Label>
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(formData.ownResources)}
                    </span>
                  </div>
                  <Slider
                    value={[formData.ownResources]}
                    onValueChange={(value) => setFormData({...formData, ownResources: value[0]})}
                    min={50000}
                    max={300000}
                    step={50000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>R$ 50.000</span>
                    <span>R$ 300.000</span>
                  </div>
                </div>
                {errors.ownResources && <p className="text-sm text-destructive mt-1">{errors.ownResources}</p>}
              </div>
            </div>
          )}


          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 'personal'}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <Button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2"
              variant="hero"
              size="lg"
            >
              {currentStep === 'financial' ? 'Iniciar Simulação' : 'Próximo'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <div className="flex flex-col items-center gap-4 mt-8">
        <p className="text-sm text-muted-foreground text-center">
          🔒 Seus dados estão protegidos • ⚡ Simulação instantânea • ✅ Sem compromisso
        </p>
      </div>
    </div>
  );
};