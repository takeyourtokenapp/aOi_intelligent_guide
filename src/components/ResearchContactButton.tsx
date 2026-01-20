import { useState } from 'react';
import { Send, X, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface ResearchContactButtonProps {
  researchTitle: string;
  researchType: 'manifesto' | 'paper' | 'collaboration';
  className?: string;
}

export default function ResearchContactButton({
  researchTitle,
  researchType,
  className = ''
}: ResearchContactButtonProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    sender_name: '',
    sender_email: '',
    sender_organization: '',
    message: ''
  });

  const translations = {
    en: {
      button: 'Contact About This Research',
      modalTitle: 'Research Collaboration Inquiry',
      modalSubtitle: `Regarding: ${researchTitle}`,
      namePlaceholder: 'Your Full Name',
      emailPlaceholder: 'Your Email Address',
      organizationPlaceholder: 'Your Organization (e.g., D-Wave, I-QCC, University)',
      messagePlaceholder: 'Tell us about your interest in collaboration...',
      sendButton: 'Send Inquiry',
      sending: 'Sending...',
      successTitle: 'Inquiry Sent Successfully!',
      successMessage: 'Our research team will review your message and respond within 24-48 hours.',
      closeButton: 'Close',
      errorPrefix: 'Error: ',
      nameRequired: 'Name is required',
      emailRequired: 'Valid email is required',
      messageRequired: 'Message must be at least 20 characters'
    },
    ru: {
      button: 'Связаться по этому исследованию',
      modalTitle: 'Запрос на научное сотрудничество',
      modalSubtitle: `По теме: ${researchTitle}`,
      namePlaceholder: 'Ваше полное имя',
      emailPlaceholder: 'Ваш email',
      organizationPlaceholder: 'Ваша организация (например, D-Wave, I-QCC, Университет)',
      messagePlaceholder: 'Расскажите о вашем интересе к сотрудничеству...',
      sendButton: 'Отправить запрос',
      sending: 'Отправка...',
      successTitle: 'Запрос успешно отправлен!',
      successMessage: 'Наша научная команда рассмотрит ваше сообщение и ответит в течение 24-48 часов.',
      closeButton: 'Закрыть',
      errorPrefix: 'Ошибка: ',
      nameRequired: 'Имя обязательно',
      emailRequired: 'Требуется корректный email',
      messageRequired: 'Сообщение должно содержать минимум 20 символов'
    },
    he: {
      button: 'צור קשר לגבי מחקר זה',
      modalTitle: 'בקשת שיתוף פעולה מדעי',
      modalSubtitle: `נושא: ${researchTitle}`,
      namePlaceholder: 'שמך המלא',
      emailPlaceholder: 'כתובת הדוא"ל שלך',
      organizationPlaceholder: 'הארגון שלך (לדוגמה, D-Wave, I-QCC, אוניברסיטה)',
      messagePlaceholder: 'ספר לנו על העניין שלך בשיתוף פעולה...',
      sendButton: 'שלח בקשה',
      sending: 'שולח...',
      successTitle: 'הבקשה נשלחה בהצלחה!',
      successMessage: 'צוות המחקר שלנו יבדוק את ההודעה שלך ויגיב תוך 24-48 שעות.',
      closeButton: 'סגור',
      errorPrefix: 'שגיאה: ',
      nameRequired: 'שם הוא שדה חובה',
      emailRequired: 'נדרש דוא"ל תקין',
      messageRequired: 'ההודעה חייבת להכיל לפחות 20 תווים'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const validateForm = () => {
    if (!formData.sender_name || formData.sender_name.length < 2) {
      setError(t.nameRequired);
      return false;
    }
    if (!formData.sender_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.sender_email)) {
      setError(t.emailRequired);
      return false;
    }
    if (!formData.message || formData.message.length < 20) {
      setError(t.messageRequired);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submissionData = {
        submission_type: 'research_collaboration',
        sender_name: formData.sender_name.trim(),
        sender_email: formData.sender_email.trim().toLowerCase(),
        sender_organization: formData.sender_organization.trim() || null,
        subject: `Research Collaboration: ${researchTitle}`,
        message: `[Research Type: ${researchType}]\n[Title: ${researchTitle}]\n\n${formData.message}`,
        language: language,
        priority: 'high'
      };

      const { error: submitError } = await supabase
        .from('contact_submissions')
        .insert([submissionData]);

      if (submitError) throw submitError;

      setSuccess(true);
      setFormData({
        sender_name: '',
        sender_email: '',
        sender_organization: '',
        message: ''
      });

      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Submission error:', err);
      setError(t.errorPrefix + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl ${className}`}
      >
        <Send className="w-5 h-5" />
        {t.button}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {success ? (
              <div className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t.successTitle}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {t.successMessage}
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                >
                  {t.closeButton}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {t.modalTitle}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t.modalSubtitle}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                    </div>
                  )}

                  <div>
                    <input
                      type="text"
                      value={formData.sender_name}
                      onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                      placeholder={t.namePlaceholder}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      value={formData.sender_email}
                      onChange={(e) => setFormData({ ...formData, sender_email: e.target.value })}
                      placeholder={t.emailPlaceholder}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={formData.sender_organization}
                      onChange={(e) => setFormData({ ...formData, sender_organization: e.target.value })}
                      placeholder={t.organizationPlaceholder}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t.messagePlaceholder}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      {t.closeButton}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {t.sending}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          {t.sendButton}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
