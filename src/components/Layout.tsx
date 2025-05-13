import { useState, useEffect } from "react";
import { User, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Added Avatar imports
import { cn } from "@/lib/utils";
import { useAuth } from "../hooks/useAuth"; // Import useAuth
import SignInWithGitHubButton from "./SignInWithGitHubButton"; // Import Sign In Button

interface LayoutProps {
  children: React.ReactNode;
  // onLogout prop removed
  onTabChange?: (tab: string) => void;
}

const Layout = ({ children, onTabChange }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("project");
  const { user, logout, isLoading } = useAuth(); // Use auth context

  // Initialize the active tab
  useEffect(() => {
    // Set default tab
    setActiveTab("project");
  }, []);

  const handleTabClick = (tabValue: string) => {
    // Update active tab state
    setActiveTab(tabValue);

    // If parent component provided a tab change handler, call it
    // This is the key part - we're directly updating the parent's state
    if (onTabChange) {
      onTabChange(tabValue);
    }

    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0" // Always show on medium screens and up
      )}>
        <div className="flex flex-col h-full">
          {/* Auth Section: User Profile / Logout OR Sign In Button */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                {/* Optional: Add a spinner */}
                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
              </div>
            ) : user ? (
              // --- Authenticated User View ---
              <div className="flex flex-col items-center">
                 <Avatar className="w-16 h-16 mb-3">
                   {/* Use Avatar component */}
                   <AvatarImage src={user.avatar_url} alt={user.login} />
                   <AvatarFallback>
                     {/* Fallback to generic icon */}
                     <User className="w-10 h-10 text-gray-400" />
                   </AvatarFallback>
                 </Avatar>
                 <h3 className="text-md font-semibold text-gray-800 dark:text-white truncate w-full text-center" title={user.login}>
                   {user.login}
                 </h3>
                 {/* <p className="text-xs text-gray-500 dark:text-gray-400">ID: {user.id}</p> */}
                 <Button
                   variant="outline"
                   size="sm"
                   className="w-full flex items-center justify-center gap-2 mt-3"
                   onClick={logout} // Use logout from context
                 >
                   <LogOut className="h-4 w-4" />
                   <span>Logout</span>
                 </Button>
              </div>
            ) : (
              // --- Unauthenticated User View ---
              <div className="flex flex-col items-center justify-center h-32">
                 <SignInWithGitHubButton />
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 mt-2"> {/* Adjusted margin */}
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleTabClick("project")}
                  className={cn(
                    "w-full flex items-center px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                    activeTab === "project"
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                  id="nav-project"
                >
                  <span className="w-6 h-6 mr-3 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  Project Creation
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick("profiles")}
                  className={cn(
                    "w-full flex items-center px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                    activeTab === "profiles"
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                  id="nav-profiles"
                >
                  <span className="w-6 h-6 mr-3 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  Profiles
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick("ai")}
                  className={cn(
                    "w-full flex items-center px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                    activeTab === "ai"
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                  id="nav-ai"
                >
                  <span className="w-6 h-6 mr-3 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </span>
                  AI Assistant
                </button>
              </li>
            </ul>
          </nav>

          {/* Logout button removed - integrated into the Auth Section above */}
          {/* <div className="p-4 border-t border-gray-200 dark:border-gray-700"> ... </div> */}
        </div>
      </div>

      {/* Main content */}
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        sidebarOpen ? "md:ml-64" : ""
      )}>
        {children}
      </main>
    </div>
  );
};

export default Layout;