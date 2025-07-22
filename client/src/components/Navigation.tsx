import { motion } from 'framer-motion';
import { BarChart3, CheckSquare, Brain, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  activeTab: 'dashboard' | 'students' | 'review';
  onTabChange: (tab: 'dashboard' | 'students' | 'review') => void;
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
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: CheckSquare },
    { id: 'review', label: 'Review', icon: Brain }
  ] as const;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-4 ${className}`}
    >
      <div className="flex items-center justify-between">
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
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'hover:bg-secondary'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-md -z-10"
                    transition={{ type: "spring", duration: 0.4 }}
                  />
                )}
              </Button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleTheme}
          className="h-9 w-9 p-0"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isDarkMode ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </motion.div>
        </Button>
      </div>
    </motion.nav>
  );
};