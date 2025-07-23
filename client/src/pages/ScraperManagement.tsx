
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Play, StopCircle, TestTube, Users, Clock, ArrowLeft, Bot } from "lucide-react";
import { useLocation } from "wouter";
import SimpleNavigation from "@/components/SimpleNavigation";
import { useStudents } from "@/hooks/useHardcodedData";

export default function ScraperManagement() {
  const [testUsername, setTestUsername] = useState("");
  const [isTestingScrape, setIsTestingScrape] = useState(false);
  const [isScraping, setIsScraping] = useState<number | null>(null);
  const [isBulkScraping, setIsBulkScraping] = useState(false);
  const [isAutoScraping, setIsAutoScraping] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { students, isLoading: studentsLoading } = useStudents();

  // Test scraping function that calls the backend API
  const handleTestScrape = async () => {
    if (!testUsername.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a TUF username to test",
        variant: "destructive",
      });
      return;
    }

    setIsTestingScrape(true);
    try {
      const response = await fetch('/api/scrape/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: testUsername }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to test scraping');
      }

      toast({
        title: "Test Scraping Successful",
        description: `Successfully scraped profile for ${testUsername}. Total problems: ${data.data.totalSolved}, Easy: ${data.data.difficultyStats.easy}, Medium: ${data.data.difficultyStats.medium}, Hard: ${data.data.difficultyStats.hard}`,
      });
      setTestUsername("");
    } catch (error: any) {
      toast({
        title: "Test Scraping Failed",
        description: error.message || "Failed to scrape profile data. Please check the username.",
        variant: "destructive",
      });
    } finally {
      setIsTestingScrape(false);
    }
  };

  // Scrape individual student
  const handleScrapeStudent = async (studentId: number, studentName: string) => {
    setIsScraping(studentId);
    try {
      const response = await fetch(`/api/students/${studentId}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape student data');
      }

      toast({
        title: "Student Data Updated",
        description: `Successfully scraped and updated data for ${studentName}`,
      });
    } catch (error: any) {
      toast({
        title: "Scraping Failed",
        description: error.message || `Failed to scrape data for ${studentName}`,
        variant: "destructive",
      });
    } finally {
      setIsScraping(null);
    }
  };

  // Bulk scrape all students
  const handleBulkScrape = async () => {
    setIsBulkScraping(true);
    try {
      const response = await fetch('/api/scrape/all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start bulk scraping');
      }

      toast({
        title: "Bulk Scraping Started",
        description: "Bulk scraping has been started in the background for all students",
      });
    } catch (error: any) {
      toast({
        title: "Bulk Scraping Failed",
        description: error.message || "Failed to start bulk scraping",
        variant: "destructive",
      });
    } finally {
      setIsBulkScraping(false);
    }
  };

  // Start auto scraping
  const handleStartAutoScraping = async () => {
    try {
      const response = await fetch('/api/scrape/start-auto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start auto-scraping');
      }

      setIsAutoScraping(true);
      toast({
        title: "Auto-Scraping Started",
        description: "Auto-scraping is now active (daily at 2 AM UTC)",
      });
    } catch (error: any) {
      toast({
        title: "Auto-Scraping Failed",
        description: error.message || "Failed to start auto-scraping",
        variant: "destructive",
      });
    }
  };

  // Stop auto scraping
  const handleStopAutoScraping = async () => {
    try {
      const response = await fetch('/api/scrape/stop-auto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to stop auto-scraping');
      }

      setIsAutoScraping(false);
      toast({
        title: "Auto-Scraping Stopped",
        description: "Auto-scraping has been disabled",
      });
    } catch (error: any) {
      toast({
        title: "Failed to Stop Auto-Scraping",
        description: error.message || "Failed to stop auto-scraping",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] p-4">
      <SimpleNavigation />
      
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">TUF Scraper Management</h1>
          <p className="text-[#E6E6FA] text-lg">
            Manage TakeUForward profile scraping and data synchronization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Scraping */}
          <Card className="bg-white/10 border-white/20 text-[#F4F4F4]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Test Scraping
              </CardTitle>
              <CardDescription className="text-[#E6E6FA]">
                Test the scraper with any TUF username to verify functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="testUsername" className="text-[#E6E6FA]">TUF Username</Label>
                <Input
                  id="testUsername"
                  value={testUsername}
                  onChange={(e) => setTestUsername(e.target.value)}
                  placeholder="Enter TUF username (e.g., striver_79)"
                  className="bg-white/10 border-white/20 text-[#F4F4F4] placeholder:text-[#E6E6FA]/60"
                />
              </div>
              <Button
                onClick={handleTestScrape}
                disabled={isTestingScrape || !testUsername.trim()}
                className="w-full bg-white text-[#516395] hover:bg-gray-100"
              >
                {isTestingScrape ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing Scraper...
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Scrape
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Auto Scraping */}
          <Card className="bg-white/10 border-white/20 text-[#F4F4F4]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Auto Scraping
                {isAutoScraping && <Badge className="bg-green-500 text-white">Active</Badge>}
              </CardTitle>
              <CardDescription className="text-[#E6E6FA]">
                Schedule automatic scraping for all students daily at 2 AM UTC
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-white/5 border-white/20">
                <Bot className="h-4 w-4" />
                <AlertDescription className="text-[#E6E6FA]">
                  Auto-scraping will update all student profiles automatically every day at 2 AM UTC.
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button
                  onClick={handleStartAutoScraping}
                  disabled={isAutoScraping}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Auto
                </Button>
                <Button
                  onClick={handleStopAutoScraping}
                  disabled={!isAutoScraping}
                  variant="destructive"
                  className="flex-1"
                >
                  <StopCircle className="w-4 h-4 mr-2" />
                  Stop Auto
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Operations */}
        <Card className="bg-white/10 border-white/20 text-[#F4F4F4]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Bulk Operations
            </CardTitle>
            <CardDescription className="text-[#E6E6FA]">
              Scrape data for all students or manage individual student profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleBulkScrape}
                disabled={isBulkScraping}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isBulkScraping ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scraping All...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Scrape All Students
                  </>
                )}
              </Button>
            </div>

            {/* Individual Student Scraping */}
            {studentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#E6E6FA]" />
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <h4 className="font-medium text-[#E6E6FA] mb-2">Individual Student Scraping:</h4>
                {students.map((student: any) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <span className="font-medium">{student.name}</span>
                      <span className="text-[#E6E6FA] ml-2">(@{student.username})</span>
                    </div>
                    <Button
                      onClick={() => handleScrapeStudent(student.id, student.name)}
                      disabled={isScraping === student.id}
                      size="sm"
                      className="bg-white text-[#516395] hover:bg-gray-100"
                    >
                      {isScraping === student.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          Scraping...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Scrape
                        </>
                      )}
                    </Button>
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
