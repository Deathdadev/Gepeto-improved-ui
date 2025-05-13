import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Profile } from "@/types/Profile";
import SelectableProfileCard from "./SelectableProfileCard";

interface ProfileSelectorProps {
  onSelect: (profile: Profile | null) => void;
}

const ProfileSelector = ({ onSelect }: ProfileSelectorProps) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    // Load profiles from localStorage
    const savedProfiles = localStorage.getItem("profiles");
    if (savedProfiles) {
      const parsedProfiles = JSON.parse(savedProfiles);
      setProfiles(parsedProfiles);
    }
  }, []);

  const handleProfileSelect = (profile: Profile) => {
    if (selectedProfileId === profile.id) {
      // Deselect if already selected
      setSelectedProfileId(null);
      onSelect(null);
    } else {
      // Select the profile
      setSelectedProfileId(profile.id);
      onSelect(profile);
    }
  };

  // Filter profiles based on search query
  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (profile.github && profile.github.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (profile.x && profile.x.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (profiles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <label className="text-sm font-medium flex-grow">Load Profile</label>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search profiles..."
            className="pl-8 h-8 w-[200px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredProfiles.map(profile => (
          <SelectableProfileCard
            key={profile.id}
            profile={profile}
            isSelected={selectedProfileId === profile.id}
            onClick={() => handleProfileSelect(profile)}
          />
        ))}

        {filteredProfiles.length === 0 && (
          <div className="col-span-full text-center py-6 text-muted-foreground">
            No profiles found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSelector;