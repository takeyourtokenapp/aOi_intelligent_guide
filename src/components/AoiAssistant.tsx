import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'aoi';
  content: string;
  timestamp: Date;
}

export function AoiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'aoi',
      content: 'Hello! I\'m aOi, your guide through the TYT ecosystem. I can help you understand Web3 technologies, navigate between our platforms, and explain how your learning contributes to children\'s brain cancer research.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const aoiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'aoi',
        content: 'I\'m aOi, an AI assistant focused on education and navigation. While I can explain Web3 concepts and guide you through our platform, I don\'t provide medical advice or financial recommendations. How can I help you learn today?',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aoiResponse]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-[#D2A44C] to-[#00F0FF] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group"
      >
        <MessageCircle className="w-7 h-7 text-white" strokeWidth={2} />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF00FF] rounded-full animate-pulse" />

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
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00FF00] border-2 border-[#0A1122] rounded-full" />
          </div>
          <div>
            <h3 className="font-bold text-white">aOi</h3>
            <p className="text-xs text-gray-400">AI Guide • Online</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
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
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[#D2A44C]/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask aOi anything..."
            className="flex-1 px-4 py-2 bg-[#1a2744] border border-[#00F0FF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]/60"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
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
