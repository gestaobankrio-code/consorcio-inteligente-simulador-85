import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, UserPlus, ShieldCheck } from 'lucide-react';
import { LeadData, SimulationData, SimulationResult } from './ConsortiumSimulator';
import { useLeads } from '@/hooks/useLeads';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/use-toast';
import InputMask from 'react-input-mask';

interface LeadCaptureFormProps {
  onSubmit: (data: LeadData) => void;
  simulationData: SimulationData;
  results: SimulationResult;
}

export const LeadCaptureForm = ({ onSubmit, simulationData, results }: LeadCaptureFormProps) => {
  const { saveLead } = useLeads();
  const { leadScoring } = useSettings();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'E-mail inválido';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    else if (formData.phone.replace(/\D/g, '').length < 11) newErrors.phone = 'Telefone deve ter 11 dígitos';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateLeadScore = () => {
    let score = 0;
    
    if (simulationData.chartValue >= leadScoring.chartValue.min) score += leadScoring.chartValue.high;
    else if (simulationData.chartValue >= leadScoring.chartValue.mid) score += leadScoring.chartValue.medium;
    else if (simulationData.chartValue >= leadScoring.chartValue.low) score += leadScoring.chartValue.low_score;
    
    const resourcesPercentage = (simulationData.ownResources / simulationData.chartValue) * 100;
    if (resourcesPercentage >= leadScoring.resources.high) score += leadScoring.resources.high_score;
    else if (resourcesPercentage >= leadScoring.resources.medium) score += leadScoring.resources.medium_score;
    
    if (simulationData.timeToAcquire <= leadScoring.timeToAcquire.fast) score += leadScoring.timeToAcquire.fast_score;
    else if (simulationData.timeToAcquire <= leadScoring.timeToAcquire.medium) score += leadScoring.timeToAcquire.medium_score;
    
    return score;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const leadScore = calculateLeadScore();
      
      // Save lead to Supabase
      const leadData = await saveLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        category: simulationData.category,
        chart_value: simulationData.chartValue,
        time_to_acquire: simulationData.timeToAcquire,
        own_resources: simulationData.ownResources,
        lead_score: leadScore,
        monthly_payment: results.consortium.monthlyPayment,
        total_savings: results.savings,
        savings_percentage: results.savingsPercentage
      });

      if (leadData) {
        const leadDataWithScore: LeadData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          chartValue: simulationData.chartValue,
          timeToAcquire: simulationData.timeToAcquire,
          ownResources: simulationData.ownResources,
          leadScore
        };

        onSubmit({ ...leadDataWithScore, leadId: leadData.id });
        
        toast({
          title: "Dados salvos com sucesso!",
          description: "Agora você verá seus resultados detalhados.",
        });
      } else {
        throw new Error('Erro ao salvar dados');
      }
    } catch (error) {
      toast({
        title: "Erro ao processar dados",
        description: "Tente novamente em alguns momentos.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Quase pronto! 🎯
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Para ver seus resultados personalizados, precisamos de algumas informações
        </p>
        
        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center bg-success/10 text-success px-4 py-2 rounded-lg">
            <ShieldCheck className="w-4 h-4 mr-2" />
            <span className="font-semibold text-sm">Dados Protegidos</span>
          </div>
          <div className="flex items-center bg-primary/10 text-primary px-4 py-2 rounded-lg">
            <UserPlus className="w-4 h-4 mr-2" />
            <span className="font-semibold text-sm">Sem Spam</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="card-elevated animate-slide-up">
        <CardHeader>
          <CardTitle>Preencha seus dados de contato</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={errors.name ? 'border-destructive' : ''}
                placeholder="Digite seu nome completo"
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Celular *</Label>
              <InputMask
                mask="(99) 99999-9999"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={isSubmitting}
              >
                {(inputProps: any) => (
                  <Input
                    {...inputProps}
                    id="phone"
                    type="tel"
                    className={errors.phone ? 'border-destructive' : ''}
                    placeholder="(11) 99999-9999"
                  />
                )}
              </InputMask>
              {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Processando...</>
              ) : (
                <>
                  Ver Meus Resultados
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          🔒 Seus dados estão seguros. Não enviamos spam e você pode cancelar a qualquer momento.
        </p>
      </div>
    </div>
  );
};