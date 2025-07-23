import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClassDashboard } from '@/components/ClassDashboard';
import { StudentManager } from '@/components/StudentManager';
import { ClassWeekendReview } from '@/components/ClassWeekendReview';
import LeaderboardPage from '@/components/LeaderboardPage';
import ScraperManagement from '@/pages/ScraperManagement';
import AdminPanel from '@/components/AdminPanel';
import WeekendReviewPage from '@/pages/WeekendReviewPage';
import { Calendar, BarChart3, Bot, Users, Trophy } from 'lucide-react';

type TabType = 'dashboard' | 'students' | 'review' | 'admin' | 'leaderboard' | 'scraper';

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ClassDashboard key="dashboard" />;
      case 'students':
        return <StudentManager key="students" />;
      case 'review':
        return <WeekendReviewPage key="review" />;
      case 'admin':
        return <AdminPanel key="admin" />;
      case 'leaderboard':
        return <LeaderboardPage key="leaderboard" />;
      case 'scraper':
        return <ScraperManagement key="scraper" />;
      default:
        return <ClassDashboard key="dashboard" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Navigation Header */}
      <nav className="bg-black/40 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="text-xl font-bold text-white cursor-pointer">
                TUF Class Tracker
              </div>
              <div className="flex space-x-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
                  { id: 'review', label: 'Weekend Review', icon: Calendar },
                  { id: 'scraper', label: 'Scraper', icon: Bot },
                  { id: 'admin', label: 'Admin', icon: Users }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white/20 text-white shadow-sm'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* User info section */}
            <div className="flex items-center space-x-4 text-gray-300">
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-lg">
                <span className="text-sm font-medium">Volcaryx</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Main Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="space-y-6"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
