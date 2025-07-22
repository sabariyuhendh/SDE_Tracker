import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClassDashboard } from '@/components/ClassDashboard';
import { StudentManager } from '@/components/StudentManager';
import { ClassWeekendReview } from '@/components/ClassWeekendReview';
import { Navigation } from '@/components/Navigation';

type TabType = 'dashboard' | 'students' | 'review';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);


  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('tuf-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('tuf-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);


  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Navigation */}
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />

        {/* Main Content */}
        <main className="container mx-auto px-6 pb-8">
          {activeTab === 'dashboard' && <ClassDashboard />}
          {activeTab === 'students' && <StudentManager />}
          {activeTab === 'review' && <ClassWeekendReview />}
        </main>
      </div>
    </div>
  );
};

export default Index;
