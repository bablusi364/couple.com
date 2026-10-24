import React from 'react';
import { Search, Video, Compass, Heart, Menu, MessageSquare } from 'lucide-react';

interface MobileBottomNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
  openLive: () => void;
  openKundli: () => void;
  openInbox: () => void;
  shortlistCount: number;
  inboxCount: number;
  openMobileMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  setActiveView,
  openLive,
  openKundli,
  openInbox,
  shortlistCount,
  inboxCount,
  openMobileMenu,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-neutral-200 shadow-lg safe-bottom">
      <div className="grid grid-cols-5 items-center h-16 px-1">
        
        {/* Tab 1: Matches */}
        <button
          onClick={() => setActiveView('matches')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeView === 'matches' || activeView === 'home'
              ? 'text-rose-600 font-bold'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Search className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-tight mt-0.5">Matches</span>
        </button>

        {/* Tab 2: Couple Live */}
        <button
          onClick={openLive}
          className={`relative flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeView === 'live' ? 'text-rose-600 font-bold' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <div className="relative">
            <Video className="w-5 h-5 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-600" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Live Meet</span>
        </button>

        {/* Tab 3: Kundli */}
        <button
          onClick={openKundli}
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <Compass className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-tight mt-0.5">Kundli</span>
        </button>

        {/* Tab 4: Messages / Shortlist */}
        <button
          onClick={openInbox}
          className="relative flex flex-col items-center justify-center min-h-[44px] py-1 text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 stroke-[2.2]" />
            {inboxCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                {inboxCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Inbox</span>
        </button>

        {/* Tab 5: More / Menu */}
        <button
          onClick={openMobileMenu}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeView === 'about' ? 'text-rose-600 font-bold' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-tight mt-0.5">Menu</span>
        </button>

      </div>
    </nav>
  );
};
