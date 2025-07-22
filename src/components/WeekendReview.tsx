import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trophy, Target, Lightbulb, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSDEProgress } from '@/hooks/useSDEProgress';
import { WeeklyReflection } from '@/data/sdeProblems';

interface WeekendReviewProps {
  className?: string;
}

export const WeekendReview = ({ className = '' }: WeekendReviewProps) => {
  const { stats, saveWeeklyReflection, isWeekend } = useSDEProgress();
  const [reflection, setReflection] = useState<Partial<WeeklyReflection>>({
    whatWentWell: '',
    struggledWith: '',
    focusForNextWeek: ''
  });

  // Calculate this week's breakdown
  const thisWeekBreakdown = {
    topicBreakdown: Object.entries(stats.topicStats).reduce((acc, [topic, data]) => {
      acc[topic] = data.completed; // This is simplified - in real app would track weekly data
      return acc;
    }, {} as Record<string, number>),
    difficultyBreakdown: stats.difficultyStats
  };

  const handleSaveReflection = () => {
    const weeklyData: Omit<WeeklyReflection, 'weekStartDate'> = {
      problemsSolved: stats.weeklyCount,
      topicBreakdown: thisWeekBreakdown.topicBreakdown,
      difficultyBreakdown: thisWeekBreakdown.difficultyBreakdown,
      whatWentWell: reflection.whatWentWell || '',
      struggledWith: reflection.struggledWith || '',
      focusForNextWeek: reflection.focusForNextWeek || ''
    };
    
    saveWeeklyReflection(weeklyData);
    
    // Show success message
    alert('Weekly reflection saved! 🎉');
  };

  const generateWeeklyReport = () => {
    const report = `
TUF Tracker - Weekly Review
===========================

📊 PROGRESS SUMMARY
• Problems solved this week: ${stats.weeklyCount}
• Total completion: ${stats.totalCompleted}/${stats.totalProblems} (${stats.completionPercentage}%)
• Current streak: ${stats.streak} days

🎯 DIFFICULTY BREAKDOWN
• Easy: ${stats.difficultyStats.Easy || 0}
• Medium: ${stats.difficultyStats.Medium || 0}  
• Hard: ${stats.difficultyStats.Hard || 0}

🧠 REFLECTION
What went well:
${reflection.whatWentWell || 'Not filled'}

Struggled with:
${reflection.struggledWith || 'Not filled'}

Focus for next week:
${reflection.focusForNextWeek || 'Not filled'}

Generated on: ${new Date().toLocaleDateString()}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tuf-weekly-review-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 ${className}`}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <Calendar className="w-8 h-8 text-accent" />
          <h1 className="text-3xl font-bold gradient-text-accent">
            Weekend Review
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Reflect on your progress and set goals for the week ahead
        </p>
        {isWeekend && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full"
          >
            <Trophy className="w-4 h-4 text-accent" />
            <span className="text-accent font-medium">Perfect time for reflection!</span>
          </motion.div>
        )}
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-success/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-success flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span>This Week</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success mb-2">
              {stats.weeklyCount}
            </div>
            <p className="text-sm text-muted-foreground">
              Problems conquered
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-primary flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Overall Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-2">
              {stats.completionPercentage}%
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.totalCompleted} / {stats.totalProblems} completed
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-accent flex items-center space-x-2">
              <Lightbulb className="w-5 h-5" />
              <span>Streak</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent mb-2">
              {stats.streak}
            </div>
            <p className="text-sm text-muted-foreground">
              Days of consistency
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Breakdown */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Difficulty Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default" className="bg-success/20 text-success border-success/30">
              Easy: {stats.difficultyStats.Easy || 0}
            </Badge>
            <Badge variant="default" className="bg-warning/20 text-warning border-warning/30">
              Medium: {stats.difficultyStats.Medium || 0}
            </Badge>
            <Badge variant="default" className="bg-destructive/20 text-destructive border-destructive/30">
              Hard: {stats.difficultyStats.Hard || 0}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Reflection Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-success">🎉 What went well?</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Celebrate your wins, no matter how small..."
              value={reflection.whatWentWell}
              onChange={(e) => setReflection(prev => ({ ...prev, whatWentWell: e.target.value }))}
              className="min-h-[120px] bg-background/50 border-glass-border"
            />
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-warning">🤔 What was challenging?</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Topics or concepts that need more attention..."
              value={reflection.struggledWith}
              onChange={(e) => setReflection(prev => ({ ...prev, struggledWith: e.target.value }))}
              className="min-h-[120px] bg-background/50 border-glass-border"
            />
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-primary">🎯 Focus for next week</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Set your priorities and goals..."
              value={reflection.focusForNextWeek}
              onChange={(e) => setReflection(prev => ({ ...prev, focusForNextWeek: e.target.value }))}
              className="min-h-[120px] bg-background/50 border-glass-border"
            />
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button 
          onClick={handleSaveReflection}
          className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Save Weekly Reflection
        </Button>
        
        <Button 
          onClick={generateWeeklyReport}
          variant="outline"
          className="flex-1 border-accent/30 hover:bg-accent/10"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>
    </motion.div>
  );
};