import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { MainContent } from './components/MainContent';
import { RightSidebar } from './components/RightSidebar';
import { MobileNav } from './components/MobileNav';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'profile'>('home');

  return (
    <ThemeProvider>
      <UserProvider>
        <div className="relative h-screen w-full flex flex-col overflow-hidden">
          {/* Background Atmosphere */}
          <div className="atmosphere" />
          
          <div className="flex flex-1 overflow-hidden relative">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <MainContent activeTab={activeTab} />
            <RightSidebar />
          </div>
          
          <Player isExpanded={isPlayerExpanded} setIsExpanded={setIsPlayerExpanded} />
          {!isPlayerExpanded && <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />}
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}
