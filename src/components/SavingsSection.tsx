import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { BudgetOrganizer } from './BudgetOrganizer';
import { ChallengeCustomizer } from './ChallengeCustomizer';
import { CreateGoalModal } from './CreateGoalModal';
import { ContributeModal } from './ContributeModal';
import { 
  Target, 
  Trophy, 
  PiggyBank, 
  TrendingUp, 
  Calendar,
  Plus,
  Zap,
  Star,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Settings,
  Calculator
} from 'lucide-react';

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

export function SavingsSection() {
  const [activeTab, setActiveTab] = useState<'goals' | 'challenges' | 'budget' | 'insights'>('goals');
  const [showBudgetOrganizer, setShowBudgetOrganizer] = useState(false);
  const [showChallengeCustomizer, setShowChallengeCustomizer] = useState(false);
  const [showCreateGoalModal, setShowCreateGoalModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [customChallenges, setCustomChallenges] = useState<CustomChallenge[]>([]);
  const [goals, setGoals] = useState<any[]>([
    {
      id: "1",
      title: "Viaje a Europa",
      target: 500000,
      current: 245000,
      deadline: "Dic 2024",
      color: "bg-blue-500",
      icon: "✈️",
      category: "travel"
    },
    {
      id: "2",
      title: "Fondo de Emergencia",
      target: 300000,
      current: 180000,
      deadline: "Jun 2024",
      color: "bg-green-500",
      icon: "🛡️",
      category: "emergency"
    },
    {
      id: "3",
      title: "Nueva Laptop",
      target: 150000,
      current: 95000,
      deadline: "Mar 2024",
      color: "bg-purple-500",
      icon: "💻",
      category: "technology"
    }
  ]);

  const challenges = [
    {
      id: 1,
      title: "Reto 52 Semanas",
      description: "Este reto te propondrá ahorrar un peso más cada semana. Empezará con ejemplo $100 la primera semana, y así sucesivamente hasta la semana 52 donde ahorrarás $5200.",
      progress: 68,
      reward: "$137,800 al completar el reto",
      isActive: true
    },
    {
      id: 2,
      title: "Reto de Ahorro Diario",
      description: "Este reto consiste en ahorrar un peso cada día durante 90 días. $1 cada día = $4095 al final. Cada día se aumenta $5 hasta que el día 90 se ahorren $450.",
      progress: 45,
      reward: "$20,475 al completar el reto",
      isActive: true
    }
  ];

  const handleCreateCustomChallenge = (challenge: CustomChallenge) => {
    setCustomChallenges(prev => [...prev, challenge]);
  };

  const handleCreateGoal = (goal: any) => {
    setGoals(prev => [...prev, goal]);
  };

  const handleContribute = (goalId: string, amount: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, current: (goal.current || 0) + amount }
        : goal
    ));
  };

  const handleContributeClick = (goal: any) => {
    setSelectedGoal(goal);
    setShowContributeModal(true);
  };

  const allChallenges = [...challenges, ...customChallenges];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-lg border border-gray-200 dark:border-gray-600">
        <h1 className="text-4xl font-semibold text-gray-900 dark:text-white mb-2">Centro de Ahorros Neexa</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Tu herramienta completa para alcanzar todas tus metas financieras</p>
        <div className="flex justify-center items-center space-x-2 text-purple-600 dark:text-blue-600">
          <PiggyBank className="w-5 h-5" />
          <span className="font-medium">Gestiona tus ahorros de manera inteligente</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
        <Button
          variant={activeTab === 'goals' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('goals')}
          className="flex items-center space-x-2 px-6 py-3"
        >
          <Target className="w-4 h-4" />
          <span>Metas de Ahorro</span>
        </Button>
        <Button
          variant={activeTab === 'challenges' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('challenges')}
          className="flex items-center space-x-2 px-6 py-3"
        >
          <Trophy className="w-4 h-4" />
          <span>Retos Gamificados</span>
        </Button>
        <Button
          variant={activeTab === 'budget' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('budget')}
          className="flex items-center space-x-2 px-6 py-3"
        >
          <Calculator className="w-4 h-4" />
          <span>Presupuesto</span>
        </Button>
        <Button
          variant={activeTab === 'insights' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('insights')}
          className="flex items-center space-x-2 px-6 py-3"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Análisis Inteligente</span>
        </Button>
      </div>

      {/* Content */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          {/* AI Savings Overview */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                  Resumen Inteligente de Ahorros
                </h3>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">NEEXA Activa</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">3</div>
                  <div className="text-sm text-muted-foreground">Metas Activas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">$520.000</div>
                  <div className="text-sm text-muted-foreground">Total Ahorrado</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">+18%</div>
                  <div className="text-sm text-muted-foreground">Optimización NEEXA</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">7 días</div>
                  <div className="text-sm text-muted-foreground">Próxima meta</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{goal.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        <div className="text-sm text-muted-foreground">{goal.deadline}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Meta
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>${(goal.current || 0).toLocaleString()}</span>
                      <span>${(goal.target || 0).toLocaleString()}</span>
                    </div>
                    <Progress value={goal.target ? ((goal.current || 0) / goal.target) * 100 : 0} className="h-3" />
                    
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">
                        {goal.target ? Math.round(((goal.current || 0) / goal.target) * 100) : 0}% completado
                      </Badge>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleContributeClick(goal)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Aportar
                        </Button>
                        <Button size="sm" variant="ghost" className="text-purple-600">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Goal Creation */}
          <Card
            className="border-2 border-dashed border-purple-300 hover:border-purple-400 transition-colors cursor-pointer bg-gradient-to-br from-purple-50 to-indigo-50"
            onClick={() => setShowCreateGoalModal(true)}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600 mr-2" />
                Crear Meta Inteligente
              </h3>
              <p className="text-muted-foreground mb-4">Crea metas personalizadas con sugerencias inteligentes</p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Crear Meta
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="space-y-6">
          {/* Challenges Header */}
          <Card className="bg-gradient-to-r from-orange-50 via-yellow-50 to-amber-50 dark:from-orange-900/20 dark:via-yellow-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-700">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center items-center space-x-4 mb-4">
                <Trophy className="w-12 h-12 text-orange-500 dark:text-orange-400" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                Retos de Ahorro
              </h3>
              <p className="text-muted-foreground mb-4">
                Desafía tus hábitos financieros y alcanza tus metas de ahorro
              </p>
            </CardContent>
          </Card>

          {/* Challenges List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allChallenges.map((challenge) => (
              <Card key={challenge.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Challenge Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        <h3 className="font-semibold text-foreground">{challenge.title}</h3>
                      </div>
                      {!challenge.isActive && (
                        <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                          Personalizado
                        </Badge>
                      )}
                    </div>
                    
                    {/* Description */}
                    <p className="text-muted-foreground text-sm">{challenge.description}</p>
                    
                    {/* Custom Challenge Details */}
                    {'durationType' in challenge && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground dark:text-gray-300">Meta: </span>
                            <span className="font-medium text-gray-900 dark:text-white">${challenge.totalAmount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground dark:text-gray-300">Duración: </span>
                            <span className="font-medium text-gray-900 dark:text-white">{challenge.duration} {challenge.durationType === 'weeks' ? 'semanas' : 'días'}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground dark:text-gray-300">
                              {challenge.durationType === 'weeks' ? 'Por semana: ' : 'Por día: '}
                            </span>
                            <span className="font-medium text-blue-700 dark:text-blue-300">
                              ${challenge.durationType === 'weeks' ? challenge.weeklyAmount?.toLocaleString() : challenge.dailyAmount?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} className="h-3" />
                    </div>
                    
                    {/* Reward */}
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="text-sm text-muted-foreground dark:text-gray-300 mb-1">Recompensa</div>
                      <div className="font-medium text-green-700 dark:text-green-300">
                        {challenge.reward || `${challenge.totalAmount?.toLocaleString() || 0} al completar el reto`}
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <Button className="w-full" size="lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Aportar al Reto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Custom Challenge */}
          <Card className="border-2 border-dashed border-yellow-300 dark:border-yellow-600 hover:border-yellow-400 dark:hover:border-yellow-500 transition-colors cursor-pointer bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                Crear Mi Propio Reto
              </h3>
              <p className="text-muted-foreground mb-4">Personaliza tu reto de ahorro con tu meta y duración ideales</p>
              <Button 
                className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600"
                onClick={() => setShowChallengeCustomizer(true)}
              >
                <Trophy className="w-4 h-4 mr-2" />
                Personalizar Reto
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'budget' && (
        <div className="space-y-6">
          {/* Budget Management Card */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-200 dark:to-slate-300 border-indigo-200 dark:border-slate-400">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-200 rounded-full flex items-center justify-center">
                    <Calculator className="w-8 h-8 text-indigo-600 dark:text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Gestión de Presupuesto</h3>
                    <p className="text-gray-600 dark:text-gray-300">Organiza y optimiza tu presupuesto de manera inteligente</p>
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <Button 
                    onClick={() => setShowBudgetOrganizer(true)}
                    className="bg-purple-600 hover:bg-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                    size="lg"
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Organizar Presupuesto
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="text-2xl font-bold text-card-foreground">$45,000</div>
                  <div className="text-sm text-muted-foreground">Ahorro Sugerido</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +18% optimizado
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="text-2xl font-bold text-card-foreground">$128,000</div>
                  <div className="text-sm text-muted-foreground">Gastos Controlados</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Dentro del presupuesto
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="text-2xl font-bold text-card-foreground">94%</div>
                  <div className="text-sm text-muted-foreground">Precisión</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 mt-1 flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Excelente
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="text-2xl font-bold text-card-foreground">12</div>
                  <div className="text-sm text-muted-foreground">Ajustes este mes</div>
                  <div className="text-xs text-orange-600 dark:text-orange-400 mt-1 flex items-center">
                    <Settings className="w-3 h-3 mr-1" />
                    Aplicados
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Budget Management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2 text-purple-600" />
                  Categorías Inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Alimentación', budget: 60000, spent: 45000, color: 'bg-red-500', aiOptimization: '+$3,200 ahorrados' },
                  { name: 'Transporte', budget: 25000, spent: 18000, color: 'bg-blue-500', aiOptimization: 'Ruta optimizada' },
                  { name: 'Entretenimiento', budget: 20000, spent: 22000, color: 'bg-yellow-500', aiOptimization: 'Alerta activada' },
                  { name: 'Servicios', budget: 30000, spent: 28000, color: 'bg-green-500', aiOptimization: 'Plan sugerido' }
                ].map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{category.name}</span>
                        <Settings className="w-3 h-3 text-purple-600" />
                      </div>
                      <span className={category.spent > category.budget ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}>
                        ${category.spent.toLocaleString()} / ${category.budget.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={(category.spent / category.budget) * 100} 
                      className="h-3"
                    />
                    <div className="text-xs text-purple-600 dark:text-purple-400 flex items-center">
                      <Sparkles className="w-3 h-3 mr-1" />
                      NEEXA: {category.aiOptimization}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                  Recomendaciones Inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-100 flex items-center">
                        ¡Excelente decisión! 
                        <CheckCircle className="w-4 h-4 ml-2 text-green-600 dark:text-green-400" />
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        NEEXA detectó que ahorraste $5,200 este mes usando rutas optimizadas y cupones automáticos.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900 dark:text-yellow-100 flex items-center">
                        Oportunidad Detectada
                        <Sparkles className="w-4 h-4 ml-2 text-yellow-600 dark:text-yellow-400" />
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        NEEXA sugiere cambiar tu suscripción de streaming. Ahorro potencial: $890/mes
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Aplicar sugerencia NEEXA
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 flex items-center">
                        Proyección
                        <TrendingUp className="w-4 h-4 ml-2 text-blue-600 dark:text-blue-400" />
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Con los ajustes actuales, podrás ahorrar $18,500 extra este mes. NEEXA continúa optimizando.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          {/* Analysis Hero */}
          <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center items-center space-x-4 mb-4">
                <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-cyan-600" />
                </div>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calculator className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Análisis Financiero Inteligente
              </h3>
              <p className="text-gray-600 mb-4">
                Revisa tus patrones de ahorro y obtén insights sobre tu progreso financiero
              </p>
              <Button 
                className="bg-cyan-600 hover:bg-cyan-700"
                onClick={() => {
                  // Simular análisis y actualizar métricas
                  const totalSaved = goals.reduce((sum, goal) => sum + (goal.current || 0), 0);
                  const hasImproved = totalSaved > 500000; // Si ha ahorrado más de 500k
                  
                  // Aquí se pueden aplicar los cambios según el análisis
                  console.log('Análisis realizado:', { totalSaved, hasImproved });
                }}
              >
                <Calculator className="w-4 h-4 mr-2" />
                Realizar Análisis
              </Button>
            </CardContent>
          </Card>

          {/* Enhanced Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="text-center border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-600 mb-2 flex items-center justify-center">
                  +23%
                  <TrendingUp className="w-5 h-5 ml-2" />
                </div>
                <div className="text-sm text-gray-600">Ahorro vs mes anterior</div>
                <div className="text-xs text-green-600 mt-1">Optimizado</div>
              </CardContent>
            </Card>
            <Card className="text-center border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-blue-600 mb-2 flex items-center justify-center">
                  4.8★
                  <Star className="w-5 h-5 ml-2" />
                </div>
                <div className="text-sm text-gray-600">Score financiero</div>
                <div className="text-xs text-blue-600 mt-1">Mejorando</div>
              </CardContent>
            </Card>
            <Card className="text-center border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-purple-600 mb-2 flex items-center justify-center">
                  3
                  <Calendar className="w-5 h-5 ml-2" />
                </div>
                <div className="text-sm text-gray-600">Días hasta próxima meta</div>
                <div className="text-xs text-purple-600 mt-1">Estimación</div>
              </CardContent>
            </Card>
            <Card className="text-center border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-orange-600 mb-2 flex items-center justify-center">
                  97%
                  <Star className="w-5 h-5 ml-2" />
                </div>
                <div className="text-sm text-gray-600">Precisión análisis</div>
                <div className="text-xs text-orange-600 mt-1">Actualizado</div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                  Patrones de Gastos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                    <h4 className="font-medium mb-2 flex items-center text-gray-900 dark:text-white">
                      Horarios de Mayor Gasto
                      <Calendar className="w-4 h-4 ml-2 text-purple-600 dark:text-purple-400" />
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Viernes 18:00-20:00 (Entretenimiento - $8,200 promedio)<br/>
                      Lunes 08:00-09:00 (Transporte - $450 promedio)
                    </p>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Settings className="w-3 h-3 mr-1" />
                      Configurar alertas
                    </Button>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <h4 className="font-medium mb-2 flex items-center text-gray-900 dark:text-white">
                      Ubicaciones Analizadas
                      <TrendingUp className="w-4 h-4 ml-2 text-blue-600 dark:text-blue-400" />
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Supermercado Norte (35% gastos alimentación)<br/>
                      Centro Comercial (60% entretenimiento)
                    </p>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Settings className="w-3 h-3 mr-1" />
                      Ver detalles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2 text-indigo-600" />
                  Proyecciones y Sugerencias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <h4 className="font-medium text-green-900 dark:text-green-100 mb-2 flex items-center">
                      Meta en Progreso
                      <CheckCircle className="w-4 h-4 ml-2 text-green-600 dark:text-green-400" />
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                      Tu meta "Nueva Laptop" está muy cerca de completarse. Solo faltan $55,000 para alcanzar tu objetivo.
                    </p>
                    <div className="text-xs text-green-600 dark:text-green-400">Estado: En camino | Progreso: 63%</div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h4 className="font-medium text-amber-900 mb-2 flex items-center">
                      Oportunidad Detectada
                      <Zap className="w-4 h-4 ml-2 text-amber-600" />
                    </h4>
                    <p className="text-sm text-amber-700 mb-2">
                      Optimizando tus gastos menores podrías ahorrar $6,800 extra este mes para tus metas.
                    </p>
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                      <Settings className="w-3 h-3 mr-1" />
                      Ver detalles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Dashboard */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Settings className="w-6 h-6 mr-2 text-indigo-600" />
                Resumen de Actividad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Estado Actual</h4>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">3 metas activas</p>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">✓ $520,000 total ahorrado</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Progreso</h4>
                    <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Rendimiento mensual</p>
                  <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">+23% vs mes anterior</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Próximos Pasos</h4>
                    <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Oportunidades disponibles</p>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">2 sugerencias pendientes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Budget Organizer Modal */}
      {showBudgetOrganizer && (
        <BudgetOrganizer onClose={() => setShowBudgetOrganizer(false)} />
      )}

      {/* Challenge Customizer Modal */}
      {showChallengeCustomizer && (
        <ChallengeCustomizer 
          onClose={() => setShowChallengeCustomizer(false)}
          onCreateChallenge={handleCreateCustomChallenge}
        />
      )}

      {/* Create Goal Modal */}
      <CreateGoalModal
        isOpen={showCreateGoalModal}
        onClose={() => setShowCreateGoalModal(false)}
        onCreateGoal={handleCreateGoal}
      />

      {/* Contribute Modal */}
      <ContributeModal
        isOpen={showContributeModal}
        onClose={() => setShowContributeModal(false)}
        goal={selectedGoal}
        onContribute={handleContribute}
      />
    </div>
  );
}