import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full mt-12 py-8 text-center text-gray-600">
      <div className="max-w-4xl mx-auto px-4">
        <p className="mb-2 flex items-center justify-center gap-2">
          {t('footer.madeWith').split('❤️')[0]}
          <Heart className="text-red-500" size={16} fill="currentColor" />
          {t('footer.madeWith').split('❤️')[1]}
        </p>
        <p className="text-sm">
          {t('footer.poweredBy')}{' '}
          <a
            href="https://haveibeenpwned.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
          >
            HaveIBeenPwned
            <ExternalLink size={12} />
          </a>
        </p>
      </div>
    </footer>
  );
};