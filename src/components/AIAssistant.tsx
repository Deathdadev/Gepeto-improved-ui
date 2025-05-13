import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { marked } from "marked";

const AIAssistant = () => {
  const { toast } = useToast();
  const [documentation, setDocumentation] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const markdownContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDocumentation = async () => {
      try {
        const response = await fetch("https://raw.githubusercontent.com/pinokiocomputer/program.pinokio.computer/refs/heads/main/README.md");
        if (!response.ok) {
          throw new Error("Failed to fetch documentation");
        }
        const text = await response.text();
        setDocumentation(text);
      } catch (error) {
        console.error("Error fetching documentation:", error);
        toast({
          title: "Error",
          description: "Failed to fetch Pinokio documentation",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentation();
  }, [toast]);

  useEffect(() => {
    if (markdownContentRef.current && documentation) {
      // Use marked correctly to convert markdown to HTML
      markdownContentRef.current.innerHTML = marked.parse(documentation);
    }
  }, [documentation, activeTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive"
      });
      return;
    }

    // Simulate AI response (in a real app, this would call an AI API)
    setIsThinking(true);
    
    // Mock AI response with setTimeout
    setTimeout(() => {
      // Generate a mock response that references the documentation
      const mockResponses = [
        `Based on the Pinokio documentation, I can help you with that. To create a new Pinokio project, you need to:\n\n1. Define a project.json file\n2. Add the necessary dependencies\n3. Create your entry point file\n\nWould you like me to provide sample code for any of these steps?`,
        `Looking at the documentation, Pinokio is a programmable agent that allows you to create and run workflows. For your question, you'll need to use the Pinokio API to:\n\n- Access the file system with the 'fs' module\n- Make requests with the 'request' module\n- Handle the program flow as needed\n\nThe key part is structuring your program.json correctly.`,
        `According to the documentation, you can integrate Git repositories in Pinokio by adding the repository URL to your project configuration. This allows Pinokio to pull code directly from GitHub or other Git providers.`,
      ];
      
      // Select a random response
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setResponse(randomResponse);
      setIsThinking(false);
    }, 2000);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Pinokio AI Assistant</CardTitle>
          <CardDescription>
            Ask questions about Pinokio or get help creating files for your repository
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="chat">AI Chat</TabsTrigger>
              <TabsTrigger value="docs">Documentation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="space-y-4">
              <form onSubmit={handleSubmit}>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Ask about Pinokio or how to create files..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isThinking}>
                    {isThinking ? "Thinking..." : "Ask"}
                  </Button>
                </div>
              </form>

              {response && (
                <div className="mt-4 p-4 bg-secondary rounded-md">
                  <h3 className="text-sm font-medium mb-2">Response:</h3>
                  <div className="whitespace-pre-line">{response}</div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="docs">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="markdown-content max-h-96 overflow-y-auto prose prose-sm dark:prose-invert" ref={markdownContentRef}>
                  {/* Markdown content will be injected here */}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;