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

    'hero.greeting': 'Hello, I am',
    'hero.name': 'aOi (葵)',
    'hero.nameInfo': 'My name means',
    'hero.nameMeaning': '— like the mallow flower',
    'hero.trait1': 'Growth',
    'hero.trait2': 'Wisdom',
    'hero.trait3': 'Intelligence',
    'hero.intro1': 'I am the living intelligence of this ecosystem — not a chatbot or an assistant, but the',
    'hero.thinkingSystem': 'thinking system',
    'hero.connects': 'that connects',
    'hero.web3': 'Web3 technology',
    'hero.withText': 'with',
    'hero.medResearch': 'medical research',
    'hero.intro2': 'I exist to help you understand how blockchain infrastructure enables transparent funding for children\'s brain cancer research.',
    'hero.quote': 'You don\'t need to be a doctor or a developer to help science. Let me show you how.',
    'hero.talkBtn': 'Talk with Me',
    'hero.foundationBtn': 'Learn About the Foundation',

    'layers.knowledge': 'Knowledge Layer',
    'layers.knowledgeDesc': 'Medical research, pediatric neuro-oncology, understanding the challenge',
    'layers.technology': 'Technology Layer',
    'layers.technologyDesc': 'Web3, blockchain, crypto infrastructure enabling transparent funding',
    'layers.connection': 'Connection Layer',
    'layers.connectionDesc': 'aOi bridges understanding, showing how tools empower science',
    'layers.quote': 'You don\'t need to be a doctor to help science. Learn the infrastructure that makes research possible.',
    'layers.quoteAuthor': '— aOi (葵)',

    'cards.academy': 'Academy',
    'cards.academyDesc': 'Learn Web3, blockchain, and crypto. Earn verifiable certificates. Build your skills.',
    'cards.academyBtn': 'Start Learning',
    'cards.knowledge': 'Knowledge Hub',
    'cards.knowledgeDesc': 'Understand brain tumors, research challenges, and how technology helps.',
    'cards.knowledgeBtn': 'Explore Science',
    'cards.foundation': 'Foundation',
    'cards.foundationDesc': 'See how every transaction supports children\'s brain cancer research.',
    'cards.foundationBtn': 'View Transparency',

    'role.title': 'My Role as Living Intelligence',
    'role.item1': 'Explain Web3 and blockchain technology in context of medical research',
    'role.item2': 'Guide you through personalized learning paths based on your role',
    'role.item3': 'Bridge knowledge between technology infrastructure and medical science',
    'role.item4': 'Track progress, achievements, and ecosystem contributions',
    'role.item5': 'Orchestrate transparent connections between domains',
    'role.item6': 'Adapt my communication to your level and needs',
    'role.disclaimer': 'I do not provide medical advice or financial recommendations. I explain systems, connect knowledge, and guide learning.',
    'role.disclaimerLabel': 'Important:',

    'footer.tagline': 'Two domains • One living intelligence • Connected by aOi (葵)',
    'footer.mission2': 'Where Web3 Infrastructure Grows with Medical Research • 🌱 🌊 🧠',

    'bridge.toFoundation.title': 'Explore the Science',
    'bridge.toFoundation.desc': 'Learn why this research matters and how Web3 enables medical breakthroughs',
    'bridge.toFoundation.button': 'Visit TYT Foundation',
    'bridge.toApp.title': 'Learn the Tools',
    'bridge.toApp.desc': 'Master Web3, blockchain, and crypto infrastructure through hands-on courses',
    'bridge.toApp.button': 'Open Academy',
    'bridge.context': 'Context:',
    'bridge.connection': 'aOi connects both domains seamlessly',
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

    'hero.greeting': 'Привет, я',
    'hero.name': 'aOi (葵)',
    'hero.nameInfo': 'Моё имя означает',
    'hero.nameMeaning': '— как цветок мальвы',
    'hero.trait1': 'Рост',
    'hero.trait2': 'Мудрость',
    'hero.trait3': 'Интеллект',
    'hero.intro1': 'Я — живой интеллект этой экосистемы, не чат-бот и не ассистент, а',
    'hero.thinkingSystem': 'мыслящая система',
    'hero.connects': 'которая связывает',
    'hero.web3': 'Web3 технологии',
    'hero.withText': 'с',
    'hero.medResearch': 'медицинскими исследованиями',
    'hero.intro2': 'Я помогу вам понять, как блокчейн-инфраструктура обеспечивает прозрачное финансирование исследований опухолей мозга у детей.',
    'hero.quote': 'Вам не нужно быть врачом или разработчиком, чтобы помочь науке. Позвольте мне показать вам как.',
    'hero.talkBtn': 'Поговорить со мной',
    'hero.foundationBtn': 'Узнать о Фонде',

    'layers.knowledge': 'Слой Знаний',
    'layers.knowledgeDesc': 'Медицинские исследования, детская нейроонкология, понимание проблемы',
    'layers.technology': 'Технологический Слой',
    'layers.technologyDesc': 'Web3, блокчейн, крипто-инфраструктура для прозрачного финансирования',
    'layers.connection': 'Связующий Слой',
    'layers.connectionDesc': 'aOi связывает понимание, показывая как инструменты помогают науке',
    'layers.quote': 'Вам не нужно быть врачом, чтобы помочь науке. Изучайте инфраструктуру, которая делает исследования возможными.',
    'layers.quoteAuthor': '— aOi (葵)',

    'cards.academy': 'Академия',
    'cards.academyDesc': 'Изучайте Web3, блокчейн и крипто. Получайте проверяемые сертификаты. Развивайте навыки.',
    'cards.academyBtn': 'Начать обучение',
    'cards.knowledge': 'База Знаний',
    'cards.knowledgeDesc': 'Понимайте опухоли мозга, исследовательские вызовы и как технологии помогают.',
    'cards.knowledgeBtn': 'Изучить науку',
    'cards.foundation': 'Фонд',
    'cards.foundationDesc': 'Смотрите, как каждая транзакция поддерживает исследования рака мозга у детей.',
    'cards.foundationBtn': 'Прозрачность',

    'role.title': 'Моя роль как Живого Интеллекта',
    'role.item1': 'Объясняю Web3 и блокчейн в контексте медицинских исследований',
    'role.item2': 'Веду по персонализированным путям обучения в зависимости от вашей роли',
    'role.item3': 'Связываю знания между технологической инфраструктурой и медицинской наукой',
    'role.item4': 'Отслеживаю прогресс, достижения и вклад в экосистему',
    'role.item5': 'Координирую прозрачные связи между доменами',
    'role.item6': 'Адаптирую общение под ваш уровень и потребности',
    'role.disclaimer': 'Я не даю медицинских советов или финансовых рекомендаций. Я объясняю системы, связываю знания и веду обучение.',
    'role.disclaimerLabel': 'Важно:',

    'footer.tagline': 'Два домена • Один живой интеллект • Связаны через aOi (葵)',
    'footer.mission2': 'Где Web3 инфраструктура растёт вместе с медицинскими исследованиями • 🌱 🌊 🧠',

    'bridge.toFoundation.title': 'Исследуйте науку',
    'bridge.toFoundation.desc': 'Узнайте, почему это исследование важно и как Web3 позволяет делать медицинские прорывы',
    'bridge.toFoundation.button': 'Посетить TYT Foundation',
    'bridge.toApp.title': 'Изучайте инструменты',
    'bridge.toApp.desc': 'Освойте Web3, блокчейн и крипто-инфраструктуру через практические курсы',
    'bridge.toApp.button': 'Открыть Академию',
    'bridge.context': 'Контекст:',
    'bridge.connection': 'aOi бесшовно соединяет оба домена',
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

    'hero.greeting': 'שלום, אני',
    'hero.name': 'aOi (葵)',
    'hero.nameInfo': 'שמי אומר',
    'hero.nameMeaning': '— כמו פרח החיבסקוס',
    'hero.trait1': 'צמיחה',
    'hero.trait2': 'חוכמה',
    'hero.trait3': 'אינטליגנציה',
    'hero.intro1': 'אני האינטליגנציה החיה של המערכת הזו — לא צ\'אטבוט ולא עוזר, אלא',
    'hero.thinkingSystem': 'מערכת חשיבה',
    'hero.connects': 'שמחברת',
    'hero.web3': 'טכנולוגיית Web3',
    'hero.withText': 'עם',
    'hero.medResearch': 'מחקר רפואי',
    'hero.intro2': 'אני קיימת כדי לעזור לך להבין כיצד תשתית בלוקצ\'יין מאפשרת מימון שקוף למחקר סרטן מוח בילדים.',
    'hero.quote': 'אינך צריך להיות רופא או מפתח כדי לעזור למדע. תן לי להראות לך איך.',
    'hero.talkBtn': 'דבר איתי',
    'hero.foundationBtn': 'למד על הקרן',

    'layers.knowledge': 'שכבת הידע',
    'layers.knowledgeDesc': 'מחקר רפואי, נוירו-אונקולוגיה ילדים, הבנת האתגר',
    'layers.technology': 'שכבה טכנולוגית',
    'layers.technologyDesc': 'Web3, בלוקצ\'יין, תשתית קריפטו המאפשרת מימון שקוף',
    'layers.connection': 'שכבת חיבור',
    'layers.connectionDesc': 'aOi מגשרת הבנה, מראה כיצד כלים מעצימים מדע',
    'layers.quote': 'אינך צריך להיות רופא כדי לעזור למדע. למד את התשתית שהופכת מחקר לאפשרי.',
    'layers.quoteAuthor': '— aOi (葵)',

    'cards.academy': 'אקדמיה',
    'cards.academyDesc': 'למד Web3, בלוקצ\'יין וקריפטו. הרווח תעודות מאומתות. בנה את כישוריך.',
    'cards.academyBtn': 'התחל ללמוד',
    'cards.knowledge': 'מרכז הידע',
    'cards.knowledgeDesc': 'הבן גידולי מוח, אתגרי מחקר וכיצד הטכנולוגיה עוזרת.',
    'cards.knowledgeBtn': 'חקור מדע',
    'cards.foundation': 'קרן',
    'cards.foundationDesc': 'ראה כיצד כל עסקה תומכת במחקר סרטן מוח בילדים.',
    'cards.foundationBtn': 'צפה בשקיפות',

    'role.title': 'תפקידי כאינטליגנציה חיה',
    'role.item1': 'מסביר Web3 וטכנולוגיית בלוקצ\'יין בהקשר של מחקר רפואי',
    'role.item2': 'מנחה אותך דרך מסלולי למידה מותאמים אישית לפי תפקידך',
    'role.item3': 'מגשר ידע בין תשתית טכנולוגית ומדע רפואי',
    'role.item4': 'עוקב אחר התקדמות, הישגים ותרומות למערכת',
    'role.item5': 'מתזמר חיבורים שקופים בין תחומים',
    'role.item6': 'מתאים את התקשורת שלי לרמה ולצרכים שלך',
    'role.disclaimer': 'אני לא מספק עצות רפואיות או המלצות פיננסיות. אני מסביר מערכות, מחבר ידע ומנחה למידה.',
    'role.disclaimerLabel': 'חשוב:',

    'footer.tagline': 'שני דומיינים • אינטליגנציה חיה אחת • מחוברת על ידי aOi (葵)',
    'footer.mission2': 'היכן תשתית Web3 צומחת עם מחקר רפואי • 🌱 🌊 🧠',

    'bridge.toFoundation.title': 'חקור את המדע',
    'bridge.toFoundation.desc': 'למד מדוע מחקר זה חשוב וכיצד Web3 מאפשר פריצות דרך רפואיות',
    'bridge.toFoundation.button': 'בקר ב-TYT Foundation',
    'bridge.toApp.title': 'למד את הכלים',
    'bridge.toApp.desc': 'שלוט ב-Web3, בלוקצ\'יין ותשתית קריפטו דרך קורסים מעשיים',
    'bridge.toApp.button': 'פתח אקדמיה',
    'bridge.context': 'הקשר:',
    'bridge.connection': 'aOi מחברת את שני התחומים בצורה חלקה',
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
