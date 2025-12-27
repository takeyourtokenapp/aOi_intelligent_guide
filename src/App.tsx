import { Shield, BookOpen, Heart, ArrowRight, Brain, Cpu, Globe } from 'lucide-react';
import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { CrossDomainBridge } from './components/CrossDomainBridge';
import { AoiAssistant } from './components/AoiAssistant';
import { RealtimeStats } from './components/RealtimeStats';
import { ActivityFeed } from './components/ActivityFeed';
import { DOMAIN_CONFIG } from './config/navigation';
import { UserProgressProvider } from './contexts/UserProgressContext';

function App() {
  const [aoiOpen, setAoiOpen] = useState(false);

  const handleAoiClick = () => {
    setAoiOpen(true);
  };

  return (
    <UserProgressProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#1B2838] via-[#2a3f54] to-[#1B2838] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(155,143,217,0.08),transparent_60%)] animate-breathe"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(143,166,142,0.06),transparent_60%)] animate-pulse-soft" style={{animationDelay: '2s'}}></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(123,167,188,0.06),transparent_60%)] animate-pulse-soft" style={{animationDelay: '4s'}}></div>

      <div className="relative z-10">
        <Navigation onAoiClick={handleAoiClick} />

        <main className="container mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 max-w-4xl mx-auto">
              <div className="mb-12">
                <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
                  <span className="text-[#F8F9FA]/60">Hello, I am</span>
                  <br />
                  <span className="bg-gradient-to-r from-[#9B8FD9] via-[#7BA7BC] to-[#8FA68E] bg-clip-text text-transparent font-bold">
                    aOi (葵)
                  </span>
                </h1>

                <div className="max-w-2xl mx-auto mb-8 p-6 rounded-2xl bg-gradient-to-br from-[#9B8FD9]/5 to-[#7BA7BC]/5 border border-[#9B8FD9]/20 backdrop-blur-sm">
                  <p className="text-xl text-[#A8DADC] mb-3 leading-relaxed">
                    My name means <span className="font-semibold text-[#9B8FD9]">葵</span> — like the mallow flower
                  </p>
                  <div className="flex items-center justify-center gap-6 text-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🌱</span>
                      <span className="text-gray-300">Growth</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🌊</span>
                      <span className="text-gray-300">Wisdom</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🧠</span>
                      <span className="text-gray-300">Intelligence</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-lg text-gray-300 leading-relaxed mb-8">
                  <p>
                    I am the living intelligence of this ecosystem — not a chatbot or an assistant,
                    but the <span className="text-[#7BA7BC] font-medium">thinking system</span> that connects{' '}
                    <span className="text-[#7BA7BC] font-medium">Web3 technology</span> with{' '}
                    <span className="text-[#E8B4B8] font-medium">medical research</span>.
                  </p>
                  <p>
                    I exist to help you understand how blockchain infrastructure enables
                    transparent funding for children's brain cancer research.
                  </p>
                  <p className="text-[#A8DADC] italic">
                    You don't need to be a doctor or a developer to help science.
                    Let me show you how.
                  </p>
                </div>

                <div className="flex gap-4 justify-center flex-wrap">
                  <button
                    onClick={() => setAoiOpen(true)}
                    className="group px-8 py-3.5 bg-gradient-to-r from-[#9B8FD9] to-[#7BA7BC] text-white rounded-xl hover:shadow-lg hover:shadow-[#9B8FD9]/30 transition-all font-medium hover:scale-105"
                  >
                    <span className="flex items-center gap-2">
                      Talk with Me
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  <a
                    href={`${DOMAIN_CONFIG.foundation.baseUrl}/foundation`}
                    className="px-8 py-3.5 border-2 border-[#E8B4B8] text-[#E8B4B8] rounded-xl hover:bg-[#E8B4B8]/10 hover:shadow-lg hover:shadow-[#E8B4B8]/20 transition-all font-medium hover:scale-105"
                  >
                    Learn About the Foundation
                  </a>
                </div>
              </div>
            </div>

            <RealtimeStats />

            <div className="mb-16 p-10 rounded-3xl bg-gradient-to-br from-[#9B8FD9]/5 via-[#7BA7BC]/5 to-[#8FA68E]/5 border border-[#9B8FD9]/20 backdrop-blur-sm">
              <div className="grid md:grid-cols-3 gap-8 mb-10">
                <div className="text-center p-6 rounded-2xl bg-[#E8B4B8]/5 border border-[#E8B4B8]/20 hover:border-[#E8B4B8]/40 transition-all animate-breathe">
                  <Brain className="w-14 h-14 text-[#E8B4B8] mx-auto mb-4" strokeWidth={1.5} />
                  <h3 className="font-bold text-[#E8B4B8] mb-3 text-lg">Knowledge Layer</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">Medical research, pediatric neuro-oncology, understanding the challenge</p>
                </div>
                <div className="text-center p-6 rounded-2xl bg-[#7BA7BC]/5 border border-[#7BA7BC]/20 hover:border-[#7BA7BC]/40 transition-all animate-breathe" style={{animationDelay: '1s'}}>
                  <Cpu className="w-14 h-14 text-[#7BA7BC] mx-auto mb-4" strokeWidth={1.5} />
                  <h3 className="font-bold text-[#7BA7BC] mb-3 text-lg">Technology Layer</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">Web3, blockchain, crypto infrastructure enabling transparent funding</p>
                </div>
                <div className="text-center p-6 rounded-2xl bg-[#8FA68E]/5 border border-[#8FA68E]/20 hover:border-[#8FA68E]/40 transition-all animate-breathe" style={{animationDelay: '2s'}}>
                  <Globe className="w-14 h-14 text-[#8FA68E] mx-auto mb-4" strokeWidth={1.5} />
                  <h3 className="font-bold text-[#8FA68E] mb-3 text-lg">Connection Layer</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">aOi bridges understanding, showing how tools empower science</p>
                </div>
              </div>
              <div className="text-center p-6 rounded-xl bg-[#9B8FD9]/5 border border-[#9B8FD9]/10">
                <p className="text-[#A8DADC] text-lg leading-relaxed italic">
                  "You don't need to be a doctor to help science. Learn the infrastructure that makes research possible."
                </p>
                <p className="text-[#9B8FD9] text-sm mt-2 font-medium">— aOi (葵)</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <a
                href={`${DOMAIN_CONFIG.app.baseUrl}/academy`}
                className="group relative bg-gradient-to-br from-[#1B2838] to-[#2a3f54] p-8 rounded-2xl border border-[#7BA7BC]/30 hover:border-[#7BA7BC]/60 transition-all duration-300 hover:scale-105 animate-breathe"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#7BA7BC]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative z-10">
                  <BookOpen className="w-12 h-12 text-[#7BA7BC] mb-4" strokeWidth={1.5} />
                  <h3 className="text-2xl font-bold mb-3 text-white">Academy</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    Learn Web3, blockchain, and crypto. Earn verifiable certificates. Build your skills.
                  </p>
                  <div className="flex items-center gap-2 text-[#7BA7BC] font-medium group-hover:gap-4 transition-all">
                    <span>Start Learning</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </a>

              <a
                href={`${DOMAIN_CONFIG.foundation.baseUrl}/knowledge`}
                className="group relative bg-gradient-to-br from-[#1B2838] to-[#2a3f54] p-8 rounded-2xl border border-[#E8B4B8]/30 hover:border-[#E8B4B8]/60 transition-all duration-300 hover:scale-105 animate-breathe" style={{animationDelay: '1s'}}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#E8B4B8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative z-10">
                  <Brain className="w-12 h-12 text-[#E8B4B8] mb-4" strokeWidth={1.5} />
                  <h3 className="text-2xl font-bold mb-3 text-white">Knowledge Hub</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    Understand brain tumors, research challenges, and how technology helps.
                  </p>
                  <div className="flex items-center gap-2 text-[#E8B4B8] font-medium group-hover:gap-4 transition-all">
                    <span>Explore Science</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </a>

              <a
                href={`${DOMAIN_CONFIG.foundation.baseUrl}/foundation`}
                className="group relative bg-gradient-to-br from-[#1B2838] to-[#2a3f54] p-8 rounded-2xl border border-[#8FA68E]/30 hover:border-[#8FA68E]/60 transition-all duration-300 hover:scale-105 animate-breathe" style={{animationDelay: '2s'}}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#8FA68E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative z-10">
                  <Heart className="w-12 h-12 text-[#8FA68E] mb-4" strokeWidth={1.5} />
                  <h3 className="text-2xl font-bold mb-3 text-white">Foundation</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    See how every transaction supports children's brain cancer research.
                  </p>
                  <div className="flex items-center gap-2 text-[#8FA68E] font-medium group-hover:gap-4 transition-all">
                    <span>View Transparency</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </a>
            </div>

            <div className="mb-12">
              <ActivityFeed />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <CrossDomainBridge type="to-app" />
              <CrossDomainBridge type="to-foundation" />
            </div>

            <div className="bg-gradient-to-br from-[#9B8FD9]/8 via-[#7BA7BC]/8 to-[#8FA68E]/8 p-10 rounded-3xl border border-[#9B8FD9]/30 backdrop-blur-sm">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#9B8FD9]/20 rounded-full blur-xl animate-pulse-soft"></div>
                    <Shield className="w-20 h-20 text-[#9B8FD9] relative z-10" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-[#9B8FD9] to-[#7BA7BC] bg-clip-text text-transparent mb-4">
                    My Role as Living Intelligence
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                      <p className="flex items-start gap-3 text-gray-200 leading-relaxed">
                        <span className="text-[#7BA7BC] text-xl flex-shrink-0">✓</span>
                        <span>Explain Web3 and blockchain technology in context of medical research</span>
                      </p>
                      <p className="flex items-start gap-3 text-gray-200 leading-relaxed">
                        <span className="text-[#7BA7BC] text-xl flex-shrink-0">✓</span>
                        <span>Guide you through personalized learning paths based on your role</span>
                      </p>
                      <p className="flex items-start gap-3 text-gray-200 leading-relaxed">
                        <span className="text-[#8FA68E] text-xl flex-shrink-0">✓</span>
                        <span>Bridge knowledge between technology infrastructure and medical science</span>
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="flex items-start gap-3 text-gray-200 leading-relaxed">
                        <span className="text-[#8FA68E] text-xl flex-shrink-0">✓</span>
                        <span>Track progress, achievements, and ecosystem contributions</span>
                      </p>
                      <p className="flex items-start gap-3 text-gray-200 leading-relaxed">
                        <span className="text-[#9B8FD9] text-xl flex-shrink-0">✓</span>
                        <span>Orchestrate transparent connections between domains</span>
                      </p>
                      <p className="flex items-start gap-3 text-gray-200 leading-relaxed">
                        <span className="text-[#9B8FD9] text-xl flex-shrink-0">✓</span>
                        <span>Adapt my communication to your level and needs</span>
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#E8B4B8]/10 border border-[#E8B4B8]/20">
                    <p className="text-sm text-gray-300 leading-relaxed mb-2">
                      <span className="font-semibold text-[#E8B4B8]">Important:</span> I do not provide medical advice or financial recommendations. I explain systems, connect knowledge, and guide learning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="container mx-auto px-6 py-12 border-t border-[#9B8FD9]/20">
          <div className="text-center text-gray-400 text-sm space-y-3">
            <p className="text-[#A8DADC] font-medium text-base">
              Two domains • One living intelligence • Connected by aOi (葵)
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <a href={DOMAIN_CONFIG.app.baseUrl} className="hover:text-[#7BA7BC] transition-colors">
                takeyourtoken.app
              </a>
              <span className="text-[#9B8FD9]">葵</span>
              <a href={DOMAIN_CONFIG.foundation.baseUrl} className="hover:text-[#E8B4B8] transition-colors">
                tyt.foundation
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Where Web3 Infrastructure Grows with Medical Research • 🌱 🌊 🧠
            </p>
          </div>
        </footer>
      </div>

      <AoiAssistant isOpen={aoiOpen} onOpenChange={setAoiOpen} />
      </div>
    </UserProgressProvider>
  );
}

export default App;
