import { motion } from 'framer-motion';
import { BarChart3, CheckSquare, Brain, Settings, Trophy, Moon, Sun, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useRef, useEffect, useState } from 'react';

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
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: CheckSquare },
    { id: 'review', label: 'Review', icon: Brain },
    { id: 'admin', label: 'Admin', icon: Settings }
  ] as const;

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border p-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        {/* Logo/Title */}
        <h1 className="text-2xl font-light text-foreground mr-6">TUF Class Tracker</h1>
        
        <div className="flex items-center gap-6">
          {/* Additional Navigation */}
          <Button
            onClick={() => setLocation('/leaderboard')}
            variant="ghost"
            className="text-foreground hover:bg-secondary font-light"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Leaderboard
          </Button>
          <Button
            onClick={() => setLocation('/scraper')}
            variant="ghost"
            className="text-foreground hover:bg-secondary font-light"
          >
            <Bot className="w-4 h-4 mr-2" />
            TUF Scraper
          </Button>
          
          {/* Tab Navigation with underline */}
          <div className="flex items-center space-x-0 relative">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  ref={(el) => (tabRefs.current[tab.id] = el)}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative px-4 py-2 transition-all duration-300 font-light ${
                    isActive 
                      ? 'text-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2 inline" />
                  {tab.label}
                </button>
              );
            })}
            
            {/* Animated underline */}
            <motion.div
              className="absolute bottom-0 h-0.5 bg-foreground"
              initial={false}
              animate={{
                left: underlineStyle.left,
                width: underlineStyle.width,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            />
          </div>

          {/* Theme Toggle */}
          <Button
            onClick={onToggleTheme}
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-secondary"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};