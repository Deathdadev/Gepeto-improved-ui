import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { GeneratedAppContextProvider } from "./contexts/GeneratedAppContext"; // Added import
import GeneratedAppPage from "@/pages/GeneratedAppPage"; // Use path alias
import Layout from "./components/Layout"; // Added import for Layout
import ProfilesSection from "@/components/ProfilesSection"; // Import ProfilesSection

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GeneratedAppContextProvider> {/* Wrapped with provider */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route element={<Layout />}> {/* Wrap routes with Layout */}
              <Route path="/" element={<Index />} />
              <Route path="/profiles" element={<ProfilesSection />} /> {/* Added profiles route */}
              <Route path="/generated-app/:appName" element={<GeneratedAppPage />} /> {/* Added new route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </GeneratedAppContextProvider>
  </QueryClientProvider>
);

export default App;
