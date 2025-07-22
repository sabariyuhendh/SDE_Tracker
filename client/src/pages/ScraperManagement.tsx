import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Play, StopCircle, TestTube, Users, Clock } from "lucide-react";

export default function ScraperManagement() {
  const [testUsername, setTestUsername] = useState("");
  const { toast } = useToast();

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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">TUF Scraper Management</h1>
        <Badge variant="secondary" className="text-sm">
          <Clock className="w-4 h-4 mr-1" />
          Auto-scraping: Daily at 2 AM UTC
        </Badge>
      </div>

      <Alert>
        <AlertDescription>
          <strong>Important:</strong> TUF scraping uses Puppeteer to extract data from student profiles. 
          This process may be slow and should be run server-side. The scraper will attempt to extract 
          total problems solved, difficulty breakdown, and topic progress.
        </AlertDescription>
      </Alert>

      {/* Test Scraping Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Test Profile Scraping
          </CardTitle>
          <CardDescription>
            Test the scraper with any TUF username to see what data can be extracted
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="test-username">TUF Username</Label>
              <Input
                id="test-username"
                value={testUsername}
                onChange={(e) => setTestUsername(e.target.value)}
                placeholder="Enter TUF username (e.g., your_tuf_username)"
                disabled={testScrapeMutation.isPending}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleTestScrape}
                disabled={testScrapeMutation.isPending}
                className="flex items-center gap-2"
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
            <Alert>
              <AlertDescription>
                <strong>Test Results:</strong>
                <pre className="mt-2 text-sm bg-gray-50 p-2 rounded overflow-auto">
                  {JSON.stringify(testScrapeMutation.data.data, null, 2)}
                </pre>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Bulk Operations */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Bulk Operations
            </CardTitle>
            <CardDescription>
              Scrape data for all students at once
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => bulkScrapeMutation.mutate()}
              disabled={bulkScrapeMutation.isPending}
              className="w-full flex items-center gap-2"
            >
              {bulkScrapeMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Scrape All Students
            </Button>
            <p className="text-sm text-muted-foreground">
              This will scrape TUF data for all {studentsData?.length || 0} students. 
              The process runs in the background.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Auto-Scraping
            </CardTitle>
            <CardDescription>
              Schedule automatic daily scraping
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={() => startAutoScrapeMutation.mutate()}
                disabled={startAutoScrapeMutation.isPending}
                variant="default"
                className="flex-1"
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
                className="flex-1"
              >
                {stopAutoScrapeMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <StopCircle className="w-4 h-4" />
                )}
                Stop Auto
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Runs daily at 2:00 AM UTC. Updates all students automatically.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Student Scraping */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Student Scraping</CardTitle>
          <CardDescription>
            Scrape data for specific students
          </CardDescription>
        </CardHeader>
        <CardContent>
          {studentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4">
              {studentsData?.map((student: any) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      @{student.username} • {student.totalSolved || 0} problems solved
                    </p>
                    {student.lastUpdated && (
                      <p className="text-xs text-muted-foreground">
                        Last updated: {new Date(student.lastUpdated).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => scrapeStudentMutation.mutate(student.id)}
                    disabled={scrapeStudentMutation.isPending}
                    size="sm"
                    className="flex items-center gap-2"
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
                <p className="text-center text-muted-foreground py-8">
                  No students found. Add some students first to enable scraping.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}