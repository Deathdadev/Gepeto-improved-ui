import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/types/Profile";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSkip = () => {
    toast({
      title: "Profile setup skipped",
      description: "You can create profiles later from the Profiles section"
    });
    navigate("/");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Profile name is required",
        variant: "destructive"
      });
      return;
    }

    // Create new profile
    const newProfile: Profile = {
      id: uuidv4(),
      ...formData
    };
    
    // Save to localStorage
    const profiles = [newProfile];
    localStorage.setItem("profiles", JSON.stringify(profiles));
    
    toast({
      title: "Profile created",
      description: `Profile "${formData.name}" has been created successfully`
    });
    
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Set Up Your Profile</CardTitle>
          <CardDescription>
            Create a profile to save your publisher information for use across projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
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
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  placeholder="GitHub username"
                  value={formData.github}
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
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleSkip}>Skip for now</Button>
          <Button onClick={handleSubmit}>Create Profile</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileSetup;