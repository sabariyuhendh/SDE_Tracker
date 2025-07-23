import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, Award, TrendingUp, Users, ArrowLeft, Crown } from "lucide-react";
import { useLocation } from "wouter";
import SimpleNavigation from "@/components/SimpleNavigation";
import { useStudents } from "@/hooks/useHardcodedData";

export default function LeaderboardPage() {
  const [, setLocation] = useLocation();
  const { students, isLoading } = useStudents();
  const [sortBy, setSortBy] = useState<'totalSolved' | 'percentage'>('totalSolved');

  // Calculate leaderboard data
  const leaderboardData = useMemo(() => {
    if (!students.length) return [];

    const studentsWithStats = students.map(student => {
      const topicProgress = student.topicProgress || {};
      const totalTopics = Object.keys(topicProgress).length;
      const completedTopics = Object.values(topicProgress).filter(topic => topic.percentage >= 80).length;
      const averagePercentage = totalTopics > 0 
        ? Math.round(Object.values(topicProgress).reduce((sum, topic) => sum + topic.percentage, 0) / totalTopics)
        : 0;

      return {
        ...student,
        completedTopics,
        averagePercentage,
        rank: 0 // Will be set after sorting
      };
    });

    // Sort by the selected metric
    const sorted = studentsWithStats.sort((a, b) => {
      if (sortBy === 'totalSolved') {
        return (b.totalSolved || 0) - (a.totalSolved || 0);
      } else {
        return b.averagePercentage - a.averagePercentage;
      }
    });

    // Assign ranks
    return sorted.map((student, index) => ({
      ...student,
      rank: index + 1
    }));
  }, [students, sortBy]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-[#F4F4F4] font-bold">{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-400/20 to-yellow-600/20 border-yellow-400/30";
      case 2:
        return "from-gray-400/20 to-gray-600/20 border-gray-400/30";
      case 3:
        return "from-amber-400/20 to-amber-600/20 border-amber-400/30";
      default:
        return "from-white/5 to-white/10 border-white/10";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2E4057] via-[#516395] to-[#7209B7]">
        <SimpleNavigation />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-[#F4F4F4]">Loading leaderboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E4057] via-[#516395] to-[#7209B7]">
      <SimpleNavigation />
      
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-[#F4F4F4]" />
            <h1 className="text-2xl font-bold text-[#F4F4F4]">Class Leaderboard</h1>
          </div>
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="border-white/20 text-[#F4F4F4] hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 text-[#F4F4F4]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold">{students.length}</p>
                  <p className="text-sm text-[#E6E6FA]">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-[#F4F4F4]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(leaderboardData.reduce((sum, s) => sum + (s.totalSolved || 0), 0) / (leaderboardData.length || 1))}
                  </p>
                  <p className="text-sm text-[#E6E6FA]">Average Problems</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-[#F4F4F4]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold">
                    {leaderboardData[0]?.totalSolved || 0}
                  </p>
                  <p className="text-sm text-[#E6E6FA]">Top Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-4">
          <span className="text-[#F4F4F4] font-medium">Sort by:</span>
          <div className="flex gap-2">
            <Button
              onClick={() => setSortBy('totalSolved')}
              variant={sortBy === 'totalSolved' ? 'default' : 'outline'}
              size="sm"
              className={
                sortBy === 'totalSolved'
                  ? 'bg-white text-[#516395]'
                  : 'border-white/20 text-[#F4F4F4] hover:bg-white/10'
              }
            >
              Total Problems
            </Button>
            <Button
              onClick={() => setSortBy('percentage')}
              variant={sortBy === 'percentage' ? 'default' : 'outline'}
              size="sm"
              className={
                sortBy === 'percentage'
                  ? 'bg-white text-[#516395]'
                  : 'border-white/20 text-[#F4F4F4] hover:bg-white/10'
              }
            >
              Average Percentage
            </Button>
          </div>
        </div>

        {/* Leaderboard */}
        <Card className="bg-white/10 border-white/20 text-[#F4F4F4]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboardData.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto text-[#E6E6FA] mb-4" />
                <h3 className="text-xl font-medium text-[#F4F4F4] mb-2">No Students Yet</h3>
                <p className="text-[#E6E6FA]">Add students in the Admin panel to see the leaderboard!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leaderboardData.map((student) => (
                  <div
                    key={student.id}
                    className={`relative p-6 rounded-xl bg-gradient-to-r ${getRankColor(student.rank)} border backdrop-blur-sm`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-full border border-white/20">
                          {getRankIcon(student.rank)}
                        </div>
                        
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={student.avatar || undefined} />
                          <AvatarFallback className="bg-white/20 text-[#F4F4F4] font-medium">
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-[#F4F4F4]">{student.name}</h3>
                          <p className="text-sm text-[#E6E6FA]">@{student.username}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-[#F4F4F4]">{student.totalSolved || 0}</p>
                          <p className="text-sm text-[#E6E6FA]">Problems Solved</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-2xl font-bold text-[#F4F4F4]">{student.averagePercentage}%</p>
                          <p className="text-sm text-[#E6E6FA]">Avg. Progress</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-2xl font-bold text-[#F4F4F4]">{student.completedTopics}</p>
                          <p className="text-sm text-[#E6E6FA]">Topics Done</p>
                        </div>

                        <div className="flex flex-col gap-1">
                          <Badge 
                            variant="secondary"
                            className={`
                              ${student.difficultyStats?.easy ? 'bg-green-500/20 text-green-400' : 'bg-white/20 text-[#E6E6FA]'}
                            `}
                          >
                            Easy: {student.difficultyStats?.easy || 0}
                          </Badge>
                          <Badge 
                            variant="secondary"
                            className={`
                              ${student.difficultyStats?.medium ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/20 text-[#E6E6FA]'}
                            `}
                          >
                            Medium: {student.difficultyStats?.medium || 0}
                          </Badge>
                          <Badge 
                            variant="secondary"
                            className={`
                              ${student.difficultyStats?.hard ? 'bg-red-500/20 text-red-400' : 'bg-white/20 text-[#E6E6FA]'}
                            `}
                          >
                            Hard: {student.difficultyStats?.hard || 0}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-[#E6E6FA] mb-2">
                        <span>Overall Progress</span>
                        <span>{student.averagePercentage}%</span>
                      </div>
                      <Progress 
                        value={student.averagePercentage} 
                        className="h-2 bg-white/10"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}