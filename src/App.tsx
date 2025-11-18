import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { OnboardingModal } from "@/components/OnboardingModal";
import { AuthGate } from "@/components/AuthGate";
import { Layout } from "@/components/Layout";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Property from "./pages/Property";
import TestPreset from "./pages/TestPreset";
import Auth from "./pages/Auth";
import AcceptInvite from "./pages/AcceptInvite";
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
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/auth" element={<Navigate to="/login" replace />} />
          <Route path="/accept-invite" element={<AcceptInvite />} />
          <Route path="/test" element={<TestPreset />} />
          
          {/* Protected routes */}
          <Route
            path="/app"
            element={
              <AuthGate>
                <Layout>
                  <Index />
                </Layout>
              </AuthGate>
            }
          />
          <Route
            path="/listing-generator"
            element={<Navigate to="/app" replace />}
          />
          <Route
            path="/my-properties"
            element={
              <AuthGate>
                <Layout>
                  <MyProperties />
                </Layout>
              </AuthGate>
            }
          />
          <Route
            path="/contact-info"
            element={
              <AuthGate>
                <Layout>
                  <ContactInfo />
                </Layout>
              </AuthGate>
            }
          />
          <Route
            path="/property"
            element={
              <AuthGate>
                <Property />
              </AuthGate>
            }
          />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
