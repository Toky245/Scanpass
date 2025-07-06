import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Hash, Search } from 'lucide-react';

export const EducationSection: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: <Hash className="text-blue-600" size={24} />,
      text: t('education.step1')
    },
    {
      icon: <Shield className="text-green-600" size={24} />,
      text: t('education.step2')
    },
    {
      icon: <Search className="text-purple-600" size={24} />,
      text: t('education.step3')
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto mt-16">
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 md:p-12">
        <h3 className="text-3xl font-bold text-slate-800 mb-12 text-center">
          {t('education.howItWorks')}
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="bg-slate-50/80 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:bg-white/90 transition-all duration-300 shadow-lg">
                {step.icon}
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/40 rounded-2xl p-8 backdrop-blur-sm">
          <p className="text-blue-800 text-center font-medium text-lg">
            {t('education.privacy')}
          </p>
        </div>
      </div>
    </div>
  );
};