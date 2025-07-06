import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-8 right-8 z-50 bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl px-5 py-3 shadow-xl hover:bg-white/90 transition-all duration-300 flex items-center gap-3 group hover:shadow-2xl transform hover:-translate-y-0.5"
      aria-label="Toggle language"
    >
      <Globe size={18} className="text-slate-600 group-hover:text-blue-600 transition-colors" />
      <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
        {i18n.language === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
      </span>
    </button>
  );
};