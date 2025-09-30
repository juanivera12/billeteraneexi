import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { X, Bot, Send, Lightbulb, PiggyBank, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AIAssistantProps {
  onClose: () => void;
}

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export function AIAssistant({ onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: '¡Hola! Soy tu asistente de ahorros de Neexa 🤖 ¿En qué puedo ayudarte hoy? Puedo ayudarte con metas de ahorro, presupuestos, retos financieros y análisis de gastos.',
      timestamp: new Date(),
      suggestions: [
        'Crear una nueva meta de ahorro',
        'Analizar mis gastos del mes',
        'Sugerir un reto de ahorro',
        'Optimizar mi presupuesto'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const aiMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('meta') || input.includes('objetivo') || input.includes('ahorrar')) {
      return {
        content: '¡Excelente! Crear metas de ahorro es fundamental. Basándome en tus ingresos y gastos actuales, te recomiendo comenzar con una meta pequeña y alcanzable. ¿Qué te parece ahorrar $20,000 para un "Fondo de Emergencia Pequeño" en 2 meses? Esto representa solo el 8% de tus ingresos mensuales.',
        suggestions: [
          'Crear meta de $20,000 en 2 meses',
          'Ver otras metas recomendadas',
          'Calcular cuánto puedo ahorrar',
          'Configurar ahorro automático'
        ]
      };
    }
    
    if (input.includes('gasto') || input.includes('análisis') || input.includes('dinero')) {
      return {
        content: 'He analizado tus últimos 30 días de gastos 📊. Detecté que gastas más los viernes ($8,500 promedio) principalmente en entretenimiento. Tu categoría con mayor potencial de ahorro es "Comida fuera de casa" - podrías ahorrar $12,000/mes cocinando 2 días extra en casa.',
        suggestions: [
          'Ver desglose detallado de gastos',
          'Crear presupuesto optimizado',
          'Configurar alertas de gasto',
          'Tips para reducir gastos'
        ]
      };
    }

    if (input.includes('reto') || input.includes('desafío') || input.includes('juego')) {
      return {
        content: '🎮 ¡Los retos son geniales para mantener la motivación! Te recomiendo el "Desafío 52 Semanas" personalizado. Comenzarías ahorrando $1,000 la primera semana, $1,200 la segunda, y así sucesivamente. Al final del año habrías ahorrado $68,600 y ganado recompensas como cashback extra.',
        suggestions: [
          'Unirme al Desafío 52 Semanas',
          'Ver otros retos disponibles',
          'Crear reto personalizado',
          'Invitar amigos a competir'
        ]
      };
    }

    if (input.includes('presupuesto') || input.includes('optimizar') || input.includes('planear')) {
      return {
        content: '🧠 He creado un presupuesto optimizado para ti. Sugiero: 60% necesidades ($105,000), 20% ahorros ($35,000), 20% gustos ($35,000). Con pequeños ajustes podrías aumentar tu ahorro a 25% sin afectar tu calidad de vida. ¿Te ayudo a implementarlo?',
        suggestions: [
          'Aplicar presupuesto sugerido',
          'Personalizar categorías',
          'Ver comparación con mes anterior',
          'Activar recordatorios automáticos'
        ]
      };
    }

    return {
      content: 'Entiendo tu consulta. Como tu asistente de ahorros, puedo ayudarte con múltiples aspectos de tus finanzas. Mi IA analiza constantemente tus patrones de gasto para ofrecerte recomendaciones personalizadas. ¿Hay algo específico sobre ahorros o presupuesto en lo que te gustaría profundizar?',
      suggestions: [
        'Mostrar resumen financiero',
        'Consejos de ahorro personalizados',
        'Establecer recordatorios',
        'Ver progreso de metas'
      ]
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Asistente de Ahorros Neexa</CardTitle>
              <p className="text-sm text-gray-500">Con tecnología de IA avanzada</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {messages.length > 0 && messages[messages.length - 1].type === 'ai' && messages[messages.length - 1].suggestions && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium">Sugerencias rápidas:</p>
                  <div className="flex flex-wrap gap-2">
                    {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="border-t p-3">
            <div className="flex space-x-2 mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick('¿Cuánto puedo ahorrar este mes?')}
                className="flex items-center space-x-1"
              >
                <PiggyBank className="w-3 h-3" />
                <span className="text-xs">Calcular ahorro</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick('Optimizar mi presupuesto')}
                className="flex items-center space-x-1"
              >
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs">Optimizar</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick('Consejos personalizados')}
                className="flex items-center space-x-1"
              >
                <Lightbulb className="w-3 h-3" />
                <span className="text-xs">Tips IA</span>
              </Button>
            </div>

            {/* Input Area */}
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Pregúntame sobre ahorros, metas, presupuestos..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}