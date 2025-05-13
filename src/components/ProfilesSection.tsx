import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/types/Profile";
import { Plus } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import ProfileSetupWizard from "@/components/ProfileSetupWizard";

const ProfilesSection = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [showProfileWizard, setShowProfileWizard] = useState<boolean>(false);

  useEffect(() => {
    // Load profiles from localStorage
    const savedProfiles = localStorage.getItem("profiles");
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    }
  }, []);

  const saveProfilesToStorage = (updatedProfiles: Profile[]) => {
    localStorage.setItem("profiles", JSON.stringify(updatedProfiles));
    setProfiles(updatedProfiles);
  };

  const startCreatingProfile = () => {
    setShowProfileWizard(true);
  };

  const startEditingProfile = (profile: Profile) => {
    setEditingProfile(profile);
    setShowProfileWizard(true); // Open the wizard for editing
  };

  const deleteProfile = (id: string) => {
    const updatedProfiles = profiles.filter(profile => profile.id !== id);
    saveProfilesToStorage(updatedProfiles);
    toast({
      title: "Profile deleted",
      description: "The profile has been deleted"
    });
  };

  const closeWizard = () => {
    setShowProfileWizard(false);
    setEditingProfile(null); // Clear editing state when wizard closes

    // Reload profiles after wizard closes (in case a profile was created or updated)
    const savedProfiles = localStorage.getItem("profiles");
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Profiles</h2>
        <Button onClick={startCreatingProfile}>
          <Plus className="mr-2 h-4 w-4" />
          New Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.length > 0 ? (
          profiles.map(profile => (
            <ProfileCard 
              key={profile.id} 
              profile={profile} 
              onEdit={() => startEditingProfile(profile)} 
              onDelete={() => deleteProfile(profile.id)} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No profiles yet. Create one to get started.</p>
          </div>
        )}
      </div>

      {/* Profile Setup Wizard */}
      <ProfileSetupWizard
        open={showProfileWizard}
        onClose={closeWizard}
        isNewProfile={!editingProfile} // It's a new profile only if we are NOT editing
        profileToEdit={editingProfile} // Pass the profile to edit
      />
    </div>
  );
};

export default ProfilesSection;