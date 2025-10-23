import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OnboardingModal } from "@/components/OnboardingModal";
import Index from "./pages/Index";
import Property from "./pages/Property";
import TestPreset from "./pages/TestPreset";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import MyProperties from "./pages/MyProperties";
import ContactInfo from "./pages/ContactInfo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <OnboardingModal />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/property" element={<Property />} />
          <Route path="/test" element={<TestPreset />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/my-properties" element={<MyProperties />} />
          <Route path="/contact-info" element={<ContactInfo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
