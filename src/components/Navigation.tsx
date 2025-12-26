import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NAVIGATION_LINKS, DOMAIN_CONFIG } from '../config/navigation';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0A1122]/95 backdrop-blur-lg border-b border-[#D2A44C]/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10 text-[#D2A44C]" strokeWidth={1.5} />
            <div>
              <h1 className="text-xl font-bold text-[#D2A44C]">TYT Ecosystem</h1>
              <p className="text-xs text-gray-400">Powered by aOi</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href={`${DOMAIN_CONFIG.app.baseUrl}/academy`}
              className="text-sm font-medium text-gray-300 hover:text-[#00F0FF] transition-colors"
            >
              Academy
            </a>
            <a
              href={`${DOMAIN_CONFIG.foundation.baseUrl}/knowledge`}
              className="text-sm font-medium text-gray-300 hover:text-[#FF00FF] transition-colors"
            >
              Knowledge
            </a>
            <a
              href={`${DOMAIN_CONFIG.foundation.baseUrl}/foundation`}
              className="text-sm font-medium text-gray-300 hover:text-[#D2A44C] transition-colors"
            >
              Foundation
            </a>
            <a
              href={`${DOMAIN_CONFIG.app.baseUrl}/dashboard`}
              className="px-4 py-2 rounded-lg bg-[#D2A44C]/20 text-[#D2A44C] font-medium hover:bg-[#D2A44C]/30 transition-all border border-[#D2A44C]/30"
            >
              My Progress
            </a>
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
            {[...NAVIGATION_LINKS.app, ...NAVIGATION_LINKS.foundation].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-300 hover:text-[#D2A44C] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
