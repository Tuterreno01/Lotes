/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Trash2, ArrowRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types';

export default function AsesorIA() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: '¡Hola! Soy tu Asesor Inteligente de LoteAR. Estoy aquí para ayudarte a elegir el lote ideal en Rosario, Funes, Roldán, Ibarlucea o el resto de la región.\n\nPodés preguntarme sobre precios de financiación, qué loteos tienen gas natural, distancias a la ciudad o comparar proyectos como Vida Lagoon y San Sebastián. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const presetQuestions = [
    '¿Qué loteos tienen gas natural y cloacas?',
    '¿Cuáles son las opciones más económicas (menos de USD 25.000)?',
    'Recomendame loteos en Funes con financiación.',
    'Compará Vida Lagoon con Don Mateo Residencial.'
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Create request payload representing the chat history
      // We send the current state including the new message
      const historyToSend = [...messages, userMessage].map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: historyToSend })
      });

      const data = await res.json();

      if (res.ok && data.text) {
        const modelMessage: ChatMessage = {
          role: 'model',
          text: data.text,
          timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, modelMessage]);
      } else {
        const errorMessage: ChatMessage = {
          role: 'model',
          text: `Disculpa, hubo un inconveniente: ${data.error || 'No se pudo generar respuesta.'}\n\nPor favor, verifica que tu GEMINI_API_KEY esté correctamente configurada en AI Studio.`,
          timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error communicating with Chat API:", error);
      const errorMessage: ChatMessage = {
        role: 'model',
        text: 'No fue posible conectar con el servidor de inteligencia artificial. Comprobá tu conexión a internet o reintentá en unos momentos.',
        timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'model',
        text: 'Chat reiniciado. ¿Qué dudas tenés sobre los loteos disponibles en la región?',
        timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[580px]" id="asesor-ia-container">
      {/* Header */}
      <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl flex items-center justify-center animate-pulse">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-sans font-bold text-sm tracking-tight">Asesor Inteligente</h3>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 font-bold">GEMINI 3.5</span>
            </div>
            <p className="text-[10px] text-slate-400">Consultas de urbanización con datos en tiempo real</p>
          </div>
        </div>

        <button
          onClick={clearChat}
          title="Borrar chat"
          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          id="btn-clear-chat"
        >
          <Trash2 className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900 scrollbar-thin scrollbar-thumb-slate-800">
        <AnimatePresence initial={false}>
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                m.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-emerald-400 border border-slate-700'
              }`}>
                {m.role === 'user' ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
              </div>

              <div className={`p-3.5 rounded-xl text-sm max-w-[80%] leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-emerald-600/90 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/50'
              }`}>
                <p className="whitespace-pre-line">{m.text}</p>
                <span className="block text-[9px] text-slate-400 text-right mt-1.5 font-mono">{m.timestamp}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
              <Bot className="w-4.5 h-4.5" />
            </div>
            <div className="bg-slate-800 border border-slate-700/50 p-3.5 rounded-xl rounded-tl-none text-slate-400 text-xs flex items-center gap-2">
              <span className="flex space-x-1">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce delay-100"></span>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce delay-200"></span>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce delay-300"></span>
              </span>
              <span>El Asesor de LoteAR está analizando el catálogo de lotes...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Suggestion chips */}
      {messages.length < 3 && (
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-slate-500" />
            Preguntas Recomendadas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => handleSend(q)}
                className="text-[11px] bg-slate-850 hover:bg-slate-800 hover:text-emerald-300 text-slate-300 border border-slate-750 rounded-lg px-2.5 py-1.5 text-left transition-all cursor-pointer truncate max-w-full disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input panel */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribí tu consulta..."
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-slate-600 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 text-sm outline-none transition-all"
            id="chat-input-text"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer"
            id="chat-btn-send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
