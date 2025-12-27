import { Shield, Menu, X, MessageCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { DOMAIN_CONFIG } from '../config/navigation';

interface NavigationProps {
  onAoiClick?: () => void;
}

export function Navigation({ onAoiClick }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0A1122]/95 backdrop-blur-lg border-b border-[#D2A44C]/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-3">
            <Shield className="w-10 h-10 text-[#D2A44C]" strokeWidth={1.5} />
            <div>
              <h1 className="text-xl font-bold text-[#D2A44C]">TakeYourToken</h1>
              <p className="text-xs text-gray-400">Owl Warrior Platform</p>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href={`${DOMAIN_CONFIG.app.baseUrl}/academy`}
              className="text-sm font-medium text-gray-300 hover:text-[#00F0FF] transition-colors"
            >
              Academy
            </a>
            <a
              href={`${DOMAIN_CONFIG.foundation.baseUrl}/foundation`}
              className="text-sm font-medium text-gray-300 hover:text-[#D2A44C] transition-colors"
            >
              Foundation
            </a>
            <a
              href={`${DOMAIN_CONFIG.app.baseUrl}/dashboard`}
              className="text-sm font-medium text-gray-300 hover:text-[#00F0FF] transition-colors"
            >
              Dashboard
            </a>

            <button
              onClick={onAoiClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-[#D2A44C]/20 to-[#00F0FF]/20 border border-[#D2A44C]/30 hover:border-[#D2A44C]/60 transition-all group"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D2A44C] to-[#00F0FF] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">葵</span>
                </div>
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-[#D2A44C] animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-1">
                  aOi
                  <div className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse" />
                </div>
                <div className="text-xs text-gray-400">AI Guide</div>
              </div>
            </button>
          </nav>

          <button
            className="md:hidden text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-6 space-y-4 border-t border-[#D2A44C]/20">
            <button
              onClick={() => {
                onAoiClick?.();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-lg bg-gradient-to-br from-[#D2A44C]/20 to-[#00F0FF]/20 border border-[#D2A44C]/30"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D2A44C] to-[#00F0FF] flex items-center justify-center">
                <span className="text-white font-bold text-sm">葵</span>
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white">aOi - AI Guide</div>
                <div className="text-xs text-gray-400">Ask me anything</div>
              </div>
            </button>

            <a
              href={`${DOMAIN_CONFIG.app.baseUrl}/academy`}
              className="block py-2 text-gray-300 hover:text-[#00F0FF] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Academy
            </a>
            <a
              href={`${DOMAIN_CONFIG.foundation.baseUrl}/foundation`}
              className="block py-2 text-gray-300 hover:text-[#D2A44C] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Foundation
            </a>
            <a
              href={`${DOMAIN_CONFIG.app.baseUrl}/dashboard`}
              className="block py-2 text-gray-300 hover:text-[#00F0FF] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
