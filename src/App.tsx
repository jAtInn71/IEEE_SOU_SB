// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/lib/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Main Pages
import Index from "./pages/Index";
import Events from "./pages/Events";
import Members from "./pages/Members";
import Awards from "./pages/Awards";
import Contact from "./pages/Contact";
import Join from "./pages/Join";
import NotFound from "./pages/NotFound";

// About Pages
import IEEE from "./pages/about/IEEE";
import IEEESOUSSB from "./pages/about/IEEESOUSSB";
import IEEEOUSSBWIE from "./pages/about/IEEEOUSSBWIE";
import IEEESOUSPSSBC from "./pages/about/IEEESOUSPSSBC";
import IEEESOUSCSSBC from "./pages/about/IEEESOUSCSSBC";
import IEEESOUSSIGHTSBG from "./pages/about/IEEESOUSSIGHTSBG";

// Team Pages
import TeamFaculty from "./pages/team/TeamFaculty";
import TeamAdvisory from "./pages/team/TeamAdvisory";
import TeamExecutive from "./pages/team/TeamExecutive";
import TeamCore from "./pages/team/TeamCore";
import TeamMembers from "./pages/team/TeamMembers";
import Admin from "./pages/Admin";
import Authentication from "./components/Authentication";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import EventDetails from "./pages/EventDetails";
import AwardDetails from "./pages/AwardDetails.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<Index />} />
              <Route path="/events" element={<Events />} />
              <Route path="/members" element={<Members />} />
              <Route path="/awards" element={<Awards />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/join" element={<Join />} />

              {/* About Pages */}
              <Route path="/about/ieee" element={<IEEE />} />
              <Route path="/about/ieee-sou-sb" element={<IEEESOUSSB />} />
              <Route path="/about/ieee-sou-wie-sb-ag" element={<IEEEOUSSBWIE />} />
              <Route path="/about/ieee-sou-sps-sbc" element={<IEEESOUSPSSBC />} />
              <Route path="/about/ieee-sou-cs-sbc" element={<IEEESOUSCSSBC />} />
              <Route path="/about/ieee-sou-sight-sbg" element={<IEEESOUSSIGHTSBG />} />

              {/* Team Pages */}
              <Route path="/team/faculty-advisor" element={<TeamFaculty />} />
              <Route path="/team/advisory-board" element={<TeamAdvisory />} />
              <Route path="/team/executive-members" element={<TeamExecutive />} />
              <Route path="/team/core-members" element={<TeamCore />} />
              <Route path="/team/members" element={<TeamMembers />} />

              {/* Firebase Auth */}
              <Route path="/authentication" element={<Authentication />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="eventdetails/:id" element={<EventDetails />} />
              <Route path="/awarddetails/:id" element={<AwardDetails />} />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
