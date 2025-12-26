import { ExternalLink, ArrowRight } from 'lucide-react';
import { DOMAIN_CONFIG } from '../config/navigation';

interface CrossDomainBridgeProps {
  type: 'to-foundation' | 'to-app';
  context?: string;
  className?: string;
}

export function CrossDomainBridge({ type, context, className = '' }: CrossDomainBridgeProps) {
  const isToFoundation = type === 'to-foundation';

  const config = isToFoundation
    ? {
        title: 'Explore the Science',
        description: 'Learn why this research matters and how Web3 enables medical breakthroughs',
        url: `${DOMAIN_CONFIG.foundation.baseUrl}/knowledge`,
        buttonText: 'Visit TYT Foundation',
        color: '#FF00FF',
      }
    : {
        title: 'Learn the Tools',
        description: 'Master Web3, blockchain, and crypto infrastructure through hands-on courses',
        url: `${DOMAIN_CONFIG.app.baseUrl}/academy`,
        buttonText: 'Open Academy',
        color: '#00F0FF',
      };

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border p-8
        ${isToFoundation
          ? 'bg-gradient-to-br from-[#FF00FF]/5 to-transparent border-[#FF00FF]/30'
          : 'bg-gradient-to-br from-[#00F0FF]/5 to-transparent border-[#00F0FF]/30'
        }
        ${className}
      `}
    >
      <div className="absolute top-4 right-4">
        <ExternalLink
          size={20}
          style={{ color: config.color }}
          className="opacity-50"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white">
          {config.title}
        </h3>

        <p className="text-gray-400 leading-relaxed">
          {config.description}
        </p>

        {context && (
          <p className="text-sm text-gray-500 italic border-l-2 pl-4" style={{ borderColor: config.color }}>
            Context: {context}
          </p>
        )}

        <a
          href={config.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
          style={{
            background: `${config.color}20`,
            color: config.color,
            border: `1px solid ${config.color}40`,
          }}
        >
          <span>{config.buttonText}</span>
          <ArrowRight size={18} />
        </a>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: config.color }}
          />
          <span>aOi connects both domains seamlessly</span>
        </div>
      </div>
    </div>
  );
}
