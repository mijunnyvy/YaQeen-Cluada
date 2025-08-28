// app/settings/page.tsx
'use client';

import type { FC, ReactNode } from 'react';
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { getAuth, signOut, sendPasswordResetEmail, User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { MenuBar } from '@/components/menu-bar';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  User,
  KeyRound,
  Image,
  BrainCircuit,
  LogOut,
  ChevronRight,
  X,
  Info,
  Plus,
  RefreshCcw,
  SunMoon
} from 'lucide-react';

// --- Types and Interfaces ---
type FloatingBall = {
  id: number; x: number; y: number; vx: number; vy: number; size: number; opacity: number;
};

interface ThemeClasses {
  background: string; text: string; subtitle: string; accent: string;
  card: string; grid: string; ball: string;
}

// --- NEW: Customize AI Modal Component ---
interface CustomizeAIModalProps {
  onClose: () => void;
  themeClasses: ThemeClasses;
  isDark: boolean;
}

const CustomizeAIModal: FC<CustomizeAIModalProps> = ({ onClose, themeClasses, isDark }) => {
  const [nickname, setNickname] = useState('');
  const [role, setRole] = useState('');
  const [traits, setTraits] = useState('');

  const handleSave = () => {
    console.log({ nickname, role, traits });
    onClose();
  };

  const handleAddTrait = (trait: string) => {
    setTraits(prev => prev ? `${prev}, ${trait}` : trait);
  };

  const predefinedTraits = ["Chatty", "Witty", "Straight shooting", "Encouraging", "Gen Z", "Traditional", "Forward thinking"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className={`relative w-full max-w-2xl rounded-2xl border ${themeClasses.card} bg-gray-900/80 shadow-2xl`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
          <div>
            <h2 className={`text-xl font-bold ${themeClasses.text}`}>Customize GenixAI</h2>
            <p className={themeClasses.subtitle}>Introduce yourself to get better, more personalized responses</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Nickname Input */}
          <div className="space-y-2">
            <label className={`text-sm font-semibold flex items-center gap-2 ${themeClasses.subtitle}`}>
              What should GenixAI call you? <Info className="w-4 h-4" />
            </label>
            <input
              type="text"
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className={`w-full p-3 rounded-lg bg-white/5 border ${isDark ? 'border-gray-700' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 outline-none transition-all ${themeClasses.text}`}
            />
          </div>

          {/* Role Input */}
          <div className="space-y-2">
            <label className={`text-sm font-semibold flex items-center gap-2 ${themeClasses.subtitle}`}>
              What do you do?
            </label>
            <input
              type="text"
              placeholder="e.g., Level 10 Mage or Software Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full p-3 rounded-lg bg-white/5 border ${isDark ? 'border-gray-700' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 outline-none transition-all ${themeClasses.text}`}
            />
          </div>

          {/* Traits Input */}
          <div className="space-y-2">
            <label className={`text-sm font-semibold flex items-center gap-2 ${themeClasses.subtitle}`}>
              What traits should GenixAI have? <Info className="w-4 h-4" />
            </label>
            <textarea
              placeholder="Describe or select traits"
              value={traits}
              onChange={(e) => setTraits(e.target.value)}
              rows={4}
              className={`w-full p-3 rounded-lg bg-white/5 border ${isDark ? 'border-gray-700' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 outline-none transition-all ${themeClasses.text}`}
            />
            <div className="flex flex-wrap gap-2 pt-2">
              {predefinedTraits.map(trait => (
                <button
                  key={trait}
                  onClick={() => handleAddTrait(trait)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors ${themeClasses.subtitle}`}
                >
                  <Plus className="w-4 h-4" /> {trait}
                </button>
              ))}
              <button onClick={() => setTraits('')} className={`p-2 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors ${themeClasses.subtitle}`}>
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-4 p-5 border-t ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
          <button onClick={onClose} className={`px-4 py-2 rounded-lg font-semibold hover:bg-white/10 transition-colors ${themeClasses.subtitle}`}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/20 transition-all transform hover:scale-105"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Reusable UI Components ---
interface SettingsHeroProps { user: FirebaseUser | null; }
const SettingsHero: FC<SettingsHeroProps> = ({ user }) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-gray-500">{user?.email || 'Guest User'}</p>
    </div>
  );
};

interface SettingsSectionProps { title: string; children: ReactNode; themeClasses: ThemeClasses; isDark: boolean; }
const SettingsSection: FC<SettingsSectionProps> = ({ title, children, themeClasses }) => {
  return (
    <section className="mb-8">
      <h2 className={`mb-4 text-lg font-semibold ${themeClasses.text}`}>{title}</h2>
      <div className={`space-y-2 p-4 rounded-lg border ${themeClasses.card}`}>
        {children}
      </div>
    </section>
  );
};

interface SettingsItemProps {
  icon: ReactNode;
  text: string;
  subtext?: string;
  onClick?: () => void;
  themeClasses: ThemeClasses;
  children?: ReactNode;
  isDestructive?: boolean;
}
const SettingsItem: FC<SettingsItemProps> = ({ icon, text, subtext, onClick, themeClasses, children, isDestructive }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
        isDestructive ? "text-red-500 hover:bg-red-500/10" : `${themeClasses.text} hover:bg-white/10`
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="font-medium">{text}</p>
          {subtext && <p className={themeClasses.subtitle}>{subtext}</p>}
        </div>
      </div>
      {children || <ChevronRight className="w-4 h-4" />}
    </div>
  );
};

// --- Main Page Component ---
const AccountSettingsPage = () => {
  const { user, isLoading } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const auth = getAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const themeClasses: ThemeClasses = {
    background: isDark ? "bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900" : "bg-gradient-to-br from-gray-50 via-white to-purple-50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-400" : "text-gray-600",
    accent: isDark ? "text-purple-400" : "text-purple-600",
    card: isDark ? "bg-gray-800/50 border-gray-700/50" : "bg-white/80 border-gray-200/50",
    grid: isDark ? "opacity-10" : "opacity-5",
    ball: isDark ? "bg-purple-500" : "bg-purple-400",
  };

  const handlePasswordReset = () => {
    if (user?.email) {
      sendPasswordResetEmail(auth, user.email).then(() => {
        alert('Password reset email sent.');
      });
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => router.push('//'));
  };

  if (isLoading) {
    return <div className={`min-h-screen w-full ${themeClasses.background}`}><p className="text-center pt-40 text-white">Loading...</p></div>;
  }

  return (
    <>
      <div className={`min-h-screen w-full relative overflow-hidden transition-all duration-700 ease-in-out ${themeClasses.background}`}>
        <main className="relative z-20 px-4 sm:px-6 pb-40 pt-10 sm:pt-16">
          <SettingsHero user={user} />

          <SettingsSection title="Account" themeClasses={themeClasses} isDark={isDark}>
            <SettingsItem icon={<User />} text="Email" subtext={user?.email || 'N/A'} themeClasses={themeClasses} />
            <SettingsItem icon={<KeyRound />} text="Reset Password" onClick={handlePasswordReset} themeClasses={themeClasses} />
          </SettingsSection>

          <SettingsSection title="Preferences" themeClasses={themeClasses} isDark={isDark}>
            <SettingsItem icon={<BrainCircuit />} text="Customize AI" onClick={() => setIsModalOpen(true)} themeClasses={themeClasses} />
            <SettingsItem icon={<Image />} text="Saved Images" onClick={() => router.push('/gallery')} themeClasses={themeClasses} />
            <SettingsItem icon={<SunMoon />} text="Theme" themeClasses={themeClasses}>
              <ThemeToggle />
            </SettingsItem>
          </SettingsSection>

          <SettingsSection title="Danger Zone" themeClasses={themeClasses} isDark={isDark}>
            <SettingsItem icon={<LogOut />} text="Logout" onClick={handleLogout} themeClasses={themeClasses} isDestructive />
          </SettingsSection>
        </main>

        <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl p-4 mb-9">
          <MenuBar />
        </nav>
      </div>

      {isModalOpen && <CustomizeAIModal onClose={() => setIsModalOpen(false)} themeClasses={themeClasses} isDark={isDark} />}
    </>
  );
};

export default AccountSettingsPage;
