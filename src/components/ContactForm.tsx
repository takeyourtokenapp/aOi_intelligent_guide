import { useState } from 'react';
import { Send, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

type SubmissionType =
  | 'general_inquiry'
  | 'support_request'
  | 'partnership_proposal'
  | 'donation_inquiry'
  | 'research_collaboration'
  | 'media_inquiry'
  | 'volunteer'
  | 'technical_issue'
  | 'feedback';

interface ContactFormProps {
  defaultType?: SubmissionType;
  onSuccess?: () => void;
}

export function ContactForm({ defaultType = 'general_inquiry', onSuccess }: ContactFormProps) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    submission_type: defaultType,
    sender_name: '',
    sender_email: '',
    sender_organization: '',
    sender_phone: '',
    subject: '',
    message: '',
    language: language,
  });

  const submissionTypes: { value: SubmissionType; label_en: string; label_ru: string }[] = [
    { value: 'general_inquiry', label_en: 'General Inquiry', label_ru: 'Общий вопрос' },
    { value: 'support_request', label_en: 'Support Request', label_ru: 'Запрос поддержки' },
    { value: 'partnership_proposal', label_en: 'Partnership Proposal', label_ru: 'Предложение о партнёрстве' },
    { value: 'donation_inquiry', label_en: 'Donation Inquiry', label_ru: 'Вопрос о пожертвовании' },
    { value: 'research_collaboration', label_en: 'Research Collaboration', label_ru: 'Исследовательское сотрудничество' },
    { value: 'media_inquiry', label_en: 'Media Inquiry', label_ru: 'Медиа-запрос' },
    { value: 'volunteer', label_en: 'Volunteer', label_ru: 'Волонтёрство' },
    { value: 'technical_issue', label_en: 'Technical Issue', label_ru: 'Техническая проблема' },
    { value: 'feedback', label_en: 'Feedback', label_ru: 'Обратная связь' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Client-side validation
    if (formData.message.trim().length < 3) {
      setError(
        language === 'en'
          ? 'Message must be at least 3 characters long.'
          : 'Сообщение должно содержать минимум 3 символа.'
      );
      setLoading(false);
      return;
    }

    try {
      const { data: insertedData, error: submitError } = await supabase
        .from('contact_submissions')
        .insert([{
          ...formData,
          ip_address: window.location.hostname,
          user_agent: navigator.userAgent,
          referrer_url: document.referrer,
        }])
        .select()
        .single();

      if (submitError) {
        console.error('Submit error:', submitError);
        throw new Error(
          submitError.message.includes('policy')
            ? language === 'en'
              ? 'Please check all fields are filled correctly.'
              : 'Пожалуйста, проверьте правильность заполнения всех полей.'
            : submitError.message
        );
      }

      // Call edge function for notifications
      try {
        await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact-notification`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
              type: 'INSERT',
              table: 'contact_submissions',
              record: insertedData,
              old_record: null
            })
          }
        );
      } catch (notificationError) {
        console.error('Notification failed:', notificationError);
        // Don't fail the whole submission if notifications fail
      }

      setSuccess(true);
      setFormData({
        submission_type: defaultType,
        sender_name: '',
        sender_email: '',
        sender_organization: '',
        sender_phone: '',
        subject: '',
        message: '',
        language: language,
      });

      if (onSuccess) onSuccess();

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Error submitting contact form:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(
        errorMessage.includes('check all fields')
          ? errorMessage
          : language === 'en'
          ? 'Failed to send message. Please try again or email us directly.'
          : 'Не удалось отправить сообщение. Попробуйте ещё раз или напишите нам напрямую.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3">
          <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
              {language === 'en' ? 'Message Sent!' : 'Сообщение отправлено!'}
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              {language === 'en'
                ? 'Thank you for contacting us. We will respond within 24-48 hours.'
                : 'Спасибо за обращение. Мы ответим в течение 24-48 часов.'}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {language === 'en' ? 'Inquiry Type' : 'Тип обращения'}
        </label>
        <select
          required
          value={formData.submission_type}
          onChange={(e) => setFormData({ ...formData, submission_type: e.target.value as SubmissionType })}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
        >
          {submissionTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {language === 'en' ? type.label_en : type.label_ru}
            </option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Your Name' : 'Ваше имя'} *
          </label>
          <input
            type="text"
            required
            value={formData.sender_name}
            onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Email Address' : 'Email'} *
          </label>
          <input
            type="email"
            required
            value={formData.sender_email}
            onChange={(e) => setFormData({ ...formData, sender_email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Organization (optional)' : 'Организация (опционально)'}
          </label>
          <input
            type="text"
            value={formData.sender_organization}
            onChange={(e) => setFormData({ ...formData, sender_organization: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Phone (optional)' : 'Телефон (опционально)'}
          </label>
          <input
            type="tel"
            value={formData.sender_phone}
            onChange={(e) => setFormData({ ...formData, sender_phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {language === 'en' ? 'Subject' : 'Тема'} *
        </label>
        <input
          type="text"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {language === 'en' ? 'Message' : 'Сообщение'} *
        </label>
        <textarea
          required
          rows={6}
          minLength={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none"
          placeholder={language === 'en' ? 'Minimum 3 characters...' : 'Минимум 3 символа...'}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>{language === 'en' ? 'Sending...' : 'Отправка...'}</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>{language === 'en' ? 'Send Message' : 'Отправить сообщение'}</span>
          </>
        )}
      </button>

      <p className="text-xs text-center text-slate-500 dark:text-slate-400">
        {language === 'en'
          ? 'By submitting this form, you agree to our privacy policy.'
          : 'Отправляя эту форму, вы соглашаетесь с нашей политикой конфиденциальности.'}
      </p>
    </form>
  );
}
