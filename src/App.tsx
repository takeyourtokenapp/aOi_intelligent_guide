import { Shield, BookOpen, Heart, Sparkles, ArrowRight, Brain, Cpu, Globe } from 'lucide-react';
import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { CrossDomainBridge } from './components/CrossDomainBridge';
import { AoiAssistant } from './components/AoiAssistant';
import { DOMAIN_CONFIG } from './config/navigation';

function App() {
  const [aoiOpen, setAoiOpen] = useState(false);

  const handleAoiClick = () => {
    setAoiOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1122] via-[#0d1a2d] to-[#0A1122] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.03),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(210,164,76,0.05),transparent_50%)]"></div>

      <div className="relative z-10">
        <Navigation onAoiClick={handleAoiClick} />

        <main className="container mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-float">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#D2A44C]/10 border border-[#D2A44C]/30">
                <Sparkles className="w-4 h-4 text-[#D2A44C]" />
                <span className="text-sm font-medium text-[#D2A44C]">AI-Powered Navigation</span>
              </div>

              <h1 className="text-6xl md:text-7xl font-bold mb-6">
                Meet <span className="text-[#D2A44C]">aOi (葵)</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
                Your intelligent guide connecting{' '}
                <span className="text-[#00F0FF] font-semibold">Technology</span> and{' '}
                <span className="text-[#FF00FF] font-semibold">Medicine</span>
              </p>

              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                aOi is not a chatbot or mascot. She's your navigation assistant between two worlds: learning Web3 tools on <span className="text-[#00F0FF]">takeyourtoken.app</span> and understanding medical research on <span className="text-[#FF00FF]">tyt.foundation</span>.
              </p>
            </div>

            <div className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-[#D2A44C]/10 to-transparent border border-[#D2A44C]/30">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <Brain className="w-12 h-12 text-[#FF00FF] mx-auto mb-3" strokeWidth={1.5} />
                  <h3 className="font-bold text-white mb-2">Knowledge Layer</h3>
                  <p className="text-sm text-gray-400">Medical research, pediatric neuro-oncology, and why it matters</p>
                </div>
                <div className="text-center">
                  <Cpu className="w-12 h-12 text-[#D2A44C] mx-auto mb-3" strokeWidth={1.5} />
                  <h3 className="font-bold text-white mb-2">Technology Layer</h3>
                  <p className="text-sm text-gray-400">Web3, blockchain, crypto infrastructure training</p>
                </div>
                <div className="text-center">
                  <Globe className="w-12 h-12 text-[#00F0FF] mx-auto mb-3" strokeWidth={1.5} />
                  <h3 className="font-bold text-white mb-2">Connection Layer</h3>
                  <p className="text-sm text-gray-400">aOi explains how tools enable science</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-300 italic">
                  "You don't need to be a doctor to help science. Learn the infrastructure that makes research possible."
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <a
                href={`${DOMAIN_CONFIG.app.baseUrl}/academy`}
                className="group relative bg-gradient-to-br from-[#0A1122] to-[#1a2744] p-8 rounded-2xl border border-[#00F0FF]/30 hover:border-[#00F0FF]/60 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative z-10">
                  <BookOpen className="w-12 h-12 text-[#00F0FF] mb-4" strokeWidth={1.5} />
                  <h3 className="text-2xl font-bold mb-3 text-white">Academy</h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    Learn Web3, blockchain, and crypto. Earn verifiable certificates. Build your skills.
                  </p>
                  <div className="flex items-center gap-2 text-[#00F0FF] font-medium group-hover:gap-4 transition-all">
                    <span>Start Learning</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </a>

              <a
                href={`${DOMAIN_CONFIG.foundation.baseUrl}/knowledge`}
                className="group relative bg-gradient-to-br from-[#0A1122] to-[#441a44] p-8 rounded-2xl border border-[#FF00FF]/30 hover:border-[#FF00FF]/60 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF00FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative z-10">
                  <Brain className="w-12 h-12 text-[#FF00FF] mb-4" strokeWidth={1.5} />
                  <h3 className="text-2xl font-bold mb-3 text-white">Knowledge Hub</h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    Understand brain tumors, research challenges, and how technology helps.
                  </p>
                  <div className="flex items-center gap-2 text-[#FF00FF] font-medium group-hover:gap-4 transition-all">
                    <span>Explore Science</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </a>

              <a
                href={`${DOMAIN_CONFIG.foundation.baseUrl}/foundation`}
                className="group relative bg-gradient-to-br from-[#0A1122] to-[#2d2214] p-8 rounded-2xl border border-[#D2A44C]/30 hover:border-[#D2A44C]/60 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#D2A44C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative z-10">
                  <Heart className="w-12 h-12 text-[#D2A44C] mb-4" strokeWidth={1.5} />
                  <h3 className="text-2xl font-bold mb-3 text-white">Foundation</h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    See how every transaction supports children's brain cancer research.
                  </p>
                  <div className="flex items-center gap-2 text-[#D2A44C] font-medium group-hover:gap-4 transition-all">
                    <span>View Transparency</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <CrossDomainBridge type="to-app" />
              <CrossDomainBridge type="to-foundation" />
            </div>

            <div className="bg-gradient-to-r from-[#D2A44C]/10 via-[#00F0FF]/10 to-[#FF00FF]/10 p-8 rounded-2xl border border-[#D2A44C]/20">
              <div className="flex items-start gap-4">
                <Shield className="w-16 h-16 text-[#D2A44C] flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">aOi's Role</h3>
                  <div className="space-y-2 text-gray-300 leading-relaxed">
                    <p>
                      <span className="font-semibold text-[#D2A44C]">✓</span> Explains Web3 and blockchain technology
                    </p>
                    <p>
                      <span className="font-semibold text-[#D2A44C]">✓</span> Connects tools to medical research context
                    </p>
                    <p>
                      <span className="font-semibold text-[#D2A44C]">✓</span> Guides you through learning paths
                    </p>
                    <p>
                      <span className="font-semibold text-[#D2A44C]">✓</span> Controls and manages all TYT ecosystem elements
                    </p>
                    <p className="text-gray-400 text-sm mt-4 pt-4 border-t border-gray-700">
                      <span className="font-semibold text-[#FF0000]">✗</span> Does NOT provide medical advice
                      <br />
                      <span className="font-semibold text-[#FF0000]">✗</span> Does NOT make financial recommendations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="container mx-auto px-6 py-12 border-t border-gray-800/50">
          <div className="text-center text-gray-500 text-sm space-y-2">
            <p className="text-gray-400 font-medium">
              Two domains • One mission • Connected by aOi
            </p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <a href={DOMAIN_CONFIG.app.baseUrl} className="hover:text-[#00F0FF] transition-colors">
                takeyourtoken.app
              </a>
              <span className="text-gray-700">•</span>
              <a href={DOMAIN_CONFIG.foundation.baseUrl} className="hover:text-[#FF00FF] transition-colors">
                tyt.foundation
              </a>
            </div>
            <p className="text-xs text-gray-600 mt-4">
              TYT Foundation • Where Web3 Infrastructure Enables Medical Research
            </p>
          </div>
        </footer>
      </div>

      <AoiAssistant isOpen={aoiOpen} onOpenChange={setAoiOpen} />
    </div>
  );
}

export default App;
