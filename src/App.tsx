import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./hooks/useAuth";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import Dashboard from "./pages/Dashboard";
import Converter from "./pages/Converter";
import Documentation from "./pages/Documentation";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/editor" element={<EditorPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/converter" element={<Converter />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
