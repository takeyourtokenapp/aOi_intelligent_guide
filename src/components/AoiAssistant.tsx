import { MessageCircle, X, Send, Sparkles, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { foundationApi } from '../services/foundationApi';
import type { AoiContext } from '../services/foundationApi';

interface Message {
  id: string;
  role: 'user' | 'aoi';
  content: string;
  timestamp: Date;
  category?: string;
  relatedLinks?: Array<{ label: string; url: string }>;
}

export function AoiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'aoi',
      content: 'Hello! I\'m aOi (葵), your guide through the TYT ecosystem. I can help you understand Web3 technologies, navigate between our platforms, and explain how your learning contributes to children\'s brain cancer research.\n\nWhat would you like to know?',
      timestamp: new Date(),
      category: 'general',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkConnection = async () => {
    const status = await foundationApi.checkStatus();
    setIsOnline(status.online);
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    await foundationApi.retryConnection();
    await checkConnection();
    setIsRetrying(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const context: AoiContext = {
        topic: input,
        userLevel: 'explorer',
        language: 'en',
        currentDomain: window.location.hostname.includes('foundation') ? 'foundation' : 'app',
      };

      const response = await foundationApi.askAoi(context);

      const relatedLinks: Array<{ label: string; url: string }> = [];

      if (response.appLink) {
        relatedLinks.push({ label: 'View in Academy', url: response.appLink });
      }
      if (response.foundationLink) {
        relatedLinks.push({ label: 'Learn More', url: response.foundationLink });
      }

      const aoiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'aoi',
        content: response.explanation,
        timestamp: new Date(),
        category: response.category,
        relatedLinks: relatedLinks.length > 0 ? relatedLinks : undefined,
      };

      setMessages((prev) => [...prev, aoiResponse]);
    } catch (error) {
      console.error('Error getting aOi response:', error);

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'aoi',
        content: 'I apologize, but I\'m having trouble connecting right now. I\'m still here to help with basic navigation and information. What would you like to know?',
        timestamp: new Date(),
        category: 'general',
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-[#D2A44C] to-[#00F0FF] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group"
      >
        <MessageCircle className="w-7 h-7 text-white" strokeWidth={2} />
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse ${isOnline ? 'bg-[#00FF00]' : 'bg-[#FF6600]'}`} />

        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-[#0A1122] border border-[#D2A44C]/30 rounded-lg text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <Sparkles className="w-3 h-3 inline mr-1 text-[#D2A44C]" />
          Ask aOi
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-[#0A1122] border border-[#D2A44C]/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-[#D2A44C]/20 to-[#00F0FF]/20 p-4 flex items-center justify-between border-b border-[#D2A44C]/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D2A44C] to-[#00F0FF] flex items-center justify-center">
              <span className="text-white font-bold text-lg">葵</span>
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-[#0A1122] rounded-full ${isOnline ? 'bg-[#00FF00]' : 'bg-[#FF6600] animate-pulse'}`} />
          </div>
          <div>
            <h3 className="font-bold text-white flex items-center gap-2">
              aOi
              {isOnline ? (
                <Wifi size={14} className="text-[#00FF00]" />
              ) : (
                <WifiOff size={14} className="text-[#FF6600]" />
              )}
            </h3>
            <p className="text-xs text-gray-400">
              {isOnline ? '🟢 Foundation Connected' : '🟡 Basic Mode'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isOnline && (
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              title="Retry connection"
            >
              <RefreshCw size={16} className={isRetrying ? 'animate-spin' : ''} />
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] p-3 rounded-2xl
                ${message.role === 'user'
                  ? 'bg-[#D2A44C]/20 text-white rounded-br-none'
                  : 'bg-[#00F0FF]/10 text-gray-200 rounded-bl-none border border-[#00F0FF]/20'
                }
              `}
            >
              <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>

              {message.relatedLinks && message.relatedLinks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#00F0FF]/20 space-y-2">
                  {message.relatedLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-[#00F0FF] hover:text-[#00F0FF]/80 transition-colors"
                    >
                      → {link.label}
                    </a>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#00F0FF]/10 text-gray-200 p-3 rounded-2xl rounded-bl-none border border-[#00F0FF]/20">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-[#D2A44C]/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Ask aOi anything..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-[#1a2744] border border-[#00F0FF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]/60 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-[#D2A44C] text-white rounded-lg hover:bg-[#D2A44C]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          aOi guides, but doesn't give medical or financial advice
        </p>
      </div>
    </div>
  );
}
