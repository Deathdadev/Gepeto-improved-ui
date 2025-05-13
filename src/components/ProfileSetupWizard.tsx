import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth"; // Auth context already imported
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/types/Profile";

// Wizard steps
enum WizardStep {
  GITHUB_AUTH,
  PROFILE_SETUP,
  COMPLETE
}

interface ProfileSetupWizardProps {
  open: boolean;
  onClose: () => void;
  isNewProfile?: boolean; // Flag to indicate if this is a new profile creation from the Profiles section
  profileToEdit?: Profile | null; // Add prop for editing existing profile
}

const ProfileSetupWizard = ({ open, onClose, isNewProfile = false, profileToEdit = null }: ProfileSetupWizardProps) => {
  const { toast } = useToast();
  // Get reAuthenticate from useAuth as well
  const { user: authUser, isLoading: authIsLoading, reAuthenticate } = useAuth();
  const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.GITHUB_AUTH);

  // githubUser state will store a simplified version for the form, if needed
  const [githubUser, setGithubUser] = useState<{ username: string; name?: string, avatar_url?: string } | null>(null);
  const [formData, setFormData] = useState<Omit<Profile, 'id'>>({
    name: "",
    x: "",
    github: "",
    buymeacoffee: "",
    kofi: "",
    bsky: "",
    website: "",
    bitcoin: ""
  });

  // Effect to handle initial setup based on auth status and if editing
   useEffect(() => {
    if (!open) return; // Don't run if dialog is closed

    if (profileToEdit) {
      // Editing mode: Populate form and go straight to setup step
      setFormData({
          name: profileToEdit.name,
          x: profileToEdit.x || "",
          github: profileToEdit.github || "", // Keep existing github username
          buymeacoffee: profileToEdit.buymeacoffee || "",
          kofi: profileToEdit.kofi || "",
          bsky: profileToEdit.bsky || "",
          website: profileToEdit.website || "",
          bitcoin: profileToEdit.bitcoin || ""
      });
      // If the profile being edited has a github username, set it
      if (profileToEdit.github) {
          setGithubUser({ username: profileToEdit.github });
      } else {
          setGithubUser(null); // Clear if no github username
      }
      setCurrentStep(WizardStep.PROFILE_SETUP);
      // Don't need to check authUser here explicitly, profile setup step handles display
    } else if (!authIsLoading) { // Creating new profile, wait for auth loading
      if (authUser) {
          // User is authenticated, go to profile setup
          setCurrentStep(WizardStep.PROFILE_SETUP);
          const userData = {
              username: authUser.login,
              name: authUser.login, // Fallback name
              avatar_url: authUser.avatar_url
          };
          setGithubUser(userData);
          // Pre-fill github username and potentially name if empty
          setFormData(prev => ({
              ...prev,
              github: userData.username || '',
              name: prev.name || userData.name || '' // Keep existing name if user typed something before auth loaded
          }));
      } else {
          // User not authenticated, start at GitHub auth step
          setCurrentStep(WizardStep.GITHUB_AUTH);
          setGithubUser(null);
      }
    } else {
      // Auth is still loading, default to GitHub auth step for new profiles
      setCurrentStep(WizardStep.GITHUB_AUTH);
    }
  }, [open, authUser, authIsLoading, profileToEdit]); // Depend on profileToEdit

  // Reset form when wizard opens *unless* editing
   useEffect(() => {
    if (open && !profileToEdit) { // Only reset fully for NEW profiles
      setFormData({
          name: "",
          x: "",
          github: authUser?.login || "", // Keep pre-filled github if available
          buymeacoffee: "",
          kofi: "",
          bsky: "",
          website: "",
          bitcoin: ""
      });
       // Set githubUser based on auth status for new profiles
      if (authUser) {
          setGithubUser({ username: authUser.login, name: authUser.login, avatar_url: authUser.avatar_url });
      } else {
          setGithubUser(null);
      }
    }
   }, [open, profileToEdit, authUser]); // Add profileToEdit and authUser dependencies

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const nextStep = () => {
    setCurrentStep(prev => {
      if (prev === WizardStep.COMPLETE) return prev;
      return prev + 1;
    });
  };

  const prevStep = () => {
    setCurrentStep(prev => {
      if (prev === WizardStep.GITHUB_AUTH) return prev;
      return prev - 1;
    });
  };

  const handleSkip = () => {
    onClose();
  };

  // const handleMockGithubLogin = () => { // This will be re-implemented or removed in the next task
  //   // This is a mock login since we can't implement real GitHub OAuth without a backend
  //   localStorage.setItem("github_authenticated", "true");
  //   const userData = {
  //     name: "Demo User",
  //     avatar: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
  //     username: "demouser"
  //   };
  //   localStorage.setItem("github_user", JSON.stringify(userData));
  //
  //   setIsAuthenticated(true);
  //   setGithubUser(userData);
  //
  //   // Pre-fill the github username
  //   setFormData(prev => ({
  //     ...prev,
  //     github: userData.username,
  //     name: prev.name || userData.name
  //   }));
  //
  //   toast({
  //     title: "Logged in with GitHub",
  //     description: "You are now signed in with GitHub"
  //   });
  //
  //   // Move to the next step
  //   nextStep();
  // };

  const initiateGitHubLogin = () => {
    // Redirect to the backend endpoint which will handle the GitHub redirect
    window.location.href = '/api/auth/github';
  };

  const handleComplete = () => {
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Profile name is required",
        variant: "destructive"
      });
      return;
    }

    let updatedProfile: Profile;
    if (profileToEdit) {
      // Editing existing profile
      updatedProfile = {
        ...profileToEdit, // Keep original ID and potentially other fields
        ...formData, // Apply form changes
        github: profileToEdit.github || githubUser?.username || formData.github // Prioritize original github username
      };
    } else {
      // Creating new profile
      updatedProfile = {
        id: uuidv4(),
        ...formData,
        github: githubUser?.username || formData.github // Ensure GitHub username is set
      };
    }

    // Get existing profiles or create empty array
    let existingProfiles: Profile[] = [];
    const savedProfiles = localStorage.getItem("profiles");
    if (savedProfiles) {
      existingProfiles = JSON.parse(savedProfiles);
    }

    if (profileToEdit) {
      // Find index and update
      const index = existingProfiles.findIndex(p => p.id === profileToEdit.id);
      if (index !== -1) {
        existingProfiles[index] = updatedProfile;
      } else {
        // Fallback: If somehow not found, add it (shouldn't happen ideally)
        existingProfiles.push(updatedProfile);
      }
    } else {
      // Add new profile
      existingProfiles.push(updatedProfile);
    }
    localStorage.setItem("profiles", JSON.stringify(existingProfiles));

    toast({
      title: profileToEdit ? "Profile updated" : "Profile created",
      description: `Profile "${updatedProfile.name}" has been ${profileToEdit ? 'updated' : 'created'} successfully`
    });

    nextStep();
  };

  const finalizeWizard = () => {
    onClose();
  };

  // Render appropriate content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case WizardStep.GITHUB_AUTH:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Step 1: Connect with GitHub</DialogTitle>
              <DialogDescription>
                Sign in with GitHub to continue setting up your profile.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6">
                <svg className="h-8 w-8 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </div>
              <Button
                onClick={initiateGitHubLogin} // Changed from handleMockGithubLogin
                className="bg-black hover:bg-gray-800 text-white flex items-center gap-2 px-6 py-5 text-base"
              >
                Sign in with GitHub
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                We'll use your GitHub account to create your profile
              </p>
               {/* Add link to use a different account */}
               <button
                  onClick={reAuthenticate}
                  className="text-sm text-blue-600 hover:underline mt-1"
               >
                  Use a different GitHub account?
               </button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleSkip}>Skip</Button>
            </DialogFooter>
          </>
        );

      case WizardStep.PROFILE_SETUP:
        return (
          <>
            <DialogHeader>
              <DialogTitle>{profileToEdit ? "Step 2: Edit Your Profile" : "Step 2: Set Up Your Profile"}</DialogTitle>
              <DialogDescription>
                {profileToEdit ? "Update" : "Add"} your social links and information for your publisher profile.
                {authUser && ( // Check authUser from context
                  <div className="mt-2 px-3 py-2 bg-muted rounded-md text-sm">
                    Connected as <span className="font-medium">{authUser.login}</span> on GitHub
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[50vh] overflow-y-auto">
              <div className="grid gap-2">
                <Label htmlFor="name">Profile Name</Label>
                <Input
                  id="name"
                  placeholder="Profile name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="x">X.com (Twitter)</Label>
                <Input
                  id="x"
                  placeholder="Username (without @)"
                  value={formData.x}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="buymeacoffee">Buy Me A Coffee</Label>
                <Input
                  id="buymeacoffee"
                  placeholder="BuyMeACoffee username"
                  value={formData.buymeacoffee}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="kofi">Ko-fi</Label>
                <Input
                  id="kofi"
                  placeholder="Ko-fi username"
                  value={formData.kofi}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bsky">Bluesky</Label>
                <Input
                  id="bsky"
                  placeholder="Bluesky username"
                  value={formData.bsky}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="Website URL"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bitcoin">Bitcoin Donation Address</Label>
                <Input
                  id="bitcoin"
                  placeholder="Bitcoin address"
                  value={formData.bitcoin}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              {/* Hide back button if editing? Or allow going back to GitHub auth? For now, keep it. */}
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={handleComplete}>{profileToEdit ? "Save Changes" : "Complete Setup"}</Button>
            </DialogFooter>
          </>
        );

      case WizardStep.COMPLETE:
        return (
          <>
            <DialogHeader>
              <DialogTitle>{profileToEdit ? "Profile Updated!" : "Profile Setup Complete!"}</DialogTitle>
              <DialogDescription>
                Your profile has been {profileToEdit ? "updated" : "created"} successfully.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center py-8">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={finalizeWizard}>
                {isNewProfile ? "Done" : "Get Started"}
              </Button>
            </DialogFooter>
          </>
        );
    }
  };

  // Create step indicator
  const renderStepIndicator = () => {
    // Always show all three steps
    const steps = [
      WizardStep.GITHUB_AUTH,    // GitHub Sign-in
      WizardStep.PROFILE_SETUP,  // Profile Setup
      WizardStep.COMPLETE        // Complete
    ];

    // console.log(`Auth status: ${authUser ? 'Authenticated' : 'Not authenticated'}, showing all steps`);

    return (
      <div className="flex justify-center mb-4">
        <div className="flex items-center space-x-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${
                step === currentStep
                  ? "bg-primary scale-110"
                  : step < currentStep
                    ? "bg-primary/40" // Past steps
                    : "bg-gray-300 dark:bg-gray-600" // Future steps
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen: boolean) => {
        if (!isOpen) handleSkip();
      }}
    >
      <DialogContent className="sm:max-w-md md:max-w-lg">
        {renderStepIndicator()}
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSetupWizard;