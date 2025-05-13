import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom"; // Import Outlet
import { Menu, FolderKanban, Users, SquareTerminal, ChevronDown, ChevronRight, PanelLeftClose, PanelRightClose } from "lucide-react"; // Added SquareTerminal, Chevrons, Panel Icons
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGeneratedAppContext } from "@/contexts/GeneratedAppContext"; // Added context
import { Separator } from "@/components/ui/separator"; // Added Separator

// Removed LayoutProps interface

const Layout = (/* Removed props */) => { // Removed props
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [generatedAppsOpen, setGeneratedAppsOpen] = useState(true); // State for accordion-like behavior
  const { generatedApps } = useGeneratedAppContext();
  const location = useLocation(); // To determine active route


  // Removed handleLegacyTabClick as it's no longer needed for routing

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }

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
        "fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out", // Changed transition property
        sidebarOpen ? "w-64" : "w-16" // Conditional width instead of transform
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            {/* Logo/Title Placeholder - Can be added later */}
            <span className={cn("font-semibold text-lg", !sidebarOpen && "hidden")}>Gepeto</span>
            {/* Persistent Sidebar Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:inline-flex" // Show only on md screens and up initially
            >
              {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelRightClose className="h-5 w-5" />}
            </Button>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto"> {/* Added overflow-y-auto */}
            {/* Static Links - Changed to Links */}
            <Link
              to="/" // Link to root
              onClick={handleLinkClick} // Use general link click handler
              className={cn(
                "w-full flex items-center py-3 text-sm rounded-lg transition-colors",
                sidebarOpen ? "space-x-3 px-4" : "justify-center px-0", // Adjust padding/spacing/alignment
                location.pathname === "/" // Active state based on path
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <FolderKanban className={cn("h-5 w-5", location.pathname === "/" ? "text-primary-foreground" : "text-gray-400 dark:text-gray-500")} />
              <span className={cn(!sidebarOpen && "hidden")}>Project Creation</span>
            </Link>
            {/* Assuming "Profiles" corresponds to a specific route, e.g., /profiles. Adjust if needed. */}
            {/* If Profiles is part of the Index page, this button might need different logic or removal */}
            <Link
              to="/profiles" // Example route, adjust if necessary
              onClick={handleLinkClick}
              className={cn(
                "w-full flex items-center py-3 text-sm rounded-lg transition-colors",
                sidebarOpen ? "space-x-3 px-4" : "justify-center px-0", // Adjust padding/spacing/alignment
                location.pathname === "/profiles" // Active state based on path
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <Users className={cn("h-5 w-5", location.pathname === "/profiles" ? "text-primary-foreground" : "text-gray-400 dark:text-gray-500")} />
              <span className={cn(!sidebarOpen && "hidden")}>Profiles</span>
            </Link>

            {/* Dynamically Generated App Links */}
            {generatedApps.length > 0 && (
              <>
                <Separator className="my-2" />
                <button
                  onClick={() => setGeneratedAppsOpen(!generatedAppsOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className={cn("font-semibold", !sidebarOpen && "hidden")}>Generated Apps</span>
                  {generatedAppsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {generatedAppsOpen && (
                  <div className="pl-4 space-y-1">
                    {generatedApps.map((app) => {
                      const appPath = `/generated-app/${encodeURIComponent(app.appName)}`;
                      const isActive = location.pathname === appPath;
                      return (
                        <Link
                          key={app.appName}
                          to={appPath}
                          onClick={handleLinkClick}
                          className={cn(
                            "w-full flex items-center py-2 text-sm rounded-lg transition-colors",
                            // Apply flex centering and fixed height when collapsed
                            sidebarOpen ? "space-x-3 px-3" : "flex items-center justify-center h-12",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          )}
                        >
                          {app.appIcon ? (
                            // Increased size and removed mx-auto for collapsed state
                            <img src={app.appIcon} alt={app.appName} className={cn("object-contain", !sidebarOpen ? "h-8 w-8" : "h-4 w-4")} />
                          ) : (
                            // Increased size and removed mx-auto for collapsed state
                            <SquareTerminal className={cn(isActive ? "text-primary-foreground" : "text-gray-400 dark:text-gray-500", !sidebarOpen ? "h-8 w-8" : "h-4 w-4")} />
                          )}
                          <span className={cn(!sidebarOpen && "hidden")}>{app.appName}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300 w-full p-6", // Added padding
        sidebarOpen ? "md:ml-64" : "md:ml-16" // Adjust margin for collapsed width
      )}>
        <Outlet /> {/* Render child routes here */}
      </div>
    </div>
  );
};

export default Layout;