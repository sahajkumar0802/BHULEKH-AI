import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { generateAssistantResponse, SUGGESTED_PROMPTS, ChatMessage } from '../services/aiAssistantService';
import {
  Bot,
  Send,
  Sparkles,
  User,
  ArrowRight,
  Layers
} from 'lucide-react';

export const AiAssistantView: React.FC = () => {
  const { parcels, setSelectedParcelId, setActiveTab } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `### Namaste! I am the **BHULEKH AI Revenue Copilot**.

I can assist you with natural language queries regarding **125,430 digitized land records**, cadastral GIS polygon alignments, mutation disputes, and cross-record validation results across Dumka District.

You can ask questions like:
- *"Why is Khasra 125 high risk?"*
- *"Show all critical parcels in Rampur village."*
- *"What documents are inconsistent for Khasra 125?"*
- *"What should the Circle Officer verify for Khasra 341?"*`,
      timestamp: 'Just now'
    }
  ]);

  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendMessage = (textToSend = inputQuery) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      const response = generateAssistantResponse(textToSend, parcels);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: response.text,
        referencedParcels: response.referencedParcels,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsThinking(false);
    }, 600);
  };

  const handleSelectParcel = (parcelId: string) => {
    setSelectedParcelId(parcelId);
    setActiveTab('twin');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4 h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-gov-600" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              BHULEKH AI Copilot
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-bold font-mono">
              NATURAL LANGUAGE ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ask questions about land records, cross-record discrepancies, cadastral boundaries, and revenue laws in natural language.
          </p>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: `msg-${Date.now()}`,
                sender: 'assistant',
                text: 'Chat history reset. How may I assist your land record inquiries today?',
                timestamp: 'Just now'
              }
            ]);
          }}
          className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
        >
          Clear Chat
        </button>
      </div>

      {/* Suggested Prompts Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Suggested:</span>
        </span>
        {SUGGESTED_PROMPTS.map((prompt: string, idx: number) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1 rounded-full bg-white hover:bg-gov-50 hover:text-gov-700 text-slate-700 text-xs font-medium border border-slate-200 transition-all shrink-0 shadow-sm"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${
              m.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                m.sender === 'user'
                  ? 'bg-gov-700 text-white'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs space-y-2 leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gov-600 text-white shadow-md'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] opacity-70 pb-1 border-b border-black/10">
                <span className="font-semibold">{m.sender === 'user' ? 'Revenue Officer / You' : 'BHULEKH AI Copilot'}</span>
                <span>{m.timestamp}</span>
              </div>

              <div className="prose prose-sm max-w-none text-xs space-y-2">
                {m.text.split('\n\n').map((para, pIdx) => {
                  if (para.startsWith('### ')) {
                    return <h4 key={pIdx} className="font-extrabold text-sm text-slate-900 mt-2 mb-1">{para.replace('### ', '')}</h4>;
                  }
                  if (para.startsWith('#### ')) {
                    return <h5 key={pIdx} className="font-bold text-xs text-slate-800 mt-2 mb-1">{para.replace('#### ', '')}</h5>;
                  }
                  if (para.startsWith('- ')) {
                    return (
                      <ul key={pIdx} className="list-disc list-inside space-y-1 my-1">
                        {para.split('\n').map((li, lIdx) => (
                          <li key={lIdx}>{li.replace('- ', '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={pIdx} className="leading-relaxed">{para}</p>;
                })}
              </div>

              {m.referencedParcels && m.referencedParcels.length > 0 && (
                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Referenced Parcels:</span>
                  {m.referencedParcels.map((pid) => (
                    <button
                      key={pid}
                      onClick={() => handleSelectParcel(pid)}
                      className="px-2.5 py-1 rounded-lg bg-gov-50 hover:bg-gov-600 hover:text-white text-gov-700 font-semibold text-[11px] border border-gov-200 transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <Layers className="w-3 h-3" />
                      <span>{pid}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-gov-600 to-indigo-600 text-white flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-gov-600 animate-spin" />
              <span>Analyzing cross-registry knowledge graph and cadastral polygons...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className="space-y-2 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-gov"
        >
          <input
            type="text"
            placeholder="Ask anything about Dumka land records, discrepancies, or mutation rules..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 px-3 py-2 bg-transparent border-none text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isThinking}
            className="px-4 py-2 rounded-xl bg-gov-600 hover:bg-gov-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-40"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-400">
          * AI-generated assistance based on available revenue records. Final decisions remain with authorized Circle Officers.
        </div>
      </div>
    </div>
  );
};
