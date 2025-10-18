import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  X, 
  Brain, 
  User, 
  Plus, 
  Minus, 
  Save, 
  Sparkles, 
  Calculator,
  TrendingUp,
  Zap,
  ArrowRight
} from 'lucide-react';

interface BudgetOrganizerProps {
  onClose: () => void;
}

interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
}

export function BudgetOrganizer({ onClose }: BudgetOrganizerProps) {
  const [budgetType, setBudgetType] = useState<'recommended' | 'custom' | null>(null);
  const [monthlyIncome, setMonthlyIncome] = useState(175000);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);


  // Función para calcular el presupuesto recomendado basado en los ingresos
  const calculateRecommendedBudget = (income: number): BudgetCategory[] => [
    { id: '1', name: 'Vivienda', amount: Math.round(income * 0.30), percentage: 30, color: 'bg-blue-500', icon: '🏠' },
    { id: '2', name: 'Alimentación', amount: Math.round(income * 0.20), percentage: 20, color: 'bg-green-500', icon: '🍽️' },
    { id: '3', name: 'Transporte', amount: Math.round(income * 0.10), percentage: 10, color: 'bg-yellow-500', icon: '🚗' },
    { id: '4', name: 'Ahorros', amount: Math.round(income * 0.20), percentage: 20, color: 'bg-purple-500', icon: '💰' },
    { id: '5', name: 'Entretenimiento', amount: Math.round(income * 0.08), percentage: 8, color: 'bg-pink-500', icon: '🎯' },
    { id: '6', name: 'Servicios', amount: Math.round(income * 0.06), percentage: 6, color: 'bg-indigo-500', icon: '⚡' },
    { id: '7', name: 'Emergencias', amount: Math.round(income * 0.06), percentage: 6, color: 'bg-red-500', icon: '🆘' }
  ];

  const handleSelectBudgetType = (type: 'recommended' | 'custom') => {
    setBudgetType(type);
    if (type === 'recommended') {
      setCategories(calculateRecommendedBudget(monthlyIncome));
    } else {
      // Inicializar con categorías básicas para customizar
      setCategories([
        { id: '1', name: 'Vivienda', amount: 0, percentage: 0, color: 'bg-blue-500', icon: '🏠' },
        { id: '2', name: 'Alimentación', amount: 0, percentage: 0, color: 'bg-green-500', icon: '🍽️' },
        { id: '3', name: 'Transporte', amount: 0, percentage: 0, color: 'bg-yellow-500', icon: '🚗' },
        { id: '4', name: 'Ahorros', amount: 0, percentage: 0, color: 'bg-purple-500', icon: '💰' }
      ]);
    }
  };

  // Función para actualizar los ingresos y recalcular el presupuesto recomendado
  const handleIncomeChange = (newIncome: number) => {
    setMonthlyIncome(newIncome);
    if (budgetType === 'recommended') {
      setCategories(calculateRecommendedBudget(newIncome));
    }
  };

  const updateCategoryAmount = (id: string, amount: number) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id 
        ? { ...cat, amount, percentage: Math.round((amount / monthlyIncome) * 100) }
        : cat
    ));
  };

  const addCategory = () => {
    const newCategory: BudgetCategory = {
      id: Date.now().toString(),
      name: 'Nueva Categoría',
      amount: 0,
      percentage: 0,
      color: 'bg-gray-500',
      icon: '📝'
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const removeCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const totalBudget = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const remaining = monthlyIncome - totalBudget;

  if (!budgetType) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-4xl">
          <CardHeader className="text-center">
            <div className="flex justify-between items-center">
              <div></div>
              <div className="text-center flex-1">
                <CardTitle className="text-2xl mb-2">Organizar Mi Presupuesto</CardTitle>
                <p className="text-gray-600">Elige cómo quieres crear tu presupuesto personalizado</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Opción Recomendada */}
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all border-2 border-purple-200 hover:border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-50"
                onClick={() => handleSelectBudgetType('recommended')}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calculator className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Presupuesto Optimizado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Ingresa tus ingresos y obtén un presupuesto balanceado automáticamente según mejores prácticas financieras
                  </p>
                  <div className="space-y-2 mb-6">
                    <Badge className="bg-purple-100 text-purple-700">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Optimizado automáticamente
                    </Badge>
                    <div className="text-sm text-purple-600">
                      ✓ Ingresa tus ingresos y se ajusta automáticamente<br/>
                      ✓ Basado en mejores prácticas financieras<br/>
                      ✓ Incluye metas de ahorro inteligentes
                    </div>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Calculator className="w-4 h-4 mr-2" />
                    Usar Optimizado
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Opción Manual */}
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all border-2 border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50"
                onClick={() => handleSelectBudgetType('custom')}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Presupuesto Personalizado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Crea tu presupuesto manualmente con total control sobre cada categoría y monto
                  </p>
                  <div className="space-y-2 mb-6">
                    <Badge className="bg-blue-100 text-blue-700">
                      <Calculator className="w-3 h-3 mr-1" />
                      Control total
                    </Badge>
                    <div className="text-sm text-blue-600">
                      ✓ Categorías personalizables<br/>
                      ✓ Montos ajustables manualmente<br/>
                      ✓ Tu decides las prioridades
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <User className="w-4 h-4 mr-2" />
                    Crear manualmente
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Información adicional */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                  <span>Análisis en tiempo real</span>
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-yellow-600" />
                  <span>Ajustes automáticos</span>
                </div>
                <div className="flex items-center">
                  <Save className="w-4 h-4 mr-2 text-blue-600" />
                  <span>Guardado automático</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              budgetType === 'recommended' ? 'bg-purple-100' : 'bg-blue-100'
            }`}>
              {budgetType === 'recommended' ? 
                <Brain className="w-6 h-6 text-purple-600" /> : 
                <User className="w-6 h-6 text-blue-600" />
              }
            </div>
            <div>
              <CardTitle className="text-lg">
                {budgetType === 'recommended' ? 'Presupuesto Optimizado' : 'Presupuesto Personalizado'}
              </CardTitle>
              <p className="text-sm text-gray-500">
                {budgetType === 'recommended' ? 'Generado automáticamente según tu perfil' : 'Creado manualmente por ti'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto p-6">
          {/* Income Input */}
          <div className="mb-6">
            <Label htmlFor="income">Ingresos Mensuales</Label>
            <div className="flex items-center space-x-4 mt-2">
              <Input
                id="income"
                type="number"
                value={monthlyIncome}
                onChange={(e) => handleIncomeChange(Number(e.target.value))}
                className="max-w-xs"
                placeholder="Ingresa tus ingresos mensuales"
              />
              <span className="text-gray-600">ARS</span>
              {budgetType === 'recommended' && (
                <Badge className="bg-purple-100 text-purple-700">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Se ajusta automáticamente
                </Badge>
              )}
            </div>
            {budgetType === 'recommended' && (
              <p className="text-sm text-purple-600 mt-2">
                Las categorías se actualizan automáticamente según mejores prácticas financieras
              </p>
            )}
          </div>

          {/* Budget Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">${monthlyIncome.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Ingresos Totales</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">${totalBudget.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Presupuestado</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${remaining.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {remaining >= 0 ? 'Disponible' : 'Sobrepresupuesto'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((totalBudget / monthlyIncome) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Asignado</div>
              </CardContent>
            </Card>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Categorías de Presupuesto</h3>
              {budgetType === 'custom' && (
                <Button onClick={addCategory} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Categoría
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{category.icon}</div>
                        <div>
                          {budgetType === 'custom' ? (
                            <Input
                              value={category.name}
                              onChange={(e) => {
                                setCategories(prev => prev.map(cat => 
                                  cat.id === category.id ? { ...cat, name: e.target.value } : cat
                                ));
                              }}
                              className="font-medium text-sm p-1 h-6"
                            />
                          ) : (
                            <h4 className="font-medium">{category.name}</h4>
                          )}
                          <div className="text-sm text-gray-600">{category.percentage}% del total</div>
                        </div>
                      </div>
                      {budgetType === 'custom' && (
                        <Button
                          onClick={() => removeCategory(category.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm">$</span>
                        <Input
                          type="number"
                          value={category.amount}
                          onChange={(e) => updateCategoryAmount(category.id, Number(e.target.value))}
                          className="flex-1"
                          disabled={budgetType === 'recommended'}
                        />
                        <span className="text-sm text-gray-600">ARS</span>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                    </div>

                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          {budgetType === 'recommended' && (
            <Card className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Recomendaciones de la IA
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded border border-purple-200">
                    <div className="font-medium text-purple-900">Optimización Detectada</div>
                    <div className="text-purple-700">Tu presupuesto está optimizado para maximizar ahorros sin afectar calidad de vida.</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-purple-200">
                    <div className="font-medium text-purple-900">Crecimiento Proyectado</div>
                    <div className="text-purple-700">Con este presupuesto, podrías ahorrar $420,000 al año.</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setBudgetType(null)}>
              Cambiar Método
            </Button>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                className={budgetType === 'recommended' ? 'bg-purple-600 hover:bg-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'}
                disabled={remaining < 0}
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar Presupuesto
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}