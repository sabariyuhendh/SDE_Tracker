// TUF Class Tracker - Main Class Dashboard

import { motion } from 'framer-motion';
import { Trophy, Users, TrendingUp, Calendar, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface Student {
  id: number;
  username: string;
  name: string;
  avatar?: string;
  totalSolved: number;
  percentage: number;
}

export const ClassDashboard = () => {
  const [, setLocation] = useLocation();

  const { data: studentsData, isLoading } = useQuery<{ students: Student[] }>({
    queryKey: ["/api/students"],
  });

  const { data: statsData } = useQuery<any>({
    queryKey: ["/api/class/stats"],
  });

  const { data: leaderboardData } = useQuery<{ leaderboard: Student[] }>({
    queryKey: ["/api/class/leaderboard"],
  });

  const students = studentsData?.students || [];
  const stats = statsData || {};
  const leaderboard = leaderboardData?.leaderboard?.slice(0, 5) || [];

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-foreground font-light">Loading dashboard...</div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[400px] bg-card rounded-lg border border-border"
      >
        <div className="text-center space-y-4">
          <Users className="w-12 h-12 mx-auto text-muted-foreground" />
          <h3 className="text-xl font-light text-foreground">No Students Added Yet</h3>
          <p className="text-muted-foreground font-light">Add your first student to see class progress</p>
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
          <Card className="bg-card border border-border text-card-foreground transition-transform hover:scale-105 duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-secondary">
                  <Users className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-light">Total Students</p>
                  <p className="text-2xl font-light">{students.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card border border-border text-card-foreground transition-transform hover:scale-105 duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-secondary">
                  <Trophy className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-light">Problems Solved</p>
                  <p className="text-2xl font-light">{stats.totalSolved || 0}</p>
                  <p className="text-xs text-muted-foreground font-light">
                    Avg: {stats.averageSolved || 0} per student
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card border border-border text-card-foreground transition-transform hover:scale-105 duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-secondary">
                  <TrendingUp className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-light">This Week</p>
                  <p className="text-2xl font-light">{stats.weeklyProgress || 0}</p>
                  <p className="text-xs text-muted-foreground font-light">
                    Active students
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card border border-border text-card-foreground transition-transform hover:scale-105 duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-secondary">
                  <Calendar className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-light">Avg Completion</p>
                  <p className="text-2xl font-light">{stats.averageCompletion || 0}%</p>
                  <Progress 
                    value={stats.averageCompletion || 0} 
                    className="h-2 mt-2 bg-secondary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Class Leaderboard and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="bg-card border border-border text-card-foreground transition-transform hover:scale-105 duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-foreground" />
                  <span className="font-light">Top Performers</span>
                </div>
                <Button 
                  onClick={() => setLocation('/leaderboard')}
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground hover:bg-secondary font-light"
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-3 rounded-lg bg-secondary hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => setLocation(`/student/${student.id}`)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-light ${
                    index === 0 ? 'bg-primary text-primary-foreground' :
                    index === 1 ? 'bg-secondary text-secondary-foreground' :
                    index === 2 ? 'bg-muted text-muted-foreground' :
                    'bg-accent text-accent-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback className="bg-secondary text-foreground font-light">
                      {student.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <p className="font-light">{student.name}</p>
                    <p className="text-sm text-muted-foreground font-light">@{student.username}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-light text-foreground">{student.totalSolved}</p>
                    <p className="text-xs text-muted-foreground font-light">
                      {student.percentage}%
                    </p>
                  </div>
                </motion.div>
              ))}
              {leaderboard.length === 0 && (
                <p className="text-center text-muted-foreground py-4 font-light">No students yet</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/10 border-white/20 text-[#F4F4F4] card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.slice(0, 3).map((student) => (
                  <div key={student.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback className="bg-white/20 text-[#F4F4F4] text-xs">
                        {student.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{student.name}</p>
                      <p className="text-xs text-[#E6E6FA]">{student.totalSolved} problems solved</p>
                    </div>
                  </div>
                ))}
                {students.length === 0 && (
                  <p className="text-center text-[#E6E6FA] py-4">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};