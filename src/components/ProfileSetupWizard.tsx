import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { CheckCircle2, Github, Twitter, Coffee, Gift, Cloud, Link, Bitcoin } from "lucide-react"; // Added icons for inputs
import { cn } from "@/lib/utils"; // Added for conditional class names
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/types/Profile";

// Wizard steps - simplified to remove GitHub auth
enum WizardStep {
  PROFILE_SETUP,
  COMPLETE
}

interface ProfileSetupWizardProps {
  open: boolean;
  onClose: () => void;
  isNewProfile?: boolean;
  profileToEdit?: Profile | null;
}

const ProfileSetupWizard = ({ open, onClose, isNewProfile = false, profileToEdit = null }: ProfileSetupWizardProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.PROFILE_SETUP);
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

  // Effect to handle form reset and population when editing
  useEffect(() => {
    if (!open) return;

    if (profileToEdit) {
      // Editing mode: Populate form with existing data
      setFormData({
        name: profileToEdit.name,
        x: profileToEdit.x || "",
        github: profileToEdit.github || "",
        buymeacoffee: profileToEdit.buymeacoffee || "",
        kofi: profileToEdit.kofi || "",
        bsky: profileToEdit.bsky || "",
        website: profileToEdit.website || "",
        bitcoin: profileToEdit.bitcoin || ""
      });
    } else {
      // New profile: Reset form
      setFormData({
        name: "",
        x: "",
        github: "",
        buymeacoffee: "",
        kofi: "",
        bsky: "",
        website: "",
        bitcoin: ""
      });
    }
  }, [open, profileToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
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
        ...profileToEdit,
        ...formData,
      };
    } else {
      // Creating new profile
      updatedProfile = {
        id: uuidv4(),
        ...formData,
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

  const nextStep = () => {
    setCurrentStep(WizardStep.COMPLETE);
  };

  const finalizeWizard = () => {
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  // Render appropriate content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case WizardStep.PROFILE_SETUP:
        return (
          <>
            <DialogHeader className="pb-4">
              <DialogTitle className="text-2xl font-semibold">{profileToEdit ? "Edit Your Profile" : "Set Up Your Profile"}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {profileToEdit ? "Update" : "Add"} your social links and information for your publisher profile.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-6 max-h-[60vh] overflow-y-auto pr-2"> {/* Increased gap, padding, max-height and added pr-2 for scrollbar */}
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
                <Label htmlFor="github">GitHub</Label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="github"
                    placeholder="GitHub username"
                    value={formData.github}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="x">X.com (Twitter)</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="x"
                    placeholder="Username (without @)"
                    value={formData.x}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="buymeacoffee">Buy Me A Coffee</Label>
                <div className="relative">
                  <Coffee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="buymeacoffee"
                    placeholder="BuyMeACoffee username"
                    value={formData.buymeacoffee}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="kofi">Ko-fi</Label>
                <div className="relative">
                  <Gift className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="kofi"
                    placeholder="Ko-fi username"
                    value={formData.kofi}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bsky">Bluesky</Label>
                <div className="relative">
                  <Cloud className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="bsky"
                    placeholder="Bluesky username"
                    value={formData.bsky}
                    onChange={handleInputChange}
                    className="pl-10" // Add padding for the icon
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    placeholder="Website URL"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bitcoin">Bitcoin Donation Address</Label>
                <div className="relative">
                  <Bitcoin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="bitcoin"
                    placeholder="Bitcoin address"
                    value={formData.bitcoin}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleSkip}>Cancel</Button>
              <Button onClick={handleComplete} className="min-w-[120px]">{profileToEdit ? "Save Changes" : "Complete Setup"}</Button> {/* Ensured prominence */}
            </DialogFooter>
          </>
        );

      case WizardStep.COMPLETE:
        return (
          <>
            <DialogHeader className="text-center pb-4">
              <DialogTitle className="text-2xl font-semibold">{profileToEdit ? "Profile Updated!" : "Profile Setup Complete!"}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Your profile has been {profileToEdit ? "updated" : "created"} successfully.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-10 space-y-4"> {/* Increased padding and added space for text */}
              <div className="rounded-full bg-green-100 p-4 dark:bg-green-800/30"> {/* Adjusted padding and dark mode bg */}
                {/* Using Lucide icon for consistency, can revert to SVG if preferred */}
                <CheckCircle2 className="h-16 w-16 text-green-500 dark:text-green-400" />
              </div>
               {/* Optional: Add a celebratory message below the icon */}
              {/* <p className="text-lg font-medium">Great job!</p> */}
            </div>
            <DialogFooter className="sm:justify-center pt-4"> {/* Centered button and added top padding */}
              <Button onClick={finalizeWizard} className="min-w-[100px]">Done</Button>
            </DialogFooter>
          </>
        );
    }
  };

  // Render step indicator
  const renderStepIndicator = () => {
    const steps = [
      WizardStep.PROFILE_SETUP,
      WizardStep.COMPLETE
    ];

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
                    ? "bg-primary/40"
                    : "bg-gray-300 dark:bg-gray-600"
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
      <DialogContent className="sm:max-w-md md:max-w-lg p-6"> {/* Added overall padding */}
        {renderStepIndicator()}
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSetupWizard;