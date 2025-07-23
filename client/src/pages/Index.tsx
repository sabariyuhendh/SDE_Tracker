import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClassDashboard } from '@/components/ClassDashboard';
import { StudentManager } from '@/components/StudentManager';
import { ClassWeekendReview } from '@/components/ClassWeekendReview';
import SimpleNavigation from '@/components/SimpleNavigation';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <SimpleNavigation />
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'students', label: 'Students' },
              { id: 'review', label: 'Review' },
              { id: 'admin', label: 'Admin' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-[#516395] shadow-sm'
                    : 'text-[#E6E6FA] hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

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
