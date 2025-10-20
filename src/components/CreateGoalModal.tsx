import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
// Removemos Calendar y Popover por ahora
import { 
  Target, 
  Calendar as CalendarIcon, 
  Plus, 
  Sparkles,
  PiggyBank,
  Plane,
  Car,
  Home,
  GraduationCap,
  Shield,
  Laptop,
  Heart
} from 'lucide-react';
// Removido import de date-fns que no está disponible

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  isSmartGoal: boolean;
  icon: string;
  color: string;
}

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGoal: (goal: Goal) => void;
}

export function CreateGoalModal({ isOpen, onClose, onCreateGoal }: CreateGoalModalProps) {
  const [step, setStep] = useState<'type' | 'form' | 'smart'>('type');
  const [isSmartGoal, setIsSmartGoal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState<Date>();
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const goalCategories = [
    { id: 'travel', name: 'Viajes', icon: Plane, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'car', name: 'Vehículo', icon: Car, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 'house', name: 'Vivienda', icon: Home, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 'education', name: 'Educación', icon: GraduationCap, color: 'text-orange-600', bg: 'bg-orange-100' },
    { id: 'emergency', name: 'Emergencia', icon: Shield, color: 'text-red-600', bg: 'bg-red-100' },
    { id: 'technology', name: 'Tecnología', icon: Laptop, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 'health', name: 'Salud', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-100' },
    { id: 'other', name: 'Otro', icon: PiggyBank, color: 'text-gray-600', bg: 'bg-gray-100' }
  ];

  const smartGoalSuggestions = [
    {
      title: "Viaje a Europa",
      description: "Basado en tus ingresos y gastos, esta meta es ideal para alcanzar en 8 meses",
      targetAmount: 500000,
      timeline: "8 meses",
      monthlySaving: 62500,
      category: "travel",
      priority: "medium" as const,
      confidence: 85
    },
    {
      title: "Fondo de Emergencia",
      description: "Recomendado para tu estabilidad financiera. Equivale a 6 meses de gastos",
      targetAmount: 300000,
      timeline: "6 meses",
      monthlySaving: 50000,
      category: "emergency",
      priority: "high" as const,
      confidence: 95
    },
    {
      title: "Nueva Laptop",
      description: "Meta a corto plazo perfecta para tu perfil de ahorro actual",
      targetAmount: 150000,
      timeline: "3 meses",
      monthlySaving: 50000,
      category: "technology",
      priority: "low" as const,
      confidence: 90
    }
  ];

  const handleCreateGoal = (goalData?: any) => {
    const goal: Goal = {
      id: Date.now().toString(),
      title: goalData?.title || title,
      description: goalData?.description || description,
      target: goalData?.targetAmount || parseFloat(targetAmount || '0'),
      current: 0,
      deadline: goalData?.deadline || deadline?.toISOString() || '',
      category: goalData?.category || category,
      priority: goalData?.priority || priority,
      isSmartGoal: !!goalData,
      icon: '🎯',
      color: 'bg-purple-500'
    };

    onCreateGoal(goal);
    handleClose();
  };

  const handleClose = () => {
    setStep('type');
    setIsSmartGoal(false);
    setTitle('');
    setDescription('');
    setTargetAmount('');
    setDeadline(undefined);
    setCategory('');
    setPriority('medium');
    onClose();
  };

  const selectedCategory = goalCategories.find(cat => cat.id === category);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {step === 'type' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span>Crear nueva meta</span>
              </DialogTitle>
              <DialogDescription>
                Elige el tipo de meta que quieres crear
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Elige el tipo de meta que quieres crear
              </p>
              
              {/* Smart Goal Option */}
              <Button
                variant="outline"
                className="w-full h-auto p-6 flex flex-col items-start space-y-3 hover:bg-purple-50 hover:border-purple-300"
                onClick={() => setStep('smart')}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">Meta Inteligente</h3>
                    <p className="text-sm text-gray-600">Sugerencias personalizadas con NEEXA</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-purple-100 text-purple-700">Recomendado</Badge>
                  <Badge variant="secondary" className="text-xs">Personalizado</Badge>
                </div>
              </Button>

              {/* Manual Goal Option */}
              <Button
                variant="outline"
                className="w-full h-auto p-6 flex flex-col items-start space-y-3 hover:bg-blue-50 hover:border-blue-300"
                onClick={() => setStep('form')}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Plus className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">Meta Manual</h3>
                    <p className="text-sm text-gray-600">Crea tu meta desde cero</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">Personalizable</Badge>
                  <Badge variant="secondary" className="text-xs">Control total</Badge>
                </div>
              </Button>
            </div>
          </>
        )}

        {step === 'smart' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>Metas Inteligentes Sugeridas</span>
              </DialogTitle>
              <DialogDescription>
                Selecciona una meta optimizada según tu perfil financiero
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Selecciona una meta optimizada según tu perfil financiero
              </p>
              
              {smartGoalSuggestions.map((suggestion, index) => {
                const categoryInfo = goalCategories.find(cat => cat.id === suggestion.category);
                const CategoryIcon = categoryInfo?.icon || PiggyBank;
                
                return (
                  <div key={index} className="border border-purple-200 rounded-lg p-4 hover:bg-purple-50 cursor-pointer"
                       onClick={() => handleCreateGoal({
                         title: suggestion.title,
                         description: suggestion.description,
                         targetAmount: suggestion.targetAmount,
                         category: suggestion.category,
                         priority: suggestion.priority,
                         deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 * parseInt(suggestion.timeline.split(' ')[0])).toISOString()
                       })}>
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${categoryInfo?.bg} rounded-lg flex items-center justify-center`}>
                        <CategoryIcon className={`w-6 h-6 ${categoryInfo?.color}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
                          <Badge className="bg-green-100 text-green-700">
                            {suggestion.confidence}% confianza
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Meta:</span>
                            <div className="font-medium">${suggestion.targetAmount.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Tiempo:</span>
                            <div className="font-medium">{suggestion.timeline}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Mensual:</span>
                            <div className="font-medium text-purple-600">${suggestion.monthlySaving.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <Button variant="outline" onClick={() => setStep('form')} className="w-full">
                Crear meta personalizada
              </Button>
            </div>
          </>
        )}

        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>Nueva meta manual</span>
              </DialogTitle>
              <DialogDescription>
                Crea tu meta personalizada desde cero
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Category Selection */}
              <div className="space-y-3">
                <Label>Categoría</Label>
                <div className="grid grid-cols-4 gap-2">
                  {goalCategories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Button
                        key={cat.id}
                        variant={category === cat.id ? 'default' : 'outline'}
                        className="h-auto p-3 flex flex-col items-center space-y-1"
                        onClick={() => setCategory(cat.id)}
                      >
                        <Icon className={`w-5 h-5 ${category === cat.id ? 'text-white' : cat.color}`} />
                        <span className="text-xs">{cat.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Título de la meta</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Vacaciones en la playa"
                  className="bg-gray-50"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe tu meta..."
                  className="bg-gray-50 resize-none"
                  rows={3}
                />
              </div>

              {/* Target Amount */}
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Monto objetivo</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="0"
                    className="bg-gray-50 pl-8"
                  />
                </div>
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <Label htmlFor="deadline">Fecha límite</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline ? deadline.toISOString().split('T')[0] : ''}
                  onChange={(e) => setDeadline(e.target.value ? new Date(e.target.value) : undefined)}
                  min={new Date().toISOString().split('T')[0]}
                  className="bg-gray-50"
                />
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label>Prioridad</Label>
                <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="low">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preview */}
              {title && targetAmount && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Vista previa</h4>
                  <div className="flex items-center space-x-3">
                    {selectedCategory && (
                      <div className={`w-10 h-10 ${selectedCategory.bg} rounded-lg flex items-center justify-center`}>
                        <selectedCategory.icon className={`w-5 h-5 ${selectedCategory.color}`} />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{title}</div>
                      <div className="text-sm text-gray-600">${parseFloat(targetAmount || '0').toLocaleString()}</div>
                      {deadline && (
                        <div className="text-xs text-gray-500">
                          Hasta {deadline.toLocaleDateString('es-AR')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep('type')} className="flex-1">
                  Atrás
                </Button>
                <Button
                  onClick={() => handleCreateGoal()}
                  disabled={!title || !targetAmount || !category || !deadline}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Meta
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}