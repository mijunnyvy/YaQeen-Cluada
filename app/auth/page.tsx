'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, Lock, User, Eye, EyeOff, Sun, Moon, Sparkles, BookOpen, Compass, Clock, Users, AlertCircle } from 'lucide-react';

// Types
type FloatingBall = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
};

// --- Reusable & Memoized Components ---

// Header Navigation
interface AuthHeaderProps {
  onBack: () => void;
  onSkip: () => void;
  onToggleTheme: () => void;
  isDark: boolean;
  themeClasses: any; // You might want to define a more specific type for themeClasses
}

const AuthHeader = React.memo(({ onBack, onSkip, onToggleTheme, isDark, themeClasses }: AuthHeaderProps) => (
  <nav className="absolute top-6 left-0 right-0 z-10 flex justify-between items-center px-6">
    <div
      className="flex items-center space-x-3 cursor-pointer hover:scale-110 transition-transform duration-300"
      onClick={onBack}
    >
      <div className={`text-2xl ${themeClasses.accent} transition-colors duration-700 font-bold`}>
        <Moon size={24} />
      </div>
      <span className={`text-xl font-bold ${themeClasses.text}`}>YaQeen</span>
    </div>
    <div className="flex items-center space-x-3">
      <button
        onClick={onSkip}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${themeClasses.skipButton}`}
      >
        Skip
      </button>
      <button
        onClick={onToggleTheme}
        className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${themeClasses.toggle} border-2`}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
  </nav>
));

AuthHeader.displayName = 'AuthHeader';

// Background Animations
interface BackgroundEffectsProps {
  isDark: boolean;
  themeClasses: {
    background: string;
    text: string;
    subtitle: string;
    accent: string;
    button: string;
    secondaryButton: string;
    googleButton: string;
    skipButton: string;
    toggle: string;
    toggleActive: string;
    toggleInactive: string;
    toggleSection: string;
    inputField: string;
    featureCard: string;
    featureCardIcon: string;
    featureCardText: string;
    featureCardDescription: string;
    modalBackground: string;
    modalText: string;
    modalButton: string;
    modalSecondaryButton: string;
  };
}

const BackgroundEffects = React.memo(({ isDark, themeClasses }: BackgroundEffectsProps) => {
  const [balls, setBalls] = useState<FloatingBall[]>([]);
const animationFrameId = useRef<number | undefined>(undefined);

  useEffect(() => {
    const initialBalls: FloatingBall[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 8 + 3,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    setBalls(initialBalls);
  }, []);

  const animateBalls = useCallback(() => {
    setBalls(prevBalls =>
      prevBalls.map(ball => ({
        ...ball,
        x: (ball.x + ball.vx + 100) % 100,
        y: (ball.y + ball.vy + 100) % 100,
      }))
    );
    animationFrameId.current = requestAnimationFrame(animateBalls);
  }, []);

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(animateBalls);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animateBalls]);

  return (
    <>
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'opacity-10' : 'opacity-5'}`}
        style={{
          backgroundImage: `
            linear-gradient(${isDark ? '#10b981' : '#34d399'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? '#10b981' : '#34d399'} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      {balls.map(ball => (
        <div
          key={ball.id}
          className={`absolute rounded-full ${isDark ? 'bg-emerald-500' : 'bg-emerald-400'} transition-colors duration-700`}
          style={{
            left: `${ball.x}%`,
            top: `${ball.y}%`,
            width: `${ball.size}px`,
            height: `${ball.size}px`,
            opacity: ball.opacity,
            filter: 'blur(0.5px)',
            boxShadow: isDark ? '0 0 15px rgba(16, 185, 129, 0.25)' : '0 0 15px rgba(52, 211, 153, 0.25)',
          }}
        />
      ))}
       <div className={`absolute top-1/4 left-1/4 w-64 h-64 ${isDark ? 'bg-emerald-500' : 'bg-emerald-400'} rounded-full opacity-10 blur-3xl animate-pulse`} />
       <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 ${isDark ? 'bg-teal-500' : 'bg-teal-400'} rounded-full opacity-5 blur-3xl animate-pulse`} />
    </>
  );
});


BackgroundEffects.displayName = 'BackgroundEffects';

// Reusable Input Field
interface InputFieldProps {
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required: boolean;
  Icon: React.ElementType;
  themeClasses: any; // You might want to define a more specific type for themeClasses
  children?: React.ReactNode;
}

const InputField = React.memo(({ name, type, value, onChange, placeholder, required, Icon, themeClasses, children = null }: InputFieldProps) => (
    <div>
      <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
        {placeholder.replace('Enter your ', '')}
      </label>
      <div className="relative">
        <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${themeClasses.subtitle}`} />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${themeClasses.input}`}
          placeholder={placeholder}
          required={required}
        />
        {children}
      </div>
    </div>
));
InputField.displayName = 'InputField';

// Feature Limitation Item in Modal
interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  themeClasses: any;
  colorClass: { bg: string; border: string; text: string; };
}

const FeatureItem = React.memo(({ icon, title, description, themeClasses, colorClass }: FeatureItemProps) => (
    <div className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${colorClass.border} hover:shadow-lg`}>
        <div className={`${colorClass.text} p-3 rounded-xl bg-opacity-10 bg-current`}>
            {icon}
        </div>
        <div className="flex-1">
            <p className={`font-semibold ${themeClasses.text} mb-1`}>{title}</p>
            <p className={`text-sm ${themeClasses.subtitle}`}>{description}</p>
        </div>
    </div>
));
FeatureItem.displayName = 'FeatureItem';

const featureList = [
    { icon: <Sparkles className="w-6 h-6" />, title: 'AI Islamic Helper', description: 'Personalized guidance and answers.', colorClass: { bg: 'bg-green-50/50 dark:bg-green-900/20', border: 'border-green-200/50 dark:border-green-800/50', text: 'text-emerald-500' } },
    { icon: <BookOpen className="w-6 h-6" />, title: 'Progress Tracking', description: 'Save achievements and course progress.', colorClass: { bg: 'bg-green-50/50 dark:bg-green-900/20', border: 'border-green-200/50 dark:border-green-800/50', text: 'text-blue-500' } },
    { icon: <Compass className="w-6 h-6" />, title: 'Personalized Content', description: 'Custom learning paths and bookmarks.', colorClass: { bg: 'bg-green-50/50 dark:bg-green-900/20', border: 'border-green-200/50 dark:border-green-800/50', text: 'text-purple-500' } },
    { icon: <Clock className="w-6 h-6" />, title: 'Prayer Times & Reminders', description: 'Location-based prayer schedules.', colorClass: { bg: 'bg-green-50/50 dark:bg-green-900/20', border: 'border-green-200/50 dark:border-green-800/50', text: 'text-indigo-500' } },
    { icon: <Users className="w-6 h-6" />, title: 'Community Features', description: 'Engage in discussion forums.', colorClass: { bg: 'bg-green-50/50 dark:bg-green-900/20', border: 'border-green-200/50 dark:border-green-800/50', text: 'text-teal-500' } },
];

// Skip Modal
interface SkipModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  themeClasses: any;
}

const SkipModal = ({ isOpen, onConfirm, onCancel, themeClasses }: SkipModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`w-full max-h-[800px] max-w-[500px] rounded-3xl border ${themeClasses.card} shadow-2xl p-8 transform transition-all duration-300 scale-100 animate-fadeIn`}>
                <div className="text-center mb-8">
                    <div className={`inline-flex p-4 rounded-2xl ${themeClasses.accent} bg-opacity-10 mb-4`}>
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h4 className={`text-2xl font-bold ${themeClasses.text} mb-3`}>Browse as Guest?</h4>
                    <p className={`text-base ${themeClasses.subtitle}`}>Please note the following limitations as a guest:</p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] border-yellow-200/50 dark:border-yellow-800/50`}>
                        <div className="text-yellow-00 p-3 rounded-xl bg-opacity-10 bg-current">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <p className={`font-semibold ${themeClasses.text} mb-1`}>Limited Access</p>
                            <p className={`text-sm ${themeClasses.subtitle}`}>No progress will be saved and some tools may be disabled</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={onCancel}
                        className={`group w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 ${themeClasses.button} relative`}
                    >
                        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                            Recommended
                        </div>
                        <span className="flex items-center justify-center space-x-2">
                            <span>Create Account</span>
                            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                    </button>

                    <button
                        onClick={onConfirm}
                        className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500/30 ${themeClasses.secondaryButton}`}
                    >
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
    );
}

// Remove displayName since SkipModal is already declared

// --- Main Component ---

const YaQeenAuthPage = () => {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  
  // Effect to handle client-side mounting for theme
  useEffect(() => {
    // On mount, check system preference and set theme
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, []);

  // Memoize theme classes to avoid recalculation on every render
  const themeClasses = useMemo(() => ({
    background: isDark ? 'bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900' : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50',
    text: isDark ? 'text-white' : 'text-gray-900',
    subtitle: isDark ? 'text-gray-300' : 'text-gray-600',
    accent: isDark ? 'text-emerald-400' : 'text-emerald-600',
    button: isDark ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg shadow-emerald-500/25' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30',
    secondaryButton: isDark ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300',
    googleButton: isDark ? 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-300' : 'bg-gray-900 hover:bg-gray-800 text-white border border-gray-700',
    skipButton: isDark ? 'text-gray-400 hover:text-gray-300 border border-gray-600 hover:border-gray-500' : 'text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400',
    toggle: isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-200 border-gray-300 text-gray-900',
    grid: isDark ? 'opacity-10' : 'opacity-5',
    ball: isDark ? 'bg-emerald-500' : 'bg-emerald-400',
    card: isDark ? 'bg-emerald-900/40 border border-emerald-500/20 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300' : 'bg-white/20 border border-white/30 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300',
    input: isDark ? 'bg-emerald-950/20 border-emerald-600/30 text-white placeholder-emerald-300/50 focus:border-emerald-400 focus:ring-emerald-400/30 backdrop-blur-xl' : 'bg-white/30 border-emerald-200/50 text-emerald-900 placeholder-emerald-700/50 focus:border-emerald-400 focus:ring-emerald-400/20 backdrop-blur-xl',
    toggleSection: isDark ? 'bg-gray-700/30' : 'bg-gray-100/50',
  }), [isDark]);

  // --- Handlers ---

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
    if (success) setSuccess(null);
  }, [error, success]);

  const validateForm = useCallback(() => {
    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError('Please enter both email and password.');
        return false;
      }
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields.');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
    }
    return true;
  }, [isLogin, formData]);

  const handleAuth = useCallback(async (e: React.FormEvent, provider: 'email' | 'google') => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (provider === 'email' && !validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (provider === 'google') {
          setSuccess('Successfully authenticated with Google!');
      } else {
          setSuccess(isLogin ? 'Login successful!' : 'Account created successfully!');
      }
      
      // Redirect to dashboard
      setTimeout(() => router.push('/home'), 1000);

    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [isLogin, validateForm]);
  
  const handleConfirmSkip = useCallback(() => {
    router.push('/skipuserinfo');
    setShowSkipModal(false);
  }, [router]);
  
  const handleBackToLanding = useCallback(() => router.push('/'), [router]);
  const toggleTheme = useCallback(() => setIsDark(prev => !prev), []);
  const handleCancelSkip = useCallback(() => setShowSkipModal(false), []);
  const handleSkip = useCallback(() => setShowSkipModal(true), []);
  const toggleAuthMode = useCallback(() => setIsLogin(prev => !prev), []);

  return (
    <div className={`min-h-screen w-full relative overflow-hidden transition-all duration-700 ease-in-out ${themeClasses.background}`}>
      <SkipModal isOpen={showSkipModal} onConfirm={handleConfirmSkip} onCancel={handleCancelSkip} themeClasses={themeClasses} />
      <BackgroundEffects isDark={isDark} themeClasses={{
        background: themeClasses.background,
        text: themeClasses.text,
        subtitle: themeClasses.subtitle,
        accent: themeClasses.accent,
        button: themeClasses.button,
        secondaryButton: themeClasses.secondaryButton,
        googleButton: themeClasses.googleButton,
        skipButton: themeClasses.skipButton,
        toggle: themeClasses.toggle,
        toggleActive: themeClasses.toggle,
        toggleInactive: themeClasses.toggle,
        toggleSection: themeClasses.toggleSection,
        inputField: themeClasses.input,
        featureCard: themeClasses.card,
        featureCardIcon: themeClasses.accent,
        featureCardText: themeClasses.text,
        featureCardDescription: themeClasses.subtitle,
        modalBackground: themeClasses.card,
        modalText: themeClasses.text,
        modalButton: themeClasses.button,
        modalSecondaryButton: themeClasses.secondaryButton
      }} />
      <AuthHeader onBack={handleBackToLanding} onSkip={handleSkip} onToggleTheme={toggleTheme} isDark={isDark} themeClasses={themeClasses} />

      <main className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className={`w-full max-w-md rounded-3xl border ${themeClasses.card} shadow-2xl p-8 transition-all duration-700 relative z-20 backdrop-filter backdrop-blur-lg bg-opacity-20 border border-gray-200/20`}>
          <div className="text-center mb-8">
            <div className={`text-3xl ${themeClasses.accent} mb-2 font-bold`}>☪</div>
            <h1 className={`text-3xl font-bold mb-2 ${themeClasses.text} transition-colors duration-700`}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className={`${themeClasses.subtitle} transition-colors duration-700`}>
              {isLogin ? 'Sign in to the YaQeen Islamic Platform' : 'Join YaQeen to explore Islamic sciences'}
            </p>
          </div>

          <div className={`flex rounded-xl p-1 w-full mb-8 ${themeClasses.toggleSection}`}>
            {['Login', 'Sign Up'].map((mode, index) => (
                <button
                    key={mode}
                    onClick={() => setIsLogin(index === 0)}
                    className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 ${isLogin === (index === 0) ? `${themeClasses.button} shadow-lg transform scale-105` : `${themeClasses.subtitle} hover:${themeClasses.text}`}`}
                >
                    {mode}
                </button>
            ))}
          </div>

          <form onSubmit={(e) => handleAuth(e, 'email')} className="space-y-5">
            {!isLogin && (
              <InputField name="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" required={!isLogin} Icon={User} themeClasses={themeClasses} />
            )}
            <InputField name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" required Icon={Mail} themeClasses={themeClasses} />
            
            <InputField name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} placeholder="Enter your password" required Icon={Lock} themeClasses={themeClasses}>
              <button type="button" onClick={() => setShowPassword(p => !p)} className={`absolute right-4 top-1/2 -translate-y-1/2 ${themeClasses.subtitle} hover:${themeClasses.text}`}>
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </InputField>
            
            {!isLogin && (
              <InputField name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm your password" required={!isLogin} Icon={Lock} themeClasses={themeClasses}>
                <button type="button" onClick={() => setShowConfirmPassword(p => !p)} className={`absolute right-4 top-1/2 -translate-y-1/2 ${themeClasses.subtitle} hover:${themeClasses.text}`}>
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </InputField>
            )}

            {isLogin && (
              <div className="text-right">
                <button type="button" className={`text-sm ${themeClasses.accent} hover:underline font-medium`}>
                  Forgot password?
                </button>
              </div>
            )}
            
            {error && <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">{error}</div>}
            {success && <div className="bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-sm">{success}</div>}

            <button type="submit" disabled={isLoading} className={`group w-full py-4 px-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${themeClasses.button} disabled:opacity-75 disabled:cursor-not-allowed`}>
              <span className="flex items-center justify-center space-x-2">
                {isLoading ? (
                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Processing...</span></>
                ) : (
                    <>{isLogin ? 'Sign In' : 'Create Account'}<ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" /></>
                )}
              </span>
            </button>
          </form>

          <div className="my-8 flex items-center text-sm">
            <div className={`flex-grow border-t ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />
            <span className={`flex-shrink mx-4 ${themeClasses.subtitle}`}>Or continue with</span>
            <div className={`flex-grow border-t ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />
          </div>

          <button type="button" onClick={(e) => handleAuth(e, 'google')} disabled={isLoading} className={`w-full py-4 px-4 rounded-xl font-medium text-lg transition-all duration-300 transform hover:scale-105 ${themeClasses.googleButton} disabled:opacity-75 disabled:cursor-not-allowed`}>
            <span className="flex items-center justify-center space-x-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              <span>Continue with Google</span>
            </span>
          </button>
          
          <div className="text-center mt-8">
              <p className={`text-sm ${themeClasses.subtitle}`}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button onClick={toggleAuthMode} className={`${themeClasses.accent} hover:underline font-medium`}>
                      {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
              </p>
          </div>
          
          <div className="text-center mt-6 pt-6 border-t border-gray-500/20">
              <p className={`text-sm ${themeClasses.accent}`}>بارك الله فيك</p>
              <p className={`text-xs ${themeClasses.subtitle} opacity-75`}>May Allah bless you</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default YaQeenAuthPage;