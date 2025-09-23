import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface BlurredResultsProps {
  onAnimationComplete: () => void;
}

export const BlurredResults = ({ onAnimationComplete }: BlurredResultsProps) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1500),
      setTimeout(() => setStage(3), 2500),
      setTimeout(() => onAnimationComplete(), 3000)
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [onAnimationComplete]);

  const messages = [
    "Calculando sua simulação...",
    "Comparando opções de financiamento...",
    "Analisando sua economia...",
    "Finalizando resultados..."
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Processando sua simulação
        </h1>
        <p className="text-xl text-muted-foreground">
          Aguarde enquanto calculamos a melhor opção para você...
        </p>
      </div>

      {/* Loading Animation */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <Loader2 className="w-16 h-16 animate-spin text-primary" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-primary/20 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Progress Messages */}
      <div className="text-center mb-8">
        <p className="text-lg font-semibold text-primary animate-pulse">
          {messages[stage] || messages[0]}
        </p>
      </div>

      {/* Blurred Results Preview */}
      <div className="space-y-6" style={{ filter: 'blur(8px)', opacity: 0.6 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">✅ Consórcio</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Parcela Mensal:</span>
                  <span className="font-bold">R$ ██████</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor Total:</span>
                  <span className="font-bold">R$ ██████</span>
                </div>
                <div className="pt-3 border-t">
                  <span className="text-sm text-primary">✓ Sem juros ✓ Parcelas reduzidas</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-destructive/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-destructive mb-4">❌ Financiamento</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Parcela Mensal:</span>
                  <span className="font-bold">R$ ██████</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor Total:</span>
                  <span className="font-bold">R$ ██████</span>
                </div>
                <div className="pt-3 border-t">
                  <span className="text-sm text-destructive">❌ Com juros e tarifas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Economy Preview */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Sua economia:</h2>
          <div className="text-4xl font-bold text-primary mb-2">R$ ██████</div>
          <p className="text-xl">Isso representa ██% de economia!</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8">
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${((stage + 1) / 4) * 100}%` }}
          />
        </div>
        <div className="text-center mt-2 text-sm text-muted-foreground">
          {Math.round(((stage + 1) / 4) * 100)}% concluído
        </div>
      </div>
    </div>
  );
};