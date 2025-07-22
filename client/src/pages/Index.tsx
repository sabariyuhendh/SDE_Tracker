import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClassDashboard } from '@/components/ClassDashboard';
import { StudentManager } from '@/components/StudentManager';
import { ClassWeekendReview } from '@/components/ClassWeekendReview';
import { Navigation } from '@/components/Navigation';
import AdminPanel from '@/components/AdminPanel';

type TabType = 'dashboard' | 'students' | 'review' | 'admin';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ClassDashboard key="dashboard" />;
      case 'students':
        return <StudentManager key="students" />;
      case 'review':
        return <ClassWeekendReview key="review" />;
      case 'admin':
        return <AdminPanel key="admin" />;
      default:
        return <ClassDashboard key="dashboard" />;
    }
  };

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

        {/* Main Content with smooth transitions */}
        <main className="container mx-auto px-6 pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Index;
