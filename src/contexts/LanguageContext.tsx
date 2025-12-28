import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'ru' | 'he';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem('tyt-language');
    if (stored === 'en' || stored === 'ru' || stored === 'he') {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to read language from localStorage:', error);
  }

  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ru')) return 'ru';
    if (browserLang.startsWith('he')) return 'he';
  }

  return 'en';
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.academy': 'Academy',
    'nav.knowledge': 'Knowledge',
    'nav.foundation': 'Foundation',
    'nav.transparency': 'Transparency',
    'nav.dashboard': 'Dashboard',

    'hero.title': 'Web3 Mining Platform',
    'hero.subtitle': 'Supporting Children\'s Brain Cancer Research',
    'hero.description': 'NFT miners generate daily BTC rewards while every transaction automatically supports medical research for children with brain tumors.',
    'hero.cta.learn': 'Learn More',
    'hero.cta.start': 'Start Learning',

    'footer.mission': 'TYT Mission',
    'footer.mission.desc': 'Every transaction in our ecosystem supports children\'s brain cancer research through transparent blockchain-based funding.',
    'footer.products': 'Products',
    'footer.resources': 'Resources',
    'footer.legal': 'Legal',

    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.auto': 'Auto (Time-based)',
    'theme.label': 'Theme',

    'lang.label': 'Language',
    'lang.en': 'English',
    'lang.ru': 'Русский',
    'lang.he': 'עברית',

    'stats.activeMiners': 'Active Miners',
    'stats.totalHashrate': 'Total Hashrate',
    'stats.research': 'To Research',
    'stats.community': 'Community',

    'activity.title': 'Recent Activity',
    'activity.empty': 'No recent activity',

    'aoi.greeting': 'Hello! I\'m aOi (葵), your guide through the TYT ecosystem.',
    'aoi.ask': 'Ask me anything...',
    'aoi.send': 'Send',

    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
  },
  ru: {
    'nav.academy': 'Академия',
    'nav.knowledge': 'Знания',
    'nav.foundation': 'Фонд',
    'nav.transparency': 'Прозрачность',
    'nav.dashboard': 'Панель',

    'hero.title': 'Web3 Майнинг Платформа',
    'hero.subtitle': 'Поддержка исследований опухолей мозга у детей',
    'hero.description': 'NFT-майнеры генерируют ежедневные BTC-вознаграждения, а каждая транзакция автоматически поддерживает медицинские исследования для детей с опухолями мозга.',
    'hero.cta.learn': 'Узнать больше',
    'hero.cta.start': 'Начать обучение',

    'footer.mission': 'Миссия TYT',
    'footer.mission.desc': 'Каждая транзакция в нашей экосистеме поддерживает исследования рака мозга у детей через прозрачное блокчейн-финансирование.',
    'footer.products': 'Продукты',
    'footer.resources': 'Ресурсы',
    'footer.legal': 'Юридическое',

    'theme.light': 'Светлая',
    'theme.dark': 'Темная',
    'theme.auto': 'Авто (по времени суток)',
    'theme.label': 'Тема',

    'lang.label': 'Язык',
    'lang.en': 'English',
    'lang.ru': 'Русский',
    'lang.he': 'עברית',

    'stats.activeMiners': 'Активных майнеров',
    'stats.totalHashrate': 'Общий хешрейт',
    'stats.research': 'На исследования',
    'stats.community': 'Сообщество',

    'activity.title': 'Последняя активность',
    'activity.empty': 'Нет последней активности',

    'aoi.greeting': 'Привет! Я aOi (葵), ваш проводник в экосистеме TYT.',
    'aoi.ask': 'Спросите меня о чём угодно...',
    'aoi.send': 'Отправить',

    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успешно',
    'common.cancel': 'Отмена',
    'common.save': 'Сохранить',
  },
  he: {
    'nav.academy': 'אקדמיה',
    'nav.knowledge': 'ידע',
    'nav.foundation': 'קרן',
    'nav.transparency': 'שקיפות',
    'nav.dashboard': 'לוח בקרה',

    'hero.title': 'פלטפורמת כריית Web3',
    'hero.subtitle': 'תמיכה במחקר סרטן מוח בילדים',
    'hero.description': 'כורי NFT מייצרים תגמולי BTC יומיים בעוד שכל עסקה תומכת אוטומטית במחקר רפואי לילדים עם גידולי מוח.',
    'hero.cta.learn': 'למד עוד',
    'hero.cta.start': 'התחל ללמוד',

    'footer.mission': 'משימת TYT',
    'footer.mission.desc': 'כל עסקה במערכת האקולוגית שלנו תומכת במחקר סרטן מוח בילדים באמצעות מימון שקוף מבוסס בלוקצ\'יין.',
    'footer.products': 'מוצרים',
    'footer.resources': 'משאבים',
    'footer.legal': 'משפטי',

    'theme.light': 'בהיר',
    'theme.dark': 'כהה',
    'theme.auto': 'אוטומטי (לפי זמן)',
    'theme.label': 'ערכת נושא',

    'lang.label': 'שפה',
    'lang.en': 'English',
    'lang.ru': 'Русский',
    'lang.he': 'עברית',

    'stats.activeMiners': 'כורים פעילים',
    'stats.totalHashrate': 'Hashrate כולל',
    'stats.research': 'למחקר',
    'stats.community': 'קהילה',

    'activity.title': 'פעילות אחרונה',
    'activity.empty': 'אין פעילות אחרונה',

    'aoi.greeting': 'שלום! אני aOi (葵), המדריכה שלך במערכת TYT.',
    'aoi.ask': 'שאל אותי כל דבר...',
    'aoi.send': 'שלח',

    'common.loading': 'טוען...',
    'common.error': 'שגיאה',
    'common.success': 'הצלחה',
    'common.cancel': 'ביטול',
    'common.save': 'שמור',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('tyt-language', lang);
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');
    } catch (error) {
      console.warn('Failed to save language to localStorage:', error);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
