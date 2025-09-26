import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calculator, Car, Home, Truck, CheckCircle2 } from 'lucide-react';
import { SimulationData } from './ConsortiumSimulator';

interface SimulatorInterfaceProps {
  onSubmit: (data: SimulationData) => void;
}

export const SimulatorInterface = ({ onSubmit }: SimulatorInterfaceProps) => {
  const [simulationData, setSimulationData] = useState<SimulationData>({
    category: 'auto',
    chartValue: 100000,
    ownResources: 50000,
    timeToAcquire: 24
  });

  const categories = [
    {
      id: 'auto',
      name: 'Automóvel',
      icon: <Car className="w-6 h-6" />,
      description: 'Carros, motos e veículos leves',
      gradient: 'from-blue-500 to-blue-600',
      minValue: 30000,
      maxValue: 200000,
      maxMonths: 60,
      valueOptions: [30000, 50000, 75000, 100000, 150000, 200000],
      monthOptions: [12, 24, 36, 48, 60]
    },
    {
      id: 'imovel',
      name: 'Imóvel',
      icon: <Home className="w-6 h-6" />,
      description: 'Casas, apartamentos e terrenos',
      gradient: 'from-green-500 to-green-600',
      minValue: 70000,
      maxValue: 1000000,
      maxMonths: 200,
      valueOptions: [70000, 100000, 150000, 200000, 300000, 500000, 700000, 1000000],
      monthOptions: [24, 36, 48, 60, 72, 84, 96, 120, 144, 168, 200]
    },
    {
      id: 'caminhao',
      name: 'Caminhão',
      icon: <Truck className="w-6 h-6" />,
      description: 'Caminhões e veículos pesados',
      gradient: 'from-orange-500 to-orange-600',
      minValue: 200000,
      maxValue: 360000,
      maxMonths: 120,
      valueOptions: [200000, 250000, 300000, 360000],
      monthOptions: [36, 48, 60, 72, 84, 96, 108, 120]
    }
  ];

  // Função para formatação de moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para obter a categoria atual
  const getCurrentCategory = () => {
    return categories.find(cat => cat.id === simulationData.category) || categories[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(simulationData);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Simulador de Consórcio 🚀
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Descubra <strong>quanto você pode economizar</strong> com consórcio
        </p>
        
        {/* Benefícios destacados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center justify-center bg-success/10 text-success px-6 py-3 rounded-lg">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            <span className="font-semibold">Parcelas sem Juros</span>
          </div>
          <div className="flex items-center justify-center bg-primary/10 text-primary px-6 py-3 rounded-lg">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            <span className="font-semibold">Valores Reduzidos</span>
          </div>
        </div>
      </div>

      {/* Categoria Selection */}
      <Card className="card-elevated mb-6 animate-slide-up">
        <CardHeader>
          <CardTitle>Escolha a categoria do seu bem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  simulationData.category === category.id
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSimulationData({...simulationData, category: category.id as any})}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${category.gradient} rounded-lg flex items-center justify-center text-white mb-4`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                
                {simulationData.category === category.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Simulation Form */}
      <form onSubmit={handleSubmit}>
        <Card className="card-elevated animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Personalize sua simulação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="chartValue">Valor da Carta</Label>
                <Select
                  value={simulationData.chartValue.toString()}
                  onValueChange={(value) => setSimulationData({...simulationData, chartValue: Number(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getCurrentCategory().valueOptions.map((value) => (
                      <SelectItem key={value} value={value.toString()}>
                        {formatCurrency(value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeToAcquire">Prazo para Aquisição</Label>
                <Select
                  value={simulationData.timeToAcquire.toString()}
                  onValueChange={(value) => setSimulationData({...simulationData, timeToAcquire: Number(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getCurrentCategory().monthOptions.map((months) => (
                      <SelectItem key={months} value={months.toString()}>
                        {months} meses
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="ownResources">Recursos Próprios para Lance</Label>
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(simulationData.ownResources)}
                    </span>
                  </div>
                  <Slider
                    value={[simulationData.ownResources]}
                    onValueChange={(value) => setSimulationData({...simulationData, ownResources: value[0]})}
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
                <p className="text-sm text-muted-foreground mt-1">
                  Quanto maior o lance, maior a chance de ser contemplado rapidamente
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8">
          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Calculator className="w-4 h-4" />
            Simular Agora
          </Button>
        </div>
      </form>

      {/* Additional Info */}
      <div className="text-center mt-8">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">Por que escolher o consórcio?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Sem Juros:</strong> Você não paga juros sobre o valor financiado
            </div>
            <div>
              <strong>Parcelas Menores:</strong> Valores mais baixos que o financiamento tradicional
            </div>
            <div>
              <strong>Flexibilidade:</strong> Pode usar recursos próprios para acelerar a contemplação
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};