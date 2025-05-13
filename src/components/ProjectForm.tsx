import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Github, Link, Bitcoin, Twitter, Coffee, Send, Gift, Cloud, Settings2 } from "lucide-react"; // Removed SquareTerminal, Play
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Tabs no longer needed for single content
import { useToast } from "@/components/ui/use-toast";
import ProfileSelector from "@/components/ProfileSelector";
import { Profile } from "@/types/Profile";
import { useGeneratedAppContext } from "@/contexts/GeneratedAppContext"; // Added context import

const ProjectForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate(); // Hook for navigation
  const { addGeneratedApp } = useGeneratedAppContext(); // Consume context
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
  // Removed generatedScriptUrl and activeTab states

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

    const params = new URLSearchParams();
    params.set("name", formData.name);
    if (formData.git) params.set("git", formData.git);
    params.set("icon", formData.icon || "");
    
    if (formData.x) params.set("x", `https://x.com/${formData.x}`);
    if (formData.github) params.set("github", `https://github.com/${formData.github}`);
    if (formData.buymeacoffee) params.set("buymeacoffee", `https://buymeacoffee.com/${formData.buymeacoffee}`);
    if (formData.kofi) params.set("kofi", `https://ko-fi.com/${formData.kofi}`);
    if (formData.bsky) params.set("bsky", `https://bsky.app/profile/${formData.bsky}`);
    if (formData.website) params.set("website", formData.website);
    if (formData.bitcoin) params.set("bitcoin", formData.bitcoin);
    
    const scriptUrl = `http://localhost:42000/api/gepeto.git/start.js?${params.toString()}`;

    addGeneratedApp({
      appName: formData.name,
      appIcon: formData.icon,
      generatedScriptUrl: scriptUrl,
    });
    
    toast({
      title: "Project generated",
      description: `Configuration for "${formData.name}" saved. Navigating to app page.`
    });
    console.log("Generated URL for context:", scriptUrl);
    
    // Navigate to the new page
    navigate(`/generated-app/${encodeURIComponent(formData.name)}`);
  };

  // Removed appTabValue

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle> <Settings2 className="inline-block mr-2 h-5 w-5" /> Create New Project</CardTitle>
        <CardDescription>Fill in the details to generate your new Pinokio project.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Simplified: No Tabs needed if only one content section */}
        <form onSubmit={handleSubmit} className="mt-4">
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
                <p className="text-xs text-muted-foreground">A folder will be created with this name. This will also be the name in the navigation.</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="icon">Icon URL</Label>
                <Input
                  id="icon"
                  placeholder="Icon URL (optional)"
                  value={formData.icon}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">Icon for the project in the navigation.</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="git">Git URL</Label>
                <Input
                  id="git"
                  placeholder="Git repository URL (optional)"
                  value={formData.git}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">Leave empty to start an empty project.</p>
              </div>
            </div>

            <Accordion type="single" collapsible defaultValue="publisher-info">
              <AccordionItem value="publisher-info">
                <AccordionTrigger>Publisher Info (optional)</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4">
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
                          className="pl-10"
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button type="submit" className="w-full">
              <Send className="mr-2 h-4 w-4" /> Generate & View Project
            </Button>
          </div>
        </form>
        {/* Removed Tabs and TabsContent for the iframe */}
      </CardContent>
    </Card>
  );
};

export default ProjectForm;