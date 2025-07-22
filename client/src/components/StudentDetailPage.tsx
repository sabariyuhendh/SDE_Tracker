import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Star, Calendar, Trophy, Target } from "lucide-react";
import { format } from "date-fns";

interface Student {
  id: number;
  username: string;
  name: string;
  avatar?: string;
  totalSolved: number;
  weeklyProgress: Record<string, number>;
  topicProgress: Record<string, { solved: number; total: number; percentage: number }>;
  difficultyStats: { easy: number; medium: number; hard: number };
  reflection?: string;
  lastUpdated: string;
  createdAt: string;
}

interface TopPerformer {
  student: Student;
  isTopPerformer: boolean;
}

export default function StudentDetailPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: student, isLoading } = useQuery<Student>({
    queryKey: ["/api/students", id],
  });

  const { data: statsData } = useQuery<any>({
    queryKey: ["/api/class/stats"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#516395] p-6 flex items-center justify-center">
        <div className="text-[#F4F4F4]">Loading student details...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-[#516395] p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#F4F4F4] mb-4">Student not found</h2>
          <Button onClick={() => setLocation("/")} className="bg-white text-[#516395] hover:bg-gray-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isTopPerformer = statsData?.topPerformer?.id === student.id;
  const completionPercentage = Math.round((student.totalSolved / 190) * 100);

  const topics = Object.entries(student.topicProgress).sort((a, b) => b[1].percentage - a[1].percentage);

  const getWeeklyData = () => {
    const weeks = Object.entries(student.weeklyProgress || {})
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-4); // Last 4 weeks
    return weeks;
  };

  return (
    <div className="min-h-screen bg-[#516395] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={() => setLocation("/")} 
            variant="ghost" 
            size="sm"
            className="text-[#F4F4F4] hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-[#F4F4F4]">Student Details</h1>
        </div>

        {/* Student Profile Card */}
        <Card className="bg-white/10 border-white/20 text-[#F4F4F4] mb-8 card-hover">
          <CardHeader>
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback className="bg-white/20 text-[#F4F4F4] text-xl">
                  {student.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{student.name}</h2>
                  {isTopPerformer && (
                    <Badge className="bg-yellow-500 text-black hover:bg-yellow-400">
                      <Star className="w-3 h-3 mr-1" />
                      Top Performer
                    </Badge>
                  )}
                </div>
                <p className="text-[#E6E6FA] mb-2">@{student.username}</p>
                <div className="flex items-center gap-4 text-sm text-[#E6E6FA]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined: {format(new Date(student.createdAt), "MMM dd, yyyy")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    Last updated: {format(new Date(student.lastUpdated), "MMM dd, yyyy")}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 border-white/20 text-[#F4F4F4] card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#E6E6FA]">Total Solved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student.totalSolved}</div>
              <p className="text-xs text-[#E6E6FA]">out of 190 problems</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-[#F4F4F4] card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#E6E6FA]">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionPercentage}%</div>
              <Progress value={completionPercentage} className="h-2 mt-2 bg-white/20" />
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-[#F4F4F4] card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#E6E6FA]">Easy Problems</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{student.difficultyStats.easy}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-[#F4F4F4] card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#E6E6FA]">Medium + Hard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">
                {student.difficultyStats.medium + student.difficultyStats.hard}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Topic Progress */}
        <Card className="bg-white/10 border-white/20 text-[#F4F4F4] mb-8 card-hover">
          <CardHeader>
            <CardTitle>Topic-wise Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map(([topic, progress]) => (
                <div key={topic} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{topic}</span>
                    <span className="text-sm text-[#E6E6FA]">
                      {progress.solved}/{progress.total} ({progress.percentage}%)
                    </span>
                  </div>
                  <Progress 
                    value={progress.percentage} 
                    className="h-2 bg-white/20"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card className="bg-white/10 border-white/20 text-[#F4F4F4] mb-8 card-hover">
          <CardHeader>
            <CardTitle>Recent Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {getWeeklyData().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {getWeeklyData().map(([week, count]) => (
                  <div key={week} className="bg-white/5 p-4 rounded-lg">
                    <div className="text-sm text-[#E6E6FA] mb-1">
                      Week of {format(new Date(week), "MMM dd")}
                    </div>
                    <div className="text-xl font-bold">{count} problems</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#E6E6FA]">No weekly progress data available</p>
            )}
          </CardContent>
        </Card>

        {/* Student Reflection */}
        {student.reflection && (
          <Card className="bg-white/10 border-white/20 text-[#F4F4F4] card-hover">
            <CardHeader>
              <CardTitle>Student Reflection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#E6E6FA] leading-relaxed">{student.reflection}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}