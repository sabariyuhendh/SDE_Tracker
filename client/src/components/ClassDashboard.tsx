// TUF Class Tracker - Main Class Dashboard

import { motion } from 'framer-motion';
import { Trophy, Users, TrendingUp, Calendar, Eye, BookOpen, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLocation } from "wouter";
import { useStudents } from "@/hooks/useHardcodedData";

export const ClassDashboard = () => {
  const [, setLocation] = useLocation();
  const { students, isLoading } = useStudents();

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

  // Calculate class statistics
  const classStats = {
    totalStudents: students.length,
    totalProblems: students.reduce((sum, s) => sum + (s.totalSolved || 0), 0),
    averageProgress: students.length > 0 
      ? Math.round(students.reduce((sum, s) => {
          const topicProgress = s.topicProgress || {};
          const totalTopics = Object.keys(topicProgress).length;
          const avgPercentage = totalTopics > 0 
            ? Object.values(topicProgress).reduce((pSum, topic) => pSum + topic.percentage, 0) / totalTopics
            : 0;
          return sum + avgPercentage;
        }, 0) / students.length)
      : 0,
    topPerformer: students.length > 0 
      ? students.reduce((top, current) => 
          (current.totalSolved || 0) > (top.totalSolved || 0) ? current : top
        )
      : null
  };

  const leaderboard = [...students]
    .sort((a, b) => (b.totalSolved || 0) - (a.totalSolved || 0))
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#F4F4F4] font-light">Loading dashboard...</div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] space-y-6"
      >
        <div className="text-center space-y-4 max-w-md">
          <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center">
            <Users className="w-12 h-12 text-[#E6E6FA]" />
          </div>
          <h3 className="text-2xl font-bold text-[#F4F4F4]">Welcome to TUF Class Tracker!</h3>
          <p className="text-[#E6E6FA] leading-relaxed">
            Get started by adding your first students in the Admin panel. 
            Track their competitive programming progress, view leaderboards, and manage class performance all in one place.
          </p>
          <Button
            onClick={() => setLocation("/admin")}
            className="bg-white text-[#516395] hover:bg-gray-100 px-6 py-3"
          >
            <Users className="w-4 h-4 mr-2" />
            Add Students
          </Button>
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
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-[#F4F4F4]">Class Dashboard</h2>
        <p className="text-[#E6E6FA]">Track your students' competitive programming journey</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/10 border-white/20 text-[#F4F4F4] card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{classStats.totalStudents}</p>
                <p className="text-sm text-[#E6E6FA]">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 text-[#F4F4F4] card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{classStats.totalProblems}</p>
                <p className="text-sm text-[#E6E6FA]">Problems Solved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 text-[#F4F4F4] card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{classStats.averageProgress}%</p>
                <p className="text-sm text-[#E6E6FA]">Average Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 text-[#F4F4F4] card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-lg font-bold truncate max-w-[120px]">
                  {classStats.topPerformer?.name || 'N/A'}
                </p>
                <p className="text-sm text-[#E6E6FA]">Top Performer</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Students */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/10 border-white/20 text-[#F4F4F4] card-hover">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Top Students
              </CardTitle>
              <Button
                onClick={() => setLocation("/leaderboard")}
                variant="outline"
                size="sm"
                className="border-white/20 text-[#F4F4F4] hover:bg-white/10"
              >
                <Eye className="w-4 h-4 mr-1" />
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaderboard.map((student, index) => (
                <div key={student.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-full">
                    <span className="text-sm font-bold text-[#F4F4F4]">{index + 1}</span>
                  </div>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={student.avatar || undefined} />
                    <AvatarFallback className="bg-white/20 text-[#F4F4F4]">
                      {student.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium text-[#F4F4F4]">{student.name}</h4>
                    <p className="text-sm text-[#E6E6FA]">@{student.username}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-white/20 text-[#F4F4F4]">
                      {student.totalSolved || 0} solved
                    </Badge>
                  </div>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <p className="text-center text-[#E6E6FA] py-4">No student data yet</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/10 border-white/20 text-[#F4F4F4] card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                Class Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#E6E6FA]">Arrays & Hashing</span>
                  <span className="text-[#F4F4F4] font-medium">
                    {Math.round(students.reduce((sum, s) => sum + (s.topicProgress?.["Arrays"]?.percentage || 0), 0) / (students.length || 1))}%
                  </span>
                </div>
                <Progress 
                  value={students.reduce((sum, s) => sum + (s.topicProgress?.["Arrays"]?.percentage || 0), 0) / (students.length || 1)}
                  className="h-2 bg-white/10"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#E6E6FA]">Dynamic Programming</span>
                  <span className="text-[#F4F4F4] font-medium">
                    {Math.round(students.reduce((sum, s) => sum + (s.topicProgress?.["Dynamic Programming"]?.percentage || 0), 0) / (students.length || 1))}%
                  </span>
                </div>
                <Progress 
                  value={students.reduce((sum, s) => sum + (s.topicProgress?.["Dynamic Programming"]?.percentage || 0), 0) / (students.length || 1)}
                  className="h-2 bg-white/10"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#E6E6FA]">Binary Trees</span>
                  <span className="text-[#F4F4F4] font-medium">
                    {Math.round(students.reduce((sum, s) => sum + (s.topicProgress?.["Binary Trees"]?.percentage || 0), 0) / (students.length || 1))}%
                  </span>
                </div>
                <Progress 
                  value={students.reduce((sum, s) => sum + (s.topicProgress?.["Binary Trees"]?.percentage || 0), 0) / (students.length || 1)}
                  className="h-2 bg-white/10"
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 text-sm text-[#E6E6FA]">
                  <Calendar className="w-4 h-4" />
                  <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/10 border-white/20 text-[#F4F4F4] card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button
                onClick={() => setLocation("/admin")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Students
              </Button>
              <Button
                onClick={() => setLocation("/leaderboard")}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Trophy className="w-4 h-4 mr-2" />
                View Leaderboard
              </Button>
              <Button
                onClick={() => setLocation("/scraper")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Update Data
              </Button>
              <Button
                onClick={() => window.open('https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/', '_blank')}
                variant="outline"
                className="border-white/20 text-[#F4F4F4] hover:bg-white/10"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                TUF Sheet
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};