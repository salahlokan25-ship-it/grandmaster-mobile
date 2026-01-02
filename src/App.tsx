import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { LearningPage } from './pages/LearningPage';
import { CommunityPage } from './pages/CommunityPage';
import { GamePage } from './pages/GamePage';
import { NewGameAIPage } from './pages/NewGameAIPage';
import { PlayOnlinePage } from './pages/PlayOnlinePage';
import { ProfilePage } from './pages/ProfilePage';
import { PuzzlesPage } from './pages/PuzzlesPage';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Page = 'home' | 'learning' | 'community' | 'game' | 'new-game-ai' | 'play-online' | 'profile' | 'puzzles';

const queryClient = new QueryClient();

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'learning':
        return <LearningPage onBack={() => setCurrentPage('home')} />;
      case 'community':
        return <CommunityPage onBack={() => setCurrentPage('home')} />;
      case 'game':
        return <GamePage onBack={() => setCurrentPage('home')} />;
      case 'new-game-ai':
        return (
          <NewGameAIPage
            onBack={() => setCurrentPage('home')}
            onStart={() => setCurrentPage('game')}
          />
        );
      case 'play-online':
        return (
          <PlayOnlinePage
            onBack={() => setCurrentPage('home')}
            onFindOpponent={() => setCurrentPage('game')}
          />
        );
      case 'profile':
        return <ProfilePage />;
      case 'puzzles':
        return <PuzzlesPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="max-w-md mx-auto min-h-screen bg-background">
          {renderPage()}
          
          {/* Quick Navigation for Demo */}
          <div className="fixed top-4 right-4 z-50 flex flex-col gap-1">
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(e.target.value as Page)}
              className="px-2 py-1 text-xs rounded bg-card border border-border text-foreground"
            >
              <option value="home">Home</option>
              <option value="learning">Learning</option>
              <option value="community">Community</option>
              <option value="puzzles">Puzzles</option>
              <option value="profile">Profile</option>
              <option value="new-game-ai">New Game vs AI</option>
              <option value="play-online">Play Online</option>
              <option value="game">Game</option>
            </select>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
