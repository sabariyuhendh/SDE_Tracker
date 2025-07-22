import { motion } from 'framer-motion';
import { BarChart3, CheckSquare, Brain, Settings, Trophy, Moon, Sun, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface NavigationProps {
  activeTab: 'dashboard' | 'students' | 'review' | 'admin';
  onTabChange: (tab: 'dashboard' | 'students' | 'review' | 'admin') => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  className?: string;
}

export const Navigation = ({ 
  activeTab, 
  onTabChange, 
  isDarkMode, 
  onToggleTheme, 
  className = '' 
}: NavigationProps) => {
  const [, setLocation] = useLocation();
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: CheckSquare },
    { id: 'review', label: 'Review', icon: Brain },
    { id: 'admin', label: 'Admin', icon: Settings }
  ] as const;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        {/* Logo/Title */}
        <h1 className="text-2xl font-bold text-[#F4F4F4] mr-6">TUF Class Tracker</h1>
        
        <div className="flex items-center gap-4">
          {/* Additional Navigation */}
          <Button
            onClick={() => setLocation('/leaderboard')}
            variant="ghost"
            className="text-[#F4F4F4] hover:bg-white/10"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Leaderboard
          </Button>
          <Button
            onClick={() => setLocation('/scraper')}
            variant="ghost"
            className="text-[#F4F4F4] hover:bg-white/10"
          >
            <Bot className="w-4 h-4 mr-2" />
            TUF Scraper
          </Button>
          {/* Tab Navigation */}
          <div className="flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative px-4 py-2 transition-all duration-200 ${
                    isActive 
                      ? 'bg-white text-[#516395] shadow-lg' 
                      : 'text-[#F4F4F4] hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-md -z-10"
                      transition={{ type: "spring", duration: 0.4 }}
                    />
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};