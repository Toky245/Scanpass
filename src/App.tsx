import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from './components/LanguageToggle';
import { PasswordChecker } from './components/PasswordChecker';
import { EducationSection } from './components/EducationSection';
import './i18n';

function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <LanguageToggle />
      
      <div className="container mx-auto px-4 py-16">
        {/* Modern Logo Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 border-2 border-white rounded-md relative">
                  <div className="absolute inset-1 bg-white rounded-sm opacity-80"></div>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              ScanPass
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            {t('app.tagline')}
          </p>
        </div>

        <PasswordChecker />
        <EducationSection />
      </div>
    </div>
  );
}

export default App;