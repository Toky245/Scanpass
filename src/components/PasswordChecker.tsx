import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Eye, EyeOff, AlertTriangle, CheckCircle, Loader2, Lock } from 'lucide-react';
import CryptoJS from 'crypto-js';

interface CheckResult {
  isCompromised: boolean;
  count?: number;
  error?: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  bgColor: string;
}

export const PasswordChecker: React.FC = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  const hashPassword = useCallback((password: string): string => {
    return CryptoJS.SHA1(password).toString().toUpperCase();
  }, []);

  // Password strength calculation
  const passwordStrength = useMemo((): PasswordStrength => {
    if (!password) {
      return { score: 0, label: '', color: '', bgColor: '' };
    }

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      longLength: password.length >= 12,
      veryLongLength: password.length >= 16
    };

    // Common weak patterns
    const weakPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /abc123/i,
      /111111/,
      /000000/,
      /admin/i,
      /letmein/i
    ];

    const hasWeakPattern = weakPatterns.some(pattern => pattern.test(password));

    // Calculate score
    if (checks.length) score += 1;
    if (checks.lowercase) score += 1;
    if (checks.uppercase) score += 1;
    if (checks.numbers) score += 1;
    if (checks.symbols) score += 1;
    if (checks.longLength) score += 1;
    if (checks.veryLongLength) score += 1;

    // Penalize weak patterns
    if (hasWeakPattern) score = Math.max(0, score - 2);

    // Determine strength level
    let label: string;
    let color: string;
    let bgColor: string;

    if (score <= 2) {
      label = t('strength.veryWeak');
      color = 'text-red-600';
      bgColor = 'bg-red-500';
    } else if (score <= 4) {
      label = t('strength.weak');
      color = 'text-orange-600';
      bgColor = 'bg-orange-500';
    } else if (score <= 5) {
      label = t('strength.moderate');
      color = 'text-yellow-600';
      bgColor = 'bg-yellow-500';
    } else {
      label = t('strength.strong');
      color = 'text-green-600';
      bgColor = 'bg-green-500';
    }

    return { score: Math.min(score, 7), label, color, bgColor };
  }, [password, t]);

  const checkPassword = useCallback(async () => {
    if (!password.trim()) return;

    setIsChecking(true);
    setResult(null);
    setHasChecked(false);

    try {
      // Hash the password
      const hash = hashPassword(password);
      const prefix = hash.substring(0, 5);
      const suffix = hash.substring(5);

      // Call HIBP API with k-Anonymity
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      
      if (!response.ok) {
        throw new Error('Failed to check password');
      }

      const data = await response.text();
      const lines = data.split('\n');
      
      // Look for our suffix in the results
      let isCompromised = false;
      let count = 0;

      for (const line of lines) {
        const [hashSuffix, occurrences] = line.split(':');
        if (hashSuffix === suffix) {
          isCompromised = true;
          count = parseInt(occurrences, 10);
          break;
        }
      }

      setResult({ isCompromised, count });
      setHasChecked(true);
    } catch (error) {
      setResult({ isCompromised: false, error: 'Failed to check password' });
      setHasChecked(true);
    } finally {
      setIsChecking(false);
    }
  }, [password, hashPassword]);

  const clearPassword = () => {
    setPassword('');
    setResult(null);
    setHasChecked(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkPassword();
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Input */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('form.placeholder')}
                className="w-full pl-12 pr-16 py-4 bg-slate-50/80 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 text-slate-700 placeholder-slate-400 text-base md:text-lg"
                disabled={isChecking}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100/50"
                disabled={isChecking}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">{t('strength.label')}</span>
                  <span className={`font-semibold ${passwordStrength.color}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${passwordStrength.bgColor}`}
                    style={{ width: `${(passwordStrength.score / 7) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <Shield size={16} className="text-blue-500" />
              <span className="text-center">{t('form.privacyNote')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={!password.trim() || isChecking}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isChecking ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>{t('form.checking')}</span>
                </>
              ) : (
                <span>{t('form.checkButton')}</span>
              )}
            </button>
            {password && (
              <button
                type="button"
                onClick={clearPassword}
                className="sm:w-auto w-full px-6 py-4 text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 rounded-2xl transition-all duration-300 font-medium"
              >
                {t('form.clear')}
              </button>
            )}
          </div>
        </form>

        {/* Results Section */}
        {hasChecked && result && (
          <div className="mt-6 animate-fadeIn">
            {result.error ? (
              <div className="bg-red-50/80 border border-red-200/60 rounded-2xl p-6 text-center backdrop-blur-sm">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-red-500" size={24} />
                </div>
                <p className="text-red-800 font-medium">{t('results.error')}</p>
              </div>
            ) : result.isCompromised ? (
              <div className="bg-red-50/80 border border-red-200/60 rounded-2xl p-6 text-center backdrop-blur-sm">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-red-500" size={24} />
                </div>
                <p className="text-red-800 font-semibold text-lg mb-2">
                  {t('results.compromised', { count: result.count?.toLocaleString() })}
                </p>
                <p className="text-red-600 text-sm md:text-base">{t('results.compromisedAdvice')}</p>
              </div>
            ) : (
              <div className="bg-green-50/80 border border-green-200/60 rounded-2xl p-6 text-center backdrop-blur-sm">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-green-500" size={24} />
                </div>
                <p className="text-green-800 font-semibold text-lg mb-2">{t('results.safe')}</p>
                <p className="text-green-600 text-sm md:text-base">{t('results.safeAdvice')}</p>
              </div>
            )}
          </div>
        )}

        {!hasChecked && !isChecking && (
          <div className="mt-6 p-6 bg-slate-50/60 rounded-2xl text-center backdrop-blur-sm">
            <p className="text-slate-600 text-sm md:text-base">{t('results.enterPassword')}</p>
          </div>
        )}
      </div>
    </div>
  );
};