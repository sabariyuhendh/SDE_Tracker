import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Play, StopCircle, TestTube, Users, Clock, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function ScraperManagement() {
  const [testUsername, setTestUsername] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Get all students to show scrape options
  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ["/api/students"],
    select: (data: any) => data.students || []
  });

  // Test scraping mutation
  const testScrapeMutation = useMutation({
    mutationFn: (username: string) => 
      apiRequest("/api/scrape/test", { method: "POST", body: JSON.stringify({ username }) }),
    onSuccess: (data: any) => {
      toast({
        title: "Test Scraping Successful",
        description: `Successfully scraped profile for ${data.data.username}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Test Scraping Failed",
        description: error.message || "Failed to scrape profile data",
        variant: "destructive",
      });
    },
  });

  // Individual student scraping
  const scrapeStudentMutation = useMutation({
    mutationFn: (studentId: number) => 
      apiRequest(`/api/students/${studentId}/scrape`, { method: "POST" }),
    onSuccess: () => {
      toast({
        title: "Student Data Updated",
        description: "Successfully scraped and updated student data",
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
    },
    onError: (error: any) => {
      toast({
        title: "Scraping Failed",
        description: error.message || "Failed to scrape student data",
        variant: "destructive",
      });
    },
  });

  // Bulk scraping mutation
  const bulkScrapeMutation = useMutation({
    mutationFn: () => apiRequest("/api/scrape/all", { method: "POST" }),
    onSuccess: () => {
      toast({
        title: "Bulk Scraping Started",
        description: "Scraping all students in background - this may take several minutes",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Bulk Scraping Failed",
        description: error.message || "Failed to start bulk scraping",
        variant: "destructive",
      });
    },
  });

  // Auto-scraping control mutations
  const startAutoScrapeMutation = useMutation({
    mutationFn: () => apiRequest("/api/scrape/start-auto", { method: "POST" }),
    onSuccess: () => {
      toast({
        title: "Auto-Scraping Started",
        description: "Daily auto-scraping is now enabled (runs at 2 AM UTC)",
      });
    },
  });

  const stopAutoScrapeMutation = useMutation({
    mutationFn: () => apiRequest("/api/scrape/stop-auto", { method: "POST" }),
    onSuccess: () => {
      toast({
        title: "Auto-Scraping Stopped",
        description: "Daily auto-scraping has been disabled",
      });
    },
  });

  const handleTestScrape = () => {
    if (!testUsername.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a TUF username to test",
        variant: "destructive",
      });
      return;
    }
    testScrapeMutation.mutate(testUsername.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setLocation('/')}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              TUF Scraper Management
            </h1>
          </div>
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
            <Clock className="w-4 h-4 mr-1" />
            Auto-scraping: Daily at 2 AM UTC
          </Badge>
        </div>

        <Alert className="bg-white/5 border-white/20 text-white">
          <AlertDescription className="text-gray-300">
            <strong className="text-white">Important:</strong> TUF scraping uses Puppeteer to extract data from student profiles. 
            This process may be slow and should be run server-side. The scraper will attempt to extract 
            total problems solved, difficulty breakdown, and topic progress.
          </AlertDescription>
        </Alert>

        {/* Test Scraping Section */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-xl font-semibold">
              <TestTube className="w-5 h-5" />
              Test Profile Scraping
            </CardTitle>
            <CardDescription className="text-gray-300">
              Test the scraper with any TUF username to see what data can be extracted
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="test-username" className="text-white font-medium">TUF Username</Label>
                <Input
                  id="test-username"
                  value={testUsername}
                  onChange={(e) => setTestUsername(e.target.value)}
                  placeholder="Enter TUF username (e.g., your_tuf_username)"
                  disabled={testScrapeMutation.isPending}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-white/40"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleTestScrape}
                  disabled={testScrapeMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium flex items-center gap-2"
                >
                  {testScrapeMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <TestTube className="w-4 h-4" />
                  )}
                  Test Scrape
                </Button>
              </div>
            </div>

            {testScrapeMutation.data && (
              <Alert className="bg-green-900/20 border-green-500/50 text-white">
                <AlertDescription>
                  <strong className="text-green-400">Test Results:</strong>
                  <pre className="mt-2 text-sm bg-black/20 p-3 rounded overflow-auto text-gray-300 border border-white/10">
                    {JSON.stringify(testScrapeMutation.data.data, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Bulk Operations */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/5 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-xl font-semibold">
                <Users className="w-5 h-5" />
                Bulk Operations
              </CardTitle>
              <CardDescription className="text-gray-300">
                Scrape data for all students at once
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => bulkScrapeMutation.mutate()}
                disabled={bulkScrapeMutation.isPending}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium flex items-center gap-2"
              >
                {bulkScrapeMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Scrape All Students
              </Button>
              <p className="text-sm text-gray-400">
                This will scrape TUF data for all {studentsData?.length || 0} students. 
                The process runs in the background.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-xl font-semibold">
                <Clock className="w-5 h-5" />
                Auto-Scraping
              </CardTitle>
              <CardDescription className="text-gray-300">
                Schedule automatic daily scraping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={() => startAutoScrapeMutation.mutate()}
                  disabled={startAutoScrapeMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium"
                >
                  {startAutoScrapeMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  Start Auto
                </Button>
                <Button
                  onClick={() => stopAutoScrapeMutation.mutate()}
                  disabled={stopAutoScrapeMutation.isPending}
                  variant="outline"
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  {stopAutoScrapeMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <StopCircle className="w-4 h-4" />
                  )}
                  Stop Auto
                </Button>
              </div>
              <p className="text-sm text-gray-400">
                Runs daily at 2:00 AM UTC. Updates all students automatically.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Individual Student Scraping */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-xl font-semibold">Individual Student Scraping</CardTitle>
            <CardDescription className="text-gray-300">
              Scrape data for specific students
            </CardDescription>
          </CardHeader>
          <CardContent>
            {studentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              </div>
            ) : (
              <div className="grid gap-4">
                {studentsData?.map((student: any) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border border-white/20 rounded-lg bg-white/5"
                  >
                    <div>
                      <h3 className="font-semibold text-white">{student.name}</h3>
                      <p className="text-sm text-gray-300">
                        @{student.username}
                      </p>
                      {student.lastUpdated && (
                        <p className="text-xs text-gray-400">
                          Last updated: {new Date(student.lastUpdated).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => scrapeStudentMutation.mutate(student.id)}
                      disabled={scrapeStudentMutation.isPending}
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium flex items-center gap-2"
                    >
                      {scrapeStudentMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      Scrape
                    </Button>
                  </div>
                ))}

                {studentsData?.length === 0 && (
                  <p className="text-center text-gray-400 py-8">
                    No students found. Add some students first to enable scraping.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}