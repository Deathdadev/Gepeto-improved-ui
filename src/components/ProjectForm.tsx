import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import ProfileSelector from "@/components/ProfileSelector";
import { Profile } from "@/types/Profile";

const ProjectForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    git: "",
    x: "",
    github: "",
    buymeacoffee: "",
    kofi: "",
    bsky: "",
    website: "",
    bitcoin: ""
  });
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleProfileSelect = (profile: Profile | null) => {
    setSelectedProfile(profile);
    if (profile) {
      setFormData(prev => ({
        ...prev,
        x: profile.x || "",
        github: profile.github || "",
        buymeacoffee: profile.buymeacoffee || "",
        kofi: profile.kofi || "",
        bsky: profile.bsky || "",
        website: profile.website || "",
        bitcoin: profile.bitcoin || ""
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive"
      });
      return;
    }

    if (/\s/.test(formData.name)) {
      toast({
        title: "Error",
        description: "The project name must not contain spaces",
        variant: "destructive"
      });
      return;
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.set("name", formData.name);
    if (formData.git) params.set("git", formData.git);
    if (formData.icon) params.set("icon", formData.icon);
    
    if (formData.x) params.set("x", `https://x.com/${formData.x}`);
    if (formData.github) params.set("github", `https://github.com/${formData.github}`);
    if (formData.buymeacoffee) params.set("buymeacoffee", `https://buymeacoffee.com/${formData.buymeacoffee}`);
    if (formData.kofi) params.set("kofi", `https://ko-fi.com/${formData.kofi}`);
    if (formData.bsky) params.set("bsky", `https://bsky.app/profile/${formData.bsky}`);
    if (formData.website) params.set("website", formData.website);
    if (formData.bitcoin) params.set("bitcoin", formData.bitcoin);
    
    // In a real app, this would redirect to the backend
    toast({
      title: "Project generated",
      description: "Your project is being created with the specified parameters"
    });
    console.log("Generated URL:", `start.js?${params.toString()}`);
    
    // Simulate redirect (in a real app, this would navigate to start.js)
    // window.location.href = `start.js?${params.toString()}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>Fill in the details to generate your new Pinokio project</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <ProfileSelector onSelect={handleProfileSelect} />

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name</Label>
                <Input 
                  id="name" 
                  placeholder="Project name (no spaces)" 
                  value={formData.name} 
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">A folder will be created with this name</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="icon">Icon URL</Label>
                <Input 
                  id="icon" 
                  placeholder="Icon URL" 
                  value={formData.icon}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">Leave empty to use the default icon</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="git">Git URL</Label>
                <Input 
                  id="git" 
                  placeholder="Git repository URL" 
                  value={formData.git}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">Leave empty to start an empty project</p>
              </div>
            </div>

            <Accordion type="single" collapsible defaultValue="publisher-info">
              <AccordionItem value="publisher-info">
                <AccordionTrigger>Publisher Info (optional)</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4">
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button type="submit" className="w-full">Generate Project</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectForm;