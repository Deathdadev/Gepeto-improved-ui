import { useState, useEffect } from "react";
// Removed Layout import
import ProjectForm from "@/components/ProjectForm";
// Removed ProfilesSection import (will be handled by routing)

const Index = () => {
  // Removed activeTab state and handleTabChange function
  const [shouldShowWizard, setShouldShowWizard] = useState<boolean>(true); // Kept wizard logic if needed independently

  useEffect(() => {
    // Get profiles and wizard skip preference from localStorage
    const savedProfiles = localStorage.getItem("profiles");
    const skipWizard = localStorage.getItem("skipWizard");
    const hasProfiles = savedProfiles && JSON.parse(savedProfiles).length > 0;

    // Hide wizard if user has profiles or has opted out
    if (hasProfiles || skipWizard === "true") {
      setShouldShowWizard(false);
    }
  }, []);

  // Removed handleTabChange

  return (
    // Removed Layout wrapper
    <div className="container p-4 md:p-6">
      {/* Removed key and conditional rendering based on activeTab */}
      {/* Always render ProjectForm for the Index route */}
      <ProjectForm />
      {/* ProfilesSection will be rendered via its own route */}
      {/* Consider if wizard logic needs adjustment based on routing */}
    </div>
  );
};

export default Index;