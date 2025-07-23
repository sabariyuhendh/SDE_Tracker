import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, Award, TrendingUp, Users, Crown } from "lucide-react";
import { useStudents } from "@/hooks/useHardcodedData";

export default function LeaderboardPage() {
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
        return <span className="w-5 h-5 flex items-center justify-center text-white font-bold">{rank}</span>;
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Trophy className="w-6 h-6 text-white" />
        <h1 className="text-2xl font-bold text-white">Class Leaderboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-sm text-gray-300">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(leaderboardData.reduce((sum, s) => sum + (s.totalSolved || 0), 0) / (leaderboardData.length || 1))}
                </p>
                <p className="text-sm text-gray-300">Average Problems</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold">
                  {leaderboardData[0]?.totalSolved || 0}
                </p>
                <p className="text-sm text-gray-300">Top Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2">
        <Button
          onClick={() => setSortBy('totalSolved')}
          variant={sortBy === 'totalSolved' ? 'default' : 'outline'}
          className={`${
            sortBy === 'totalSolved' 
              ? 'bg-white text-black hover:bg-gray-200' 
              : 'border-white/20 text-white bg-transparent hover:bg-white/10'
          }`}
        >
          Sort by Problems Solved
        </Button>
        <Button
          onClick={() => setSortBy('percentage')}
          variant={sortBy === 'percentage' ? 'default' : 'outline'}
          className={`${
            sortBy === 'percentage' 
              ? 'bg-white text-black hover:bg-gray-200' 
              : 'border-white/20 text-white bg-transparent hover:bg-white/10'
          }`}
        >
          Sort by Progress %
        </Button>
      </div>

      {/* Leaderboard */}
      <Card className="bg-white/5 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Student Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leaderboardData.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No Students Yet</h3>
              <p className="text-gray-300">Add students in the Admin panel to see the leaderboard!</p>
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
                        <AvatarFallback className="bg-white/20 text-white font-medium">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-white">{student.name}</h3>
                        <p className="text-sm text-gray-300">@{student.username}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{student.totalSolved || 0}</p>
                        <p className="text-sm text-gray-300">Problems Solved</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{student.averagePercentage}%</p>
                        <p className="text-sm text-gray-300">Avg. Progress</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{student.completedTopics}</p>
                        <p className="text-sm text-gray-300">Topics Done</p>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Badge 
                          variant="secondary"
                          className={`${student.difficultyStats?.easy ? 'bg-green-500/20 text-green-400' : 'bg-white/20 text-gray-300'}`}
                        >
                          Easy: {student.difficultyStats?.easy || 0}
                        </Badge>
                        <Badge 
                          variant="secondary"
                          className={`${student.difficultyStats?.medium ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/20 text-gray-300'}`}
                        >
                          Medium: {student.difficultyStats?.medium || 0}
                        </Badge>
                        <Badge 
                          variant="secondary"
                          className={`${student.difficultyStats?.hard ? 'bg-red-500/20 text-red-400' : 'bg-white/20 text-gray-300'}`}
                        >
                          Hard: {student.difficultyStats?.hard || 0}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
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
  );
}