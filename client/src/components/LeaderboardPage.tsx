import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Trophy, Star, TrendingUp } from "lucide-react";
import { useState } from "react";

interface Student {
  id: number;
  username: string;
  name: string;
  avatar?: string;
  totalSolved: number;
  weeklyProgress: Record<string, number>;
  percentage: number;
}

type SortBy = "totalSolved" | "percentage" | "weeklyImprovement";

export default function LeaderboardPage() {
  const [, setLocation] = useLocation();
  const [sortBy, setSortBy] = useState<SortBy>("totalSolved");

  const { data: leaderboardData, isLoading } = useQuery<{ leaderboard: Student[] }>({
    queryKey: ["/api/class/leaderboard"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-foreground text-xl font-light">Loading leaderboard...</div>
      </div>
    );
  }

  const students = leaderboardData?.leaderboard || [];

  const getWeeklyImprovement = (student: Student) => {
    const weeks = Object.values(student.weeklyProgress || {});
    return weeks.reduce((sum, count) => sum + count, 0);
  };

  const sortedStudents = [...students].sort((a, b) => {
    switch (sortBy) {
      case "percentage":
        return b.percentage - a.percentage;
      case "weeklyImprovement":
        return getWeeklyImprovement(b) - getWeeklyImprovement(a);
      default:
        return b.totalSolved - a.totalSolved;
    }
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-foreground" />;
    if (rank === 2) return <Trophy className="w-5 h-5 text-muted-foreground" />;
    if (rank === 3) return <Trophy className="w-5 h-5 text-accent-foreground" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-light">#{rank}</span>;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 font-light">1st Place</Badge>;
    if (rank === 2) return <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-light">2nd Place</Badge>;
    if (rank === 3) return <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 font-light">3rd Place</Badge>;
    return null;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation('/')}
              variant="outline"
              size="sm"
              className="bg-card border border-border text-foreground hover:bg-secondary font-light"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-light text-foreground">
              Class Leaderboard
            </h1>
          </div>
          
          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={sortBy === "totalSolved" ? "default" : "outline"}
              onClick={() => setSortBy("totalSolved")}
              size="sm"
              className={sortBy === "totalSolved" 
                ? "bg-primary text-primary-foreground font-light" 
                : "bg-card border border-border text-foreground hover:bg-secondary font-light"
              }
            >
              <Trophy className="w-4 h-4 mr-2" />
              Total Solved
            </Button>
            <Button
              variant={sortBy === "percentage" ? "default" : "outline"}
              onClick={() => setSortBy("percentage")}
              size="sm"
              className={sortBy === "percentage" 
                ? "bg-primary text-primary-foreground font-light" 
                : "bg-card border border-border text-foreground hover:bg-secondary font-light"
              }
            >
              <Star className="w-4 h-4 mr-2" />
              Progress %
            </Button>
            <Button
              variant={sortBy === "weeklyImprovement" ? "default" : "outline"}
              onClick={() => setSortBy("weeklyImprovement")}
              size="sm"
              className={sortBy === "weeklyImprovement" 
                ? "bg-primary text-primary-foreground font-light" 
                : "bg-card border border-border text-foreground hover:bg-secondary font-light"
              }
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Weekly Growth
            </Button>
          </div>
        </div>

        {/* Top 3 Podium */}
        {sortedStudents.length >= 3 && (
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* 2nd Place */}
            <Card className="bg-secondary border border-border mt-8">
              <CardHeader className="text-center pb-4">
                <Trophy className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <Avatar className="w-16 h-16 mx-auto mb-4">
                  <AvatarImage src={sortedStudents[1].avatar} alt={sortedStudents[1].name} />
                  <AvatarFallback className="bg-secondary text-foreground font-light">
                    {sortedStudents[1].name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-light text-foreground">{sortedStudents[1].name}</h3>
                <p className="text-muted-foreground text-sm font-light">@{sortedStudents[1].username}</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-light mb-2 text-foreground">{sortedStudents[1].totalSolved}</div>
                <div className="text-muted-foreground text-sm font-light">{sortedStudents[1].percentage}% complete</div>
              </CardContent>
            </Card>

            {/* 1st Place */}
            <Card className="bg-primary/10 border border-primary">
              <CardHeader className="text-center pb-4">
                <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={sortedStudents[0].avatar} alt={sortedStudents[0].name} />
                  <AvatarFallback className="bg-yellow-500/20 text-white text-lg">
                    {sortedStudents[0].name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg text-white">{sortedStudents[0].name}</h3>
                <p className="text-yellow-200 text-sm">@{sortedStudents[0].username}</p>
                <Badge className="bg-yellow-500 text-black hover:bg-yellow-400 mt-2">
                  <Star className="w-3 h-3 mr-1" />
                  Champion
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold mb-2 text-white">{sortedStudents[0].totalSolved}</div>
                <div className="text-yellow-200 text-sm">{sortedStudents[0].percentage}% complete</div>
              </CardContent>
            </Card>

            {/* 3rd Place */}
            <Card className="bg-secondary border border-border text-foreground mt-8">
              <CardHeader className="text-center pb-4">
                <Trophy className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <Avatar className="w-16 h-16 mx-auto mb-4">
                  <AvatarImage src={sortedStudents[2].avatar} alt={sortedStudents[2].name} />
                  <AvatarFallback className="bg-white/20 text-[#F4F4F4]">
                    {sortedStudents[2].name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold">{sortedStudents[2].name}</h3>
                <p className="text-[#E6E6FA] text-sm">@{sortedStudents[2].username}</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold mb-2">{sortedStudents[2].totalSolved}</div>
                <div className="text-[#E6E6FA] text-sm">{sortedStudents[2].percentage}% complete</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Full Rankings */}
        <Card className="bg-white/10 border-white/20 text-[#F4F4F4] card-hover">
          <CardHeader>
            <CardTitle>Full Rankings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {sortedStudents.map((student, index) => {
                const rank = index + 1;
                const weeklyImprovement = getWeeklyImprovement(student);
                
                return (
                  <div 
                    key={student.id}
                    className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setLocation(`/student/${student.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      {getRankIcon(rank)}
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback className="bg-white/20 text-[#F4F4F4] text-sm">
                          {student.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{student.name}</h3>
                        {getRankBadge(rank)}
                      </div>
                      <p className="text-[#E6E6FA] text-sm">@{student.username}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {sortBy === "totalSolved" && student.totalSolved}
                        {sortBy === "percentage" && `${student.percentage}%`}
                        {sortBy === "weeklyImprovement" && weeklyImprovement}
                      </div>
                      <div className="text-[#E6E6FA] text-sm">
                        {sortBy === "totalSolved" && `${student.percentage}% complete`}
                        {sortBy === "percentage" && `${student.totalSolved} problems`}
                        {sortBy === "weeklyImprovement" && "weekly progress"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}