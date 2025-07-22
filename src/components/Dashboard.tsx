import { motion } from 'framer-motion';
import { Target, Flame, Clock, TrendingUp, BookOpen, Brain } from 'lucide-react';
import { ProgressCard } from './ProgressCard';
import { HeatmapCalendar } from './HeatmapCalendar';
import { TopicChart } from './TopicChart';
import { DifficultyChart } from './DifficultyChart';
import { useSDEProgress } from '@/hooks/useSDEProgress';

interface DashboardProps {
  className?: string;
}

export const Dashboard = ({ className = '' }: DashboardProps) => {
  const { stats, getWeeklyHeatmapData } = useSDEProgress();
  const heatmapData = getWeeklyHeatmapData();

  // Motivational quotes
  const quotes = [
    "Consistency is the mother of mastery. 🎯",
    "Every problem solved is a step closer to your goal. 🚀",
    "The best time to plant a tree was 20 years ago. The second best time is now. 🌱",
    "Progress, not perfection. 💪",
    "Your only limit is your mind. 🧠"
  ];
  
  const todayQuote = quotes[new Date().getDay() % quotes.length];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`space-y-8 ${className}`}
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold gradient-text-primary">
          TUF Tracker
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Master the Striver SDE Sheet with style. Track your progress, build streaks, and ace those interviews.
        </p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 max-w-md mx-auto"
        >
          <p className="text-accent font-medium">{todayQuote}</p>
        </motion.div>
      </motion.div>

      {/* Main Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProgressCard
          title="Total Progress"
          value={stats.totalCompleted}
          total={stats.totalProblems}
          icon="🎯"
          trend="up"
        />
        
        <ProgressCard
          title="This Week"
          value={stats.weeklyCount}
          percentage={Math.min((stats.weeklyCount / 7) * 100, 100)}
          icon="📈"
          trend={stats.weeklyCount > 0 ? "up" : "neutral"}
        />
        
        <ProgressCard
          title="Current Streak"
          value={stats.streak}
          percentage={Math.min((stats.streak / 30) * 100, 100)}
          icon="🔥"
          trend={stats.streak > 0 ? "up" : "neutral"}
        />
        
        <ProgressCard
          title="Completion Rate"
          value={stats.completionPercentage}
          percentage={stats.completionPercentage}
          icon="⚡"
          trend="up"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopicChart data={stats.topicStats} />
        </div>
        <div>
          <DifficultyChart data={stats.difficultyStats} />
        </div>
      </div>

      {/* Activity and Recent Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HeatmapCalendar data={heatmapData} />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Recent Victories
            </h3>
            <p className="text-sm text-muted-foreground">
              Your latest conquered problems
            </p>
          </div>

          <div className="space-y-3">
            {stats.recentProblems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No problems solved yet</p>
                <p className="text-sm">Start your coding journey!</p>
              </div>
            ) : (
              stats.recentProblems.map((problem, index) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-success/10 border border-success/20"
                >
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{problem.title}</h4>
                    <p className="text-sm text-muted-foreground">{problem.topic}</p>
                  </div>
                  <div className="text-xs text-success font-medium">
                    {problem.difficulty}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Weekly Goals Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Target className="w-6 h-6 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">
            Weekly Goals
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="text-2xl font-bold text-primary mb-1">
              {Math.max(7 - stats.weeklyCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">
              Problems left this week
            </div>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="text-2xl font-bold text-accent mb-1">
              {Math.round(((stats.totalCompleted / stats.totalProblems) * 100) / 10) * 10 + 10}%
            </div>
            <div className="text-sm text-muted-foreground">
              Next milestone
            </div>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-success/10 border border-success/20">
            <div className="text-2xl font-bold text-success mb-1">
              {Math.ceil((stats.totalProblems - stats.totalCompleted) / 7)}
            </div>
            <div className="text-sm text-muted-foreground">
              Weeks to completion
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};