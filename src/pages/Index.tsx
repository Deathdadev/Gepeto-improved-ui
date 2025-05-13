import { useState, useEffect } from "react";

import Layout from "@/components/Layout";
import ProjectForm from "@/components/ProjectForm";
import ProfilesSection from "@/components/ProfilesSection";
import AIAssistant from "@/components/AIAssistant";
import ProfileSetupWizard from "@/components/ProfileSetupWizard";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("project");

  // This effect ensures the tab content updates when activeTab changes
  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
  }, [activeTab]);
  const { toast } = useToast();
  const [shouldShowWizard, setShouldShowWizard] = useState<boolean>(true);

  useEffect(() => {
    // Check if user has opted out of the wizard or has profiles
    const skipWizard = localStorage.getItem("skip_profile_wizard");
    const savedProfiles = localStorage.getItem("profiles");
    const hasProfiles = savedProfiles && JSON.parse(savedProfiles).length > 0;

    // Hide wizard if user has profiles or has opted out
    if (hasProfiles || skipWizard === "true") {
      setShouldShowWizard(false);
    }
  }, []);

  // handleLogout function removed as logout is now handled by AuthContext via Layout component

  const closeWizard = () => {
    setShouldShowWizard(false);
  };

  return (
    <Layout onTabChange={setActiveTab}> {/* onLogout prop removed */}
      <div className="container p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Hidden TabsList for the vertical navbar to control */}
          <TabsList className="hidden">
            <TabsTrigger value="project" data-value="project" id="tab-project" className="radix-tabs-trigger">Project Creation</TabsTrigger>
            <TabsTrigger value="profiles" data-value="profiles" id="tab-profiles" className="radix-tabs-trigger">Profiles</TabsTrigger>
            <TabsTrigger value="ai" data-value="ai" id="tab-ai" className="radix-tabs-trigger">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="project">
            <ProjectForm />
          </TabsContent>

          <TabsContent value="profiles">
            <ProfilesSection />
          </TabsContent>

          <TabsContent value="ai">
            <AIAssistant />
          </TabsContent>
        </Tabs>
      </div>

      {/* Profile Setup Wizard */}
      <ProfileSetupWizard
        open={shouldShowWizard}
        onClose={closeWizard}
        isNewProfile={false}
      />
    </Layout>
  );
};

export default Index;