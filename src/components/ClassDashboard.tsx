// TUF Class Tracker - Main Class Dashboard

import { motion } from 'framer-motion';
import { Trophy, Users, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useClassProgress } from '@/hooks/useClassProgress';
import { getClassLeaderboard, getMostImproved } from '@/data/classData';

export const ClassDashboard = () => {
  const { students, getClassStats, getWeeklyStats } = useClassProgress();
  const classStats = getClassStats();
  const weeklyStats = getWeeklyStats();
  const leaderboard = getClassLeaderboard(students).slice(0, 5); // Top 5
  const mostImproved = getMostImproved(students);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (students.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[400px] glass-card"
      >
        <div className="text-center space-y-4">
          <Users className="w-12 h-12 mx-auto text-muted-foreground" />
          <h3 className="text-xl font-medium">No Students Added Yet</h3>
          <p className="text-muted-foreground">Add your first student to see class progress</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Class Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{classStats.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-accent/20">
                  <Trophy className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Problems Solved</p>
                  <p className="text-2xl font-bold">{classStats.totalSolved}</p>
                  <p className="text-xs text-muted-foreground">
                    Avg: {classStats.averageSolved} per student
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-success/20">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">{weeklyStats.totalThisWeek}</p>
                  <p className="text-xs text-muted-foreground">
                    Avg: {weeklyStats.averageThisWeek}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completion</p>
                  <p className="text-2xl font-bold">{classStats.completionRate}%</p>
                  <Progress 
                    value={classStats.completionRate} 
                    className="h-2 mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Class Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-accent" />
                <span>Class Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaderboard.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 rounded-xl bg-card/50 hover:bg-card/70 transition-smooth"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-accent text-accent-foreground' :
                    index === 1 ? 'bg-secondary text-secondary-foreground' :
                    index === 2 ? 'bg-warning/20 text-warning-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-full border-2 border-primary/20"
                  />
                  
                  <div className="flex-1">
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">@{student.username}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-primary">{student.totalSolved}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((student.totalSolved / 190) * 100)}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Highlights */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-success" />
                <span>Weekly Highlights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {classStats.topPerformer && (
                <div className="space-y-2">
                  <Badge variant="secondary" className="mb-2">Top Performer</Badge>
                  <div className="flex items-center space-x-3">
                    <img
                      src={classStats.topPerformer.avatar}
                      alt={classStats.topPerformer.name}
                      className="w-12 h-12 rounded-full border-2 border-primary/20"
                    />
                    <div>
                      <p className="font-medium">{classStats.topPerformer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {classStats.topPerformer.totalSolved} problems solved
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {mostImproved && (
                <div className="space-y-2">
                  <Badge variant="outline" className="mb-2 border-success/50 text-success">
                    Most Improved
                  </Badge>
                  <div className="flex items-center space-x-3">
                    <img
                      src={mostImproved.avatar}
                      alt={mostImproved.name}
                      className="w-12 h-12 rounded-full border-2 border-success/20"
                    />
                    <div>
                      <p className="font-medium">{mostImproved.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Great progress this week!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Badge variant="outline" className="mb-2">This Week's Activity</Badge>
                <div className="space-y-2">
                  {weeklyStats.individualProgress
                    .filter(p => p.weeklyCount > 0)
                    .sort((a, b) => b.weeklyCount - a.weeklyCount)
                    .slice(0, 3)
                    .map(progress => (
                      <div key={progress.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{progress.name}</span>
                        <span className="font-medium text-primary">
                          +{progress.weeklyCount}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};