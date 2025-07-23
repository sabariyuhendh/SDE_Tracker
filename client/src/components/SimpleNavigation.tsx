import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Users, Trophy, BarChart3, User } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/scraper", label: "Scraper", icon: BarChart3 },
  { href: "/admin", label: "Admin", icon: Users },
];

export default function SimpleNavigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-black/40 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link 
              href="/"
              className="text-xl font-bold text-white cursor-pointer hover:text-gray-300 transition-colors"
            >
              TUF Class Tracker
            </Link>
            <div className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href || 
                  (item.href === "/" && location === "/") ||
                  (item.href !== "/" && location.startsWith(item.href));
                
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-white/20 text-white shadow-sm"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* User info section */}
          <div className="flex items-center space-x-4 text-gray-300">
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-lg">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Volcaryx</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}