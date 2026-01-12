import { ArrowLeft, Home, MessageCircle } from 'lucide-react';
import { AoiCelebration } from '../components/AoiAvatarVariant';
import { useLanguage } from '../contexts/LanguageContext';

interface NotFoundPageProps {
  onNavigate?: (page: 'home') => void;
  onAoiClick?: () => void;
}

export default function NotFoundPage({ onNavigate, onAoiClick }: NotFoundPageProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-16">
      <AoiCelebration
        title={t('notFound.title') || "Oops! Page Not Found"}
        subtitle={t('notFound.subtitle') || "Don't worry, aOi is here to help you find your way back!"}
        className="mb-8"
      />

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          onClick={() => onNavigate?.('home')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9B8FD9] to-[#7BA7BC] text-white rounded-xl hover:shadow-lg hover:shadow-[#9B8FD9]/30 transition-all font-medium hover:scale-105"
        >
          <Home className="w-5 h-5" />
          {t('notFound.homeBtn') || "Go Home"}
        </button>

        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#9B8FD9] text-[#9B8FD9] rounded-xl hover:bg-[#9B8FD9]/10 transition-all font-medium hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('notFound.backBtn') || "Go Back"}
        </button>

        <button
          onClick={onAoiClick}
          className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#D2A44C] text-[#D2A44C] rounded-xl hover:bg-[#D2A44C]/10 transition-all font-medium hover:scale-105"
        >
          <MessageCircle className="w-5 h-5" />
          {t('notFound.askAoiBtn') || "Ask aOi"}
        </button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-slate-500 dark:text-gray-400">
          {t('notFound.errorCode') || "Error Code"}: 404
        </p>
      </div>
    </div>
  );
}
