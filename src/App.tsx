import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LearningPage from "./pages/LearningPage";
import CommunityPage from "./pages/CommunityPage";
import GamePage from "./pages/GamePage";
import NewGameAIPage from "./pages/NewGameAIPage";
import PlayOnlinePage from "./pages/PlayOnlinePage";
import ProfilePage from "./pages/ProfilePage";
import PuzzlesPage from "./pages/PuzzlesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="max-w-md mx-auto min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<LearningPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/new-game-ai" element={<NewGameAIPage />} />
            <Route path="/play-online" element={<PlayOnlinePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/puzzles" element={<PuzzlesPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
