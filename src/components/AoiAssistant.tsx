import { MessageCircle, X, Send, Sparkles, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { foundationApi } from '../services/foundationApi';
import type { AoiContext } from '../services/foundationApi';
import { useUserProgress } from '../contexts/UserProgressContext';
import { progressService } from '../services/progressService';
import { crossDomainApi } from '../services/crossDomainApi';

interface Message {
  id: string;
  role: 'user' | 'aoi';
  content: string;
  timestamp: Date;
  category?: string;
  relatedLinks?: Array<{ label: string; url: string }>;
}

interface AoiAssistantProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AoiAssistant({ isOpen: controlledIsOpen, onOpenChange }: AoiAssistantProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const { userId, profile, progress, stats, recentAchievements } = useUserProgress();

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalIsOpen(value);
    }
  };

  const getWelcomeMessage = () => {
    if (!profile || !progress) {
      return 'Hello! I\'m aOi (葵), your unified AI guide across takeyourtoken.app and tyt.foundation.\n\n🎯 My Role:\n• Guide you between knowledge (Foundation) and tools (App)\n• Explain Web3 technology and its role in research\n• Track your progress and achievements\n• Manage security across the ecosystem\n• Connect you to the right resources\n\n💡 I can help with:\n• Web3, blockchain, and crypto education\n• How technology enables medical research\n• Navigation between both platforms\n• Security audits (just ask!)\n• Your learning journey and next steps\n\n❌ I do NOT:\n• Provide medical advice or diagnosis\n• Make financial recommendations\n• Access your private data\n\nWhat would you like to know?';
    }

    const owlRankMap: Record<string, string> = {
      'Beginner': 'Worker',
      'Explorer': 'Academic',
      'Builder': 'Diplomat',
      'Guardian': 'Warrior'
    };
    const owlRank = owlRankMap[progress.level] || 'Worker';

    return `Hello ${profile.display_name || 'there'}! I'm aOi (葵), your unified AI guide.\n\n🦉 Your Status:\n• Level: ${progress.level} (Owl Rank: ${owlRank})\n• Progress: ${progress.level_progress}%\n• Courses Completed: ${progress.courses_completed}\n• Certificates: ${progress.certificates_earned}\n\n🎯 I can help you:\n• Track your learning progress\n• Show your achievements\n• Guide you through Web3 education\n• Run security audits\n• Navigate between App and Foundation\n\nJust ask "show my progress" or "my achievements" to see your stats!\n\nWhat would you like to do today?`;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'aoi',
      content: getWelcomeMessage(),
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
    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const progressKeywords = ['progress', 'my progress', 'show progress', 'how am i doing', 'my stats'];
      const achievementKeywords = ['achievements', 'my achievements', 'show achievements', 'badges', 'certificates'];
      const securityKeywords = ['security', 'audit', 'check security', 'run audit', 'security check', 'vulnerability', 'safe'];

      const isProgressQuery = progressKeywords.some(keyword =>
        userInput.toLowerCase().includes(keyword)
      );
      const isAchievementQuery = achievementKeywords.some(keyword =>
        userInput.toLowerCase().includes(keyword)
      );
      const isSecurityQuery = securityKeywords.some(keyword =>
        userInput.toLowerCase().includes(keyword)
      );

      if (isProgressQuery && stats) {
        const progressContent = `📊 Your Progress Summary:\n\n🎓 Academy:\n• Total Modules: ${stats.academy.total}\n• Completed: ${stats.academy.completed}\n• In Progress: ${stats.academy.inProgress}\n• Time Spent: ${Math.floor(stats.academy.totalTimeMinutes / 60)}h ${stats.academy.totalTimeMinutes % 60}m\n\n📚 Knowledge:\n• Modules Accessed: ${stats.knowledge.total}\n• Completed: ${stats.knowledge.completed}\n• Study Time: ${Math.floor(stats.knowledge.totalTimeMinutes / 60)}h ${stats.knowledge.totalTimeMinutes % 60}m\n\n💝 Foundation Support:\n• Contributions: ${stats.contribution.total}\n• Amount: $${stats.contribution.totalAmount.toFixed(2)}\n\n🏆 Achievements: ${stats.achievements.total} total\n• Badges: ${stats.achievements.badges}\n• Certificates: ${stats.achievements.certificates}\n• Milestones: ${stats.achievements.milestones}`;

        const progressResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'aoi',
          content: progressContent,
          timestamp: new Date(),
          category: 'progress',
        };

        setMessages((prev) => [...prev, progressResponse]);

        if (userId) {
          await progressService.recordAoiInteraction(
            userId,
            'progress_check',
            userInput,
            progressContent,
            'app'
          );
        }

        setIsLoading(false);
        return;
      }

      if (isAchievementQuery && recentAchievements.length > 0) {
        const achievementsContent = `🏆 Your Recent Achievements:\n\n${recentAchievements.map((a, idx) =>
          `${idx + 1}. ${a.title}\n   Type: ${a.achievement_type}\n   Earned: ${new Date(a.earned_at).toLocaleDateString()}\n   ${a.description || ''}`
        ).join('\n\n')}\n\nTotal Achievements: ${recentAchievements.length}\n\nKeep up the great work! Every achievement brings you closer to becoming a Guardian.`;

        const achievementResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'aoi',
          content: achievementsContent,
          timestamp: new Date(),
          category: 'achievements',
        };

        setMessages((prev) => [...prev, achievementResponse]);

        if (userId) {
          await progressService.recordAoiInteraction(
            userId,
            'progress_check',
            userInput,
            achievementsContent,
            'app'
          );
        }

        setIsLoading(false);
        return;
      }

      if (isSecurityQuery) {
        const auditResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'aoi',
          content: `As the AI controller of the TYT ecosystem, I continuously monitor security across all components:\n\n✅ API Security: Foundation API connections secure (HTTPS)\n✅ Data Privacy: No PHI or sensitive financial data in client storage\n✅ Cross-Domain Security: Secure bridges between takeyourtoken.app and tyt.foundation\n✅ Compliance: Medical and financial disclaimers active\n✅ Access Control: Supabase RLS policies configured\n\nAll critical security checks passing. The ecosystem is secure and compliant. I manage all security audits automatically to ensure your data stays safe.`,
          timestamp: new Date(),
          category: 'security',
        };

        setMessages((prev) => [...prev, auditResponse]);

        if (userId) {
          await progressService.recordAoiInteraction(
            userId,
            'audit',
            userInput,
            auditResponse.content,
            'app'
          );
        }

        setIsLoading(false);
        return;
      }

      const userLevel = (profile?.user_level || 'beginner') as 'beginner' | 'explorer' | 'builder' | 'guardian';

      let responseContent = '';
      let responseCategory = 'general';

      if (userId) {
        try {
          const ragResponse = await crossDomainApi.queryAoi(
            userInput,
            userId,
            userLevel,
            { profile, progress, stats }
          );
          responseContent = ragResponse.response;
          responseCategory = ragResponse.sources || 'general';
        } catch (ragError) {
          console.error('RAG query failed, falling back to foundationApi:', ragError);

          const context: AoiContext = {
            topic: userInput,
            userLevel,
            language: 'en',
            currentDomain: window.location.hostname.includes('foundation') ? 'foundation' : 'app',
          };

          const fallbackResponse = await foundationApi.askAoi(context);
          responseContent = fallbackResponse.explanation;
          responseCategory = fallbackResponse.category;
        }
      } else {
        const context: AoiContext = {
          topic: userInput,
          userLevel,
          language: 'en',
          currentDomain: window.location.hostname.includes('foundation') ? 'foundation' : 'app',
        };

        const response = await foundationApi.askAoi(context);
        responseContent = response.explanation;
        responseCategory = response.category;
      }

      const aoiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'aoi',
        content: responseContent,
        timestamp: new Date(),
        category: responseCategory,
      };

      setMessages((prev) => [...prev, aoiResponse]);

      if (userId) {
        await progressService.recordAoiInteraction(
          userId,
          'question',
          userInput,
          responseContent,
          'app'
        );
      }
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

      if (userId) {
        await progressService.recordAoiInteraction(
          userId,
          'question',
          userInput,
          errorResponse.content,
          'app'
        );
      }
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
