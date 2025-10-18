import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { Badge } from './ui/badge';
import { 
  X, 
  Calculator, 
  Calendar, 
  Target,
  Sparkles,
  ArrowRight,
  Trophy
} from 'lucide-react';

interface ChallengeCustomizerProps {
  onClose: () => void;
  onCreateChallenge: (challenge: CustomChallenge) => void;
}

interface CustomChallenge {
  id: string;
  title: string;
  description: string;
  totalAmount: number;
  duration: number;
  durationType: 'weeks' | 'days';
  weeklyAmount?: number;
  dailyAmount?: number;
  progress: number;
  isActive: boolean;
}

export function ChallengeCustomizer({ onClose, onCreateChallenge }: ChallengeCustomizerProps) {
  const [challengeType, setChallengeType] = useState<'weekly' | 'daily' | null>(null);
  const [totalAmount, setTotalAmount] = useState(137800);
  const [duration, setDuration] = useState(52);
  const [customTitle, setCustomTitle] = useState('');

  const calculateWeeklyAmount = () => {
    if (challengeType === 'weekly') {
      return Math.round(totalAmount / duration);
    }
    return 0;
  };

  const calculateDailyAmount = () => {
    if (challengeType === 'daily') {
      return Math.round(totalAmount / duration);
    }
    return 0;
  };

  const handleCreateChallenge = () => {
    const challenge: CustomChallenge = {
      id: Date.now().toString(),
      title: customTitle || (challengeType === 'weekly' ? `Mi Reto Semanal (${duration} semanas)` : `Mi Reto Diario (${duration} días)`),
      description: challengeType === 'weekly' 
        ? `Ahorra $${calculateWeeklyAmount().toLocaleString()} cada semana durante ${duration} semanas para alcanzar tu meta de $${totalAmount.toLocaleString()}.`
        : `Ahorra $${calculateDailyAmount().toLocaleString()} cada día durante ${duration} días para alcanzar tu meta de $${totalAmount.toLocaleString()}.`,
      totalAmount,
      duration,
      durationType: challengeType === 'weekly' ? 'weeks' : 'days',
      weeklyAmount: challengeType === 'weekly' ? calculateWeeklyAmount() : undefined,
      dailyAmount: challengeType === 'daily' ? calculateDailyAmount() : undefined,
      progress: 0,
      isActive: true
    };

    onCreateChallenge(challenge);
    onClose();
  };

  if (!challengeType) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-4xl bg-card border-border">
          <CardHeader className="text-center">
            <div className="flex justify-between items-center">
              <div></div>
              <div className="text-center flex-1">
                <CardTitle className="text-2xl mb-2 text-card-foreground">Personalizar Mi Reto</CardTitle>
                <p className="text-muted-foreground">Elige el tipo de reto que quieres crear</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Reto Semanal */}
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all border-2 border-orange-200 hover:border-orange-400 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 dark:border-orange-700 dark:hover:border-orange-500"
                onClick={() => setChallengeType('weekly')}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">
                    Reto Semanal Personalizado
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Define cuánto quieres ahorrar en total y en cuántas semanas quieres lograrlo
                  </p>
                  <div className="space-y-2 mb-6">
                    <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                      <Calendar className="w-3 h-3 mr-1" />
                      Ahorro semanal
                    </Badge>
                    <div className="text-sm text-orange-600 dark:text-orange-400">
                      ✓ Tú eliges el monto total<br/>
                      ✓ Tú eliges las semanas<br/>
                      ✓ Calculamos el monto semanal
                    </div>
                  </div>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Crear Reto Semanal
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Reto Diario */}
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all border-2 border-green-200 hover:border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700 dark:hover:border-green-500"
                onClick={() => setChallengeType('daily')}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">
                    Reto Diario Personalizado
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Define cuánto quieres ahorrar en total y en cuántos días quieres lograrlo
                  </p>
                  <div className="space-y-2 mb-6">
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      <Target className="w-3 h-3 mr-1" />
                      Ahorro diario
                    </Badge>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      ✓ Tú eliges el monto total<br/>
                      ✓ Tú eliges los días<br/>
                      ✓ Calculamos el monto diario
                    </div>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                    <Target className="w-4 h-4 mr-2" />
                    Crear Reto Diario
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              challengeType === 'weekly' ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-green-100 dark:bg-green-900/30'
            }`}>
              {challengeType === 'weekly' ? 
                <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" /> : 
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              }
            </div>
            <div>
              <CardTitle className="text-lg text-card-foreground">
                {challengeType === 'weekly' ? 'Reto Semanal Personalizado' : 'Reto Diario Personalizado'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Define tu meta y duración personalizadas
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Custom Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-card-foreground">Nombre del Reto (Opcional)</Label>
            <Input
              id="title"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder={challengeType === 'weekly' ? 'Mi Reto Semanal Personalizado' : 'Mi Reto Diario Personalizado'}
              className="bg-input-background border-border text-card-foreground"
            />
          </div>

          {/* Total Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-card-foreground">¿Cuánto quieres ahorrar en total?</Label>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
                className="flex-1 bg-input-background border-border text-card-foreground"
              />
              <span className="text-muted-foreground">ARS</span>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-card-foreground">
              {challengeType === 'weekly' ? '¿En cuántas semanas?' : '¿En cuántos días?'}
            </Label>
            <div className="flex items-center space-x-4">
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="flex-1 bg-input-background border-border text-card-foreground"
                min="1"
                max={challengeType === 'weekly' ? 104 : 365}
              />
              <span className="text-muted-foreground">
                {challengeType === 'weekly' ? 'semanas' : 'días'}
              </span>
            </div>
          </div>

          {/* Calculation Preview */}
          <Card className={`${challengeType === 'weekly' ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700' : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'}`}>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 flex items-center text-card-foreground">
                <Calculator className={`w-5 h-5 mr-2 ${challengeType === 'weekly' ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`} />
                Resumen de tu Reto
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Meta Total</div>
                  <div className="font-semibold text-lg text-card-foreground">${totalAmount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Duración</div>
                  <div className="font-semibold text-lg text-card-foreground">
                    {duration} {challengeType === 'weekly' ? 'semanas' : 'días'}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-muted-foreground">
                    {challengeType === 'weekly' ? 'Ahorro por semana' : 'Ahorro por día'}
                  </div>
                  <div className={`font-bold text-2xl ${challengeType === 'weekly' ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                    ${challengeType === 'weekly' ? calculateWeeklyAmount().toLocaleString() : calculateDailyAmount().toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Motivational Message */}
          <div className={`p-4 rounded-lg ${challengeType === 'weekly' ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'}`}>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">
                {challengeType === 'weekly' 
                  ? `¡Perfecto! Solo necesitas ahorrar $${calculateWeeklyAmount().toLocaleString()} cada semana y alcanzarás tu meta en ${duration} semanas.`
                  : `¡Perfecto! Solo necesitas ahorrar $${calculateDailyAmount().toLocaleString()} cada día y alcanzarás tu meta en ${duration} días.`
                }
              </span>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setChallengeType(null)} className="border-border">
              Cambiar Tipo
            </Button>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose} className="border-border">
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateChallenge}
                className={challengeType === 'weekly' ? 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'}
                disabled={totalAmount <= 0 || duration <= 0}
              >
                <Trophy className="w-4 h-4 mr-2" />
                Inicializar Reto
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}