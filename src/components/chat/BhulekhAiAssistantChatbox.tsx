import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  sendChatMessageToAssistant,
  ChatMessage,
  ChatActionLink,
  CITIZEN_SUGGESTED_PROMPTS,
  checkAssistantBackendStatus,
  AssistantStatusInfo
} from '../../services/aiAssistantService';
import {
  Bot,
  Send,
  Sparkles,
  X,
  Minus,
  RotateCcw,
  User,
  ArrowRight,
  ShieldCheck,
  Maximize2,
  Minimize2
} from 'lucide-react';

export const BhulekhAiAssistantChatbox: React.FC = () => {
  const { 
    parcels, 
    setActiveTab, 
    setSelectedParcelId, 
    govLanguage, 
    t, 
    isRtl
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [backendStatus, setBackendStatus] = useState<AssistantStatusInfo>({
    status: 'online',
    isAiConfigured: false,
    provider: 'Local Revenue Rule Engine'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check backend status on mount
  useEffect(() => {
    checkAssistantBackendStatus().then(status => {
      setBackendStatus(status);
    });
  }, []);

  // Initial welcome message
  const initialWelcomeText = t('assistantWelcome');

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome-1',
      sender: 'assistant',
      text: initialWelcomeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: t('navUploadDoc'), tab: 'upload-document' },
        { label: t('navTrackProgress'), tab: 'track-progress' },
        { label: t('navCheckDoc'), tab: 'check-document' }
      ]
    }
  ]);

  // Update welcome message if language changes and only initial message is present
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'msg-welcome-1') {
        return [
          {
            id: 'msg-welcome-1',
            sender: 'assistant',
            text: t('assistantWelcome'),
            timestamp: prev[0].timestamp,
            suggestedActions: [
              { label: t('navUploadDoc'), tab: 'upload-document' },
              { label: t('navTrackProgress'), tab: 'track-progress' },
              { label: t('navCheckDoc'), tab: 'check-document' }
            ]
          }
        ];
      }
      return prev;
    });
  }, [govLanguage, t]);

  // Auto-scroll to bottom on message or typing change
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (queryText = inputQuery) => {
    const textToSend = queryText.trim();
    if (!textToSend || isThinking) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const response = await sendChatMessageToAssistant({
        query: textToSend,
        language: govLanguage,
        parcels
      });

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        sender: 'assistant',
        text: response.text,
        suggestedActions: response.suggestedActions,
        referencedParcels: response.referencedParcels,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        sender: 'assistant',
        text: `### ⚠️ Notice\n\nUnable to process query at this moment. Please check your internet connection or use the direct dashboard features.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        suggestedActions: [
          { label: t('navUploadDoc'), tab: 'upload-document' },
          { label: t('navTrackProgress'), tab: 'track-progress' }
        ]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}-reset`,
        sender: 'assistant',
        text: t('assistantWelcome'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: t('navUploadDoc'), tab: 'upload-document' },
          { label: t('navTrackProgress'), tab: 'track-progress' },
          { label: t('navCheckDoc'), tab: 'check-document' }
        ]
      }
    ]);
  };

  const handleActionClick = (action: ChatActionLink) => {
    if (action.parcelId) {
      setSelectedParcelId(action.parcelId);
    }
    if (action.tab) {
      setActiveTab(action.tab);
    }
    // On mobile, close or minimize chat after clicking action
    if (window.innerWidth < 768) {
      setIsMinimized(true);
    }
  };

  const suggestedQuestions = CITIZEN_SUGGESTED_PROMPTS[govLanguage] || CITIZEN_SUGGESTED_PROMPTS.en;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. FLOATING CHAT TRIGGER BUTTON (BOTTOM-RIGHT CORNER)                     */}
      {/* ========================================================================= */}
      {!isOpen && (
        <button
          type="button"
          id="bhulekh-ai-chatbox-trigger"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-40 px-4 py-3 bg-[#003D7C] hover:bg-[#002856] text-white rounded-full shadow-2xl border-2 border-[#FF9933] flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-[#FF9933]/50 select-none`}
          title="Open Bhulekh AI Assistant"
          aria-label="Open Bhulekh AI Assistant"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#FF9933] text-slate-900 flex items-center justify-center font-black shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            {/* Live pulsating green beacon */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
            </span>
          </div>

          <div className="text-left leading-tight hidden sm:block">
            <div className="text-xs font-black text-white flex items-center gap-1">
              <span>{t('assistantTitle')}</span>
              <Sparkles className="w-3 h-3 text-[#FF9933]" />
            </div>
            <div className="text-[10px] text-slate-200">
              {govLanguage === 'ur' ? 'اے آئی مددگار' : govLanguage === 'hi' ? 'एआई सहायक • सहायता लें' : '24/7 Citizen AI Copilot'}
            </div>
          </div>
        </button>
      )}

      {/* ========================================================================= */}
      {/* 2. CHAT PANEL (MODERN FLOATING OR MINIMIZED DOCKED CONTAINER)             */}
      {/* ========================================================================= */}
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="assistant-dialog-title"
          aria-modal="false"
          className={`fixed z-50 transition-all duration-300 select-none ${
            isMinimized
              ? `bottom-6 ${isRtl ? 'left-6' : 'right-6'} w-72 sm:w-80 shadow-2xl`
              : isExpanded
              ? `inset-4 sm:inset-10 z-50 shadow-2xl`
              : `bottom-4 sm:bottom-6 ${isRtl ? 'left-4 sm:left-6' : 'right-4 sm:right-6'} w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] shadow-2xl`
          }`}
        >
          <div className="w-full h-full bg-white rounded-2xl border-2 border-[#003D7C] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Bar (Official Indian Navy Blue with Saffron Stripe) */}
            <div className="bg-[#003D7C] text-white p-3.5 sm:p-4 border-b-2 border-[#FF9933] flex items-center justify-between gap-3 shrink-0">
              
              {/* Title & Status */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#FF9933] text-slate-900 flex items-center justify-center font-black shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 id="assistant-dialog-title" className="text-sm sm:text-base font-black text-white truncate">
                      {t('assistantTitle')}
                    </h3>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-bold shrink-0" title={backendStatus.provider}>
                      {backendStatus.isAiConfigured ? 'AI Model Active' : 'Rule Engine'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-200 truncate">
                    {t('assistantSubtitle')}
                  </div>
                </div>
              </div>

              {/* Action Buttons: New Chat, Minimize, Maximize, Close */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-200 hover:text-white transition"
                  title={t('assistantClearChat')}
                  aria-label="Start New Conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-200 hover:text-white transition"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                  aria-label="Minimize Chatbox"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden sm:block p-1.5 rounded-lg hover:bg-white/10 text-slate-200 hover:text-white transition"
                  title={isExpanded ? 'Restore' : 'Maximize'}
                  aria-label="Toggle Maximize"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-red-700 text-slate-200 hover:text-white transition"
                  title={t('assistantClose')}
                  aria-label="Close Chatbox"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* If NOT minimized, show full chat content */}
            {!isMinimized && (
              <>
                {/* Scrollable Message Thread Area */}
                <div 
                  tabIndex={0}
                  aria-label="Chat messages history"
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC] text-slate-800 text-xs focus:outline-none"
                >
                  
                  {/* Mode / Notice Pill */}
                  <div className="text-center py-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[#003D7C] text-[10px] font-bold border border-blue-200">
                      <ShieldCheck className="w-3 h-3 text-[#138808]" />
                      <span>Zero-Trust Grounded Revenue Assistant • Privacy Protected</span>
                    </span>
                  </div>

                  {/* Messages Loop */}
                  {messages.map((msg) => {
                    const isUser = msg.sender === 'user';

                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 ${isUser ? (isRtl ? 'justify-start' : 'justify-end') : (isRtl ? 'justify-end' : 'justify-start')} animate-in fade-in duration-200`}
                      >
                        {/* Assistant Avatar */}
                        {!isUser && (
                          <div className="w-7 h-7 rounded-full bg-[#003D7C] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1 shadow-2xs">
                            <Bot className="w-4 h-4 text-[#FF9933]" />
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div
                          className={`max-w-[85%] rounded-2xl p-3.5 shadow-2xs space-y-2 ${
                            isUser
                              ? 'bg-[#003D7C] text-white rounded-tr-xs'
                              : msg.isError
                              ? 'bg-[#FFF9F9] border border-[#FFCDD2] text-[#C62828] rounded-tl-xs'
                              : 'bg-white border border-[#D0D7DE] text-slate-800 rounded-tl-xs'
                          }`}
                        >
                          {/* Markdown Text Body */}
                          <div className="prose prose-xs max-w-none break-words whitespace-pre-wrap leading-relaxed">
                            {msg.text}
                          </div>

                          {/* Quick Action Navigation Chips */}
                          {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                            <div className="pt-2 border-t border-slate-100/50 flex flex-wrap gap-1.5">
                              {msg.suggestedActions.map((action, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleActionClick(action)}
                                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                                    isUser
                                      ? 'bg-white/20 text-white hover:bg-white/30'
                                      : 'bg-[#E1EDF7] hover:bg-[#C2DCF0] text-[#003D7C] border border-[#C2DCF0]'
                                  }`}
                                  title={action.description || action.label}
                                >
                                  <span>{action.label}</span>
                                  <ArrowRight className="w-3 h-3 text-[#FF9933]" />
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Timestamp */}
                          <div className={`text-[9px] ${isUser ? 'text-slate-200 text-right' : 'text-slate-400 text-right'}`}>
                            {msg.timestamp}
                          </div>
                        </div>

                        {/* User Avatar */}
                        {isUser && (
                          <div className="w-7 h-7 rounded-full bg-[#FF9933] text-slate-900 flex items-center justify-center font-bold text-xs shrink-0 mt-1 shadow-2xs">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Thinking / Typing Animation */}
                  {isThinking && (
                    <div className="flex gap-2.5 justify-start animate-in fade-in duration-150">
                      <div className="w-7 h-7 rounded-full bg-[#003D7C] text-white flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-[#FF9933]" />
                      </div>
                      <div className="bg-white border border-[#D0D7DE] rounded-2xl rounded-tl-xs p-3 shadow-2xs flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#003D7C] animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-[#003D7C] animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-[#003D7C] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {t('assistantThinking')}
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Prompts Shelf (Quick Question Chips) */}
                <div className="px-3.5 py-2 bg-slate-100 border-t border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FF9933]" />
                    <span>Suggestions:</span>
                  </span>
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(q)}
                      disabled={isThinking}
                      className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-[#003D7C] hover:text-[#002856] border border-slate-300 hover:border-[#003D7C] text-[10px] font-bold transition-all shrink-0 shadow-2xs active:scale-95 disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Input Bar & Send Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-3 bg-white border-t border-slate-200 shrink-0 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      id="bhulekh-assistant-input"
                      value={inputQuery}
                      onChange={(e) => setInputQuery(e.target.value)}
                      placeholder={t('assistantPlaceholder')}
                      disabled={isThinking}
                      className="flex-1 py-2 px-3 text-xs bg-slate-50 focus:bg-white border border-slate-300 focus:border-[#003D7C] rounded-xl focus:outline-none shadow-inner"
                      autoComplete="off"
                    />

                    <button
                      type="submit"
                      id="bhulekh-assistant-send-btn"
                      disabled={!inputQuery.trim() || isThinking}
                      className={`p-2.5 rounded-xl font-bold transition-all flex items-center justify-center shrink-0 ${
                        inputQuery.trim() && !isThinking
                          ? 'bg-[#FF9933] hover:bg-[#E68A00] text-slate-900 shadow-md cursor-pointer active:scale-95'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      }`}
                      title={t('assistantSendBtn')}
                      aria-label="Send Message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Privacy & Legal Disclaimer */}
                  <div className="text-[9px] text-slate-400 text-center leading-tight">
                    {t('assistantDisclaimer')}
                  </div>
                </form>
              </>
            )}

            {/* Minimized Bar Preview */}
            {isMinimized && (
              <div 
                onClick={() => setIsMinimized(false)}
                className="p-3 bg-[#F0F5FA] flex items-center justify-between cursor-pointer hover:bg-[#E1EDF7] transition"
              >
                <span className="text-xs font-bold text-[#003D7C] flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-[#FF9933]" />
                  <span>Click to resume chat</span>
                </span>
                <span className="text-[10px] text-slate-500">
                  {messages.length} messages
                </span>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};
