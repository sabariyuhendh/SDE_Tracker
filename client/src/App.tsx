import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Router, Route } from "wouter";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentDetailPage from "./components/StudentDetailPage";
import LeaderboardPage from "./components/LeaderboardPage";
import ScraperManagement from "./pages/ScraperManagement";
import AdminPanel from "./components/AdminPanel";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Router>
      <Route path="/" component={Index} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/student/:id" component={StudentDetailPage} />
      <Route path="/leaderboard" component={LeaderboardPage} />
      <Route path="/scraper" component={ScraperManagement} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="/:rest*" component={NotFound} />
    </Router>
  </TooltipProvider>
);

export default App;