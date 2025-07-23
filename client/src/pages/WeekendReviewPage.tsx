import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WeekendReview } from '@/components/WeekendReview';
import { ClassWeekendReview } from '@/components/ClassWeekendReview';
import { Calendar, User, Users } from 'lucide-react';

type ReviewTabType = 'personal' | 'class';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3
};

const WeekendReviewPage = () => {
  const [activeTab, setActiveTab] = useState<ReviewTabType>('personal');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <WeekendReview key="personal" />;
      case 'class':
        return <ClassWeekendReview key="class" />;
      default:
        return <WeekendReview key="personal" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Weekend Review</h1>
            <p className="text-gray-300 text-sm">Reflect on your progress and plan ahead</p>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-1"
      >
        <div className="flex space-x-1">
          {[
            { id: 'personal', label: 'Personal Review', icon: User },
            { id: 'class', label: 'Class Review', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ReviewTabType)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
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
  );
};

export default WeekendReviewPage;