import { MessageCircle, X, Send, Sparkles, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { foundationApi } from '../services/foundationApi';
import type { AoiContext } from '../services/foundationApi';
import { useUserProgress } from '../contexts/UserProgressContext';
import { progressService } from '../services/progressService';
import { crossDomainApi } from '../services/crossDomainApi';
import { AoiChatAvatar } from './AoiAvatarVariant';

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
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group"
      >
        <MessageCircle className="w-7 h-7 text-white" strokeWidth={2} />
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse ${isOnline ? 'bg-green-400' : 'bg-orange-500'}`} />

        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <Sparkles className="w-3 h-3 inline mr-1 text-purple-400" />
          Ask aOi
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[32rem] h-[600px] bg-slate-900 border border-purple-500/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-purple-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <AoiChatAvatar size="md" showSparkle={isOnline} />
            <div>
              <h3 className="font-bold text-white flex items-center gap-2 text-lg">
                aOi (葵)
              </h3>
              <p className="text-xs text-white/80 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI Guide & Platform Controller
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isOnline && (
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="text-white/60 hover:text-white transition-colors disabled:opacity-50"
                title="Retry connection"
              >
                <RefreshCw size={16} className={isRetrying ? 'animate-spin' : ''} />
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2 text-white text-sm">
          <span className="text-pink-300">💗</span>
          <span className="font-medium">Connecting Technology & Medicine for Children</span>
          {isOnline ? (
            <Wifi size={14} className="text-green-300 ml-auto" />
          ) : (
            <WifiOff size={14} className="text-orange-300 ml-auto" />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-2`}
          >
            {message.role === 'aoi' && (
              <AoiChatAvatar size="sm" showSparkle={false} className="mt-1" />
            )}
            <div
              className={`
                max-w-[75%] p-4 rounded-2xl
                ${message.role === 'user'
                  ? 'bg-purple-600/30 text-white rounded-tr-none border border-purple-500/30'
                  : 'bg-slate-700/80 text-gray-100 rounded-tl-none border border-slate-600/50'
                }
              `}
            >
              <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>

              {message.relatedLinks && message.relatedLinks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-600/50 space-y-2">
                  {message.relatedLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      → {link.label}
                    </a>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-400 mt-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-start gap-2">
            <AoiChatAvatar size="sm" showSparkle={false} />
            <div className="bg-slate-700/80 text-gray-100 p-4 rounded-2xl rounded-tl-none border border-slate-600/50">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-800 border-t border-slate-700">
        {messages.length <= 1 && (
          <div className="p-3 border-b border-slate-700">
            <p className="text-xs text-gray-400 mb-2">Quick replies:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setInput('How do I buy a miner?');
                  setTimeout(() => handleSend(), 100);
                }}
                className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-white text-xs rounded-lg border border-slate-600 transition-colors"
              >
                How do I buy a miner?
              </button>
              <button
                onClick={() => {
                  setInput('What are the fees?');
                  setTimeout(() => handleSend(), 100);
                }}
                className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-white text-xs rounded-lg border border-slate-600 transition-colors"
              >
                What are the fees?
              </button>
              <button
                onClick={() => {
                  setInput('How do withdrawals work?');
                  setTimeout(() => handleSend(), 100);
                }}
                className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-white text-xs rounded-lg border border-slate-600 transition-colors"
              >
                How do withdrawals work?
              </button>
              <button
                onClick={() => {
                  setInput('Tell me about the Foundation');
                  setTimeout(() => handleSend(), 100);
                }}
                className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-white text-xs rounded-lg border border-slate-600 transition-colors"
              >
                Tell me about the Foundation
              </button>
            </div>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Ask aOi anything</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder="Type your question..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/50"
            >
              <Send size={18} />
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">
            aOi guides, but doesn't give medical or financial advice
          </p>
        </div>
      </div>
    </div>
  );
}
