import { useState } from 'react';
import { Heart, DollarSign, Bitcoin, Sparkles } from 'lucide-react';
import { foundationDataService } from '../services/foundationDataService';
import { useLanguage } from '../contexts/LanguageContext';

interface Currency {
  code: string;
  name: string;
  icon: React.ComponentType<any>;
  rate: number;
}

const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', icon: DollarSign, rate: 1 },
  { code: 'BTC', name: 'Bitcoin', icon: Bitcoin, rate: 0.000011 },
  { code: 'TYT', name: 'TYT Token', icon: Sparkles, rate: 100 },
];

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];

export function DonationWidget() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0]);
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { language } = useLanguage();

  const handlePresetClick = (preset: number) => {
    setAmount(preset);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    } else {
      setAmount(null);
    }
  };

  const handleSubmit = async () => {
    if (!amount || amount <= 0) return;

    setLoading(true);
    try {
      const usdEquivalent = amount / selectedCurrency.rate;
      const donation = await foundationDataService.createDonation({
        amount,
        currency: selectedCurrency.code,
        usd_equivalent: usdEquivalent,
        donor_name: donorName || 'Anonymous',
      });

      if (donation) {
        setSuccess(true);
        setAmount(null);
        setCustomAmount('');
        setDonorName('');
        setTimeout(() => setSuccess(false), 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl p-8 border-2 border-pink-200 dark:border-pink-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {language === 'en' ? 'Make a Donation' : 'Сделать донат'}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {language === 'en'
              ? 'Direct support for children\'s brain cancer research'
              : 'Прямая поддержка исследований рака мозга у детей'}
          </p>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <p className="text-green-700 dark:text-green-300 font-medium">
            {language === 'en'
              ? 'Thank you for your donation! Every contribution makes a difference.'
              : 'Спасибо за ваш вклад! Каждый донат имеет значение.'}
          </p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            {language === 'en' ? 'Select Currency' : 'Выберите валюту'}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {CURRENCIES.map((currency) => {
              const Icon = currency.icon;
              return (
                <button
                  key={currency.code}
                  onClick={() => setSelectedCurrency(currency)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedCurrency.code === currency.code
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-700'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${
                    selectedCurrency.code === currency.code
                      ? 'text-pink-500'
                      : 'text-slate-600 dark:text-slate-400'
                  }`} />
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    {currency.code}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            {language === 'en' ? 'Donation Amount' : 'Сумма доната'}
          </label>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                onClick={() => handlePresetClick(preset)}
                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  amount === preset && !customAmount
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-pink-300 dark:hover:border-pink-700'
                }`}
              >
                {selectedCurrency.code} {preset}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            placeholder={language === 'en' ? 'Custom amount' : 'Другая сумма'}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-pink-500 dark:focus:border-pink-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            {language === 'en' ? 'Your Name (Optional)' : 'Ваше имя (необязательно)'}
          </label>
          <input
            type="text"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            placeholder={language === 'en' ? 'Anonymous' : 'Анонимно'}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-pink-500 dark:focus:border-pink-500 focus:outline-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!amount || amount <= 0 || loading}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? (language === 'en' ? 'Processing...' : 'Обработка...')
            : (language === 'en' ? 'Donate Now' : 'Донатить сейчас')}
        </button>

        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          {language === 'en'
            ? 'All donations are recorded on-chain for transparency'
            : 'Все донаты записываются в блокчейн для прозрачности'}
        </p>
      </div>
    </div>
  );
}
