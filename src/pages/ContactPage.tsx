import { useEffect, useState } from 'react';
import { Mail, Phone, MessageCircle, MapPin, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ContactForm } from '../components/ContactForm';
import { supabase } from '../lib/supabase';
import { AoiAvatar } from '../components/AoiAvatar';

interface ContactInfo {
  primary_email: string;
  support_email: string;
  partnerships_email: string;
  press_email: string;
  primary_phone: string | null;
  telegram_username: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  support_hours_en: string;
  support_hours_ru: string;
}

export default function ContactPage() {
  const { language } = useLanguage();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('foundation_contact_info')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      if (data) setContactInfo(data);
    } catch (err) {
      console.error('Error loading contact info:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <AoiAvatar size="lg" emotion="happy" level="guardian" showKanji={true} />
            <div className="text-left">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {language === 'en' ? 'Contact Us' : 'Свяжитесь с нами'}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {language === 'en'
                  ? 'We\'re here to help and answer any questions'
                  : 'Мы здесь, чтобы помочь и ответить на любые вопросы'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              {language === 'en' ? 'Send us a message' : 'Отправьте нам сообщение'}
            </h2>
            <ContactForm />
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                {language === 'en' ? 'Contact Information' : 'Контактная информация'}
              </h3>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {contactInfo?.primary_email && (
                    <a
                      href={`mailto:${contactInfo.primary_email}`}
                      className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {language === 'en' ? 'General Inquiries' : 'Общие вопросы'}
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {contactInfo.primary_email}
                        </p>
                      </div>
                    </a>
                  )}

                  {contactInfo?.support_email && (
                    <a
                      href={`mailto:${contactInfo.support_email}`}
                      className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {language === 'en' ? 'Technical Support' : 'Техническая поддержка'}
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {contactInfo.support_email}
                        </p>
                      </div>
                    </a>
                  )}

                  {contactInfo?.partnerships_email && (
                    <a
                      href={`mailto:${contactInfo.partnerships_email}`}
                      className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {language === 'en' ? 'Partnerships' : 'Партнёрства'}
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {contactInfo.partnerships_email}
                        </p>
                      </div>
                    </a>
                  )}

                  {contactInfo?.primary_phone && (
                    <a
                      href={`tel:${contactInfo.primary_phone}`}
                      className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Phone className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {language === 'en' ? 'Phone' : 'Телефон'}
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {contactInfo.primary_phone}
                        </p>
                      </div>
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl shadow-xl p-8 border border-blue-200 dark:border-blue-800">
              <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {language === 'en' ? 'Support Hours' : 'Часы поддержки'}
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                {language === 'en' ? contactInfo?.support_hours_en : contactInfo?.support_hours_ru}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {language === 'en'
                  ? 'We typically respond within 24-48 hours'
                  : 'Обычно мы отвечаем в течение 24-48 часов'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
