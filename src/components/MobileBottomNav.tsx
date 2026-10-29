import React from 'react';
import { Search, Video, Compass, Heart, Menu, MessageSquare, User, MessageCircle, Users } from 'lucide-react';

interface MobileBottomNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
  openLive: () => void;
  openKundli: () => void;
  openInbox: () => void;
  shortlistCount: number;
  inboxCount: number;
  openMobileMenu: () => void;
  openMyProfile?: () => void;
  openOneToOne?: () => void;
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
  openMyProfile,
  openOneToOne,
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

        {/* Tab 2: 1-to-1 Real Connect */}
        <button
          onClick={() => {
            if (openOneToOne) {
              openOneToOne();
            } else {
              openLive();
            }
          }}
          className="relative flex flex-col items-center justify-center min-h-[44px] py-1 text-rose-600 hover:text-rose-700 transition-colors"
        >
          <div className="relative">
            <Users className="w-5 h-5 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 font-bold text-rose-600">1-to-1 Real</span>
        </button>

        {/* Tab 3: Kundli */}
        <button
          onClick={openKundli}
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <Compass className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-tight mt-0.5">Kundli</span>
        </button>

        {/* Tab 4: WhatsApp Chat */}
        <button
          onClick={openInbox}
          className="relative flex flex-col items-center justify-center min-h-[44px] py-1 text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 stroke-[2.2] text-[#25D366]" />
            {inboxCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#25D366] text-white text-[9px] font-bold flex items-center justify-center">
                {inboxCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 font-semibold text-emerald-800">WhatsApp</span>
        </button>

        {/* Tab 5: My Bio / Profile */}
        <button
          onClick={() => {
            if (openMyProfile) {
              openMyProfile();
            } else {
              openMobileMenu();
            }
          }}
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-neutral-500 hover:text-rose-600 transition-colors"
        >
          <User className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-tight mt-0.5">My Bio</span>
        </button>

      </div>
    </nav>
  );
};
