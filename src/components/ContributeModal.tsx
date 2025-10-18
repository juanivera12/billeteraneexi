import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Plus, Target, PiggyBank, Sparkles, Check } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  icon: string;
}

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  onContribute: (goalId: string, amount: number) => void;
}

export function ContributeModal({ isOpen, onClose, goal, onContribute }: ContributeModalProps) {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'confirmation'>('input');

  if (!goal) return null;

  const remainingAmount = goal.target - goal.current;
  const progressPercentage = (goal.current / goal.target) * 100;
  const newAmount = goal.current + parseFloat(amount || '0');
  const newProgressPercentage = Math.min((newAmount / goal.target) * 100, 100);

  const quickAmounts = [
    { label: '10%', value: Math.floor(remainingAmount * 0.1) },
    { label: '25%', value: Math.floor(remainingAmount * 0.25) },
    { label: '50%', value: Math.floor(remainingAmount * 0.5) },
    { label: 'Todo', value: remainingAmount }
  ].filter(item => item.value > 0);

  const handleContribute = () => {
    const contributionAmount = parseFloat(amount);
    if (contributionAmount > 0) {
      onContribute(goal.id, contributionAmount);
      setStep('confirmation');
      
      // Auto-close after showing confirmation
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    setAmount('');
    setStep('input');
    onClose();
  };

  const setQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {step === 'input' ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-green-600" />
                <span>Aportar a meta</span>
              </DialogTitle>
              <DialogDescription>
                Realiza un aporte para acercarte a tu objetivo
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Goal Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-2xl">{goal.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                    <p className="text-sm text-gray-600">
                      ${goal.current.toLocaleString()} de ${goal.target.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <Progress value={progressPercentage} className="h-3 mb-2" />
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{Math.round(progressPercentage)}% completado</span>
                  <span>Faltan ${remainingAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount">Monto a aportar</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="bg-white pl-8 text-lg"
                    max={remainingAmount}
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="space-y-3">
                <Label>Montos sugeridos</Label>
                <div className="grid grid-cols-2 gap-2">
                  {quickAmounts.map((item) => (
                    <Button
                      key={item.label}
                      variant="outline"
                      className="h-auto p-3 flex flex-col space-y-1"
                      onClick={() => setQuickAmount(item.value)}
                    >
                      <span className="text-xs text-gray-600">{item.label}</span>
                      <span className="font-medium">${item.value.toLocaleString()}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {amount && parseFloat(amount) > 0 && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-3 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Vista previa del aporte
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progreso actual:</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Después del aporte:</span>
                      <span className="font-medium text-green-700">{Math.round(newProgressPercentage)}%</span>
                    </div>
                    <Progress value={newProgressPercentage} className="h-3" />
                    <div className="text-center">
                      <span className="text-sm text-green-700">
                        ${newAmount.toLocaleString()} de ${goal.target.toLocaleString()}
                      </span>
                    </div>
                    
                    {newProgressPercentage >= 100 && (
                      <div className="text-center">
                        <Badge className="bg-green-100 text-green-700">
                          <Check className="w-3 h-3 mr-1" />
                          ¡Meta completada!
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Smart Suggestions */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Sugerencia inteligente
                </h4>
                <p className="text-sm text-purple-700">
                  Basado en tu patrón de ahorro, te recomendamos aportar ${Math.floor(remainingAmount * 0.15).toLocaleString()} para mantener un progreso constante.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-purple-700 border-purple-300 hover:bg-purple-100"
                  onClick={() => setQuickAmount(Math.floor(remainingAmount * 0.15))}
                >
                  Usar sugerencia
                </Button>
              </div>

              {/* Actions */}
              <Button
                onClick={handleContribute}
                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > remainingAmount}
                className="w-full bg-green-600 hover:bg-green-700 h-12"
              >
                <Plus className="w-4 h-4 mr-2" />
                Aportar ${amount ? parseFloat(amount).toLocaleString() : '0'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-center">
                <Check className="w-5 h-5 text-green-600" />
                <span>¡Aporte exitoso!</span>
              </DialogTitle>
              <DialogDescription>
                Tu aporte se ha registrado correctamente
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 text-center">
              {/* Success Animation */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aporte confirmado
                </h3>
                <p className="text-gray-600">
                  Has aportado ${parseFloat(amount).toLocaleString()} a tu meta "{goal.title}"
                </p>
              </div>

              {/* Updated Progress */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progreso actualizado</span>
                    <span>{Math.round(newProgressPercentage)}%</span>
                  </div>
                  <Progress value={newProgressPercentage} className="h-3" />
                </div>
                <p className="text-sm text-gray-600">
                  ${newAmount.toLocaleString()} de ${goal.target.toLocaleString()}
                </p>
                
                {newProgressPercentage >= 100 && (
                  <div className="mt-3">
                    <Badge className="bg-green-100 text-green-700">
                      <Check className="w-3 h-3 mr-1" />
                      ¡Felicitaciones! Meta completada
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}