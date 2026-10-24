import React, { useState } from 'react';
import { Heart, MessageSquare, Sparkles, UserCheck, Menu, X, Compass, Video, BookOpen, User, Crown, LogOut, LogIn } from 'lucide-react';

interface NavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  openRegistration: () => void;
  openUpgrade: () => void;
  openInbox: () => void;
  openKundliCalc: () => void;
  shortlistCount: number;
  inboxCount: number;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  openRegistration,
  openUpgrade,
  openInbox,
  openKundliCalc,
  shortlistCount,
  inboxCount,
  isLoggedIn,
  setIsLoggedIn,
  isMobileMenuOpen: externalMenuOpen,
  setIsMobileMenuOpen: setExternalMenuOpen,
}) => {
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const isMenuOpen = externalMenuOpen !== undefined ? externalMenuOpen : internalMenuOpen;
  const setMenuOpen = setExternalMenuOpen || setInternalMenuOpen;

  const navigateTo = (view: string) => {
    setActiveView(view);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 safe-top">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 sm:gap-8 h-16 sm:h-18">
            
            {/* Zone 1: Single text element wordmark */}
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-1 text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 font-serif whitespace-nowrap shrink-0 text-left focus:outline-none min-h-[44px]"
            >
              <span>couple</span>
              <span className="text-rose-600">.com</span>
            </button>

            {/* Zone 2: Desktop 4-5 concise single-line nav links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
              <button
                onClick={() => navigateTo('matches')}
                className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                  activeView === 'matches' ? 'text-neutral-950 font-semibold border-b-2 border-rose-600' : ''
                }`}
              >
                Browse Matches
              </button>
              <button
                onClick={() => navigateTo('live')}
                className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1.5 ${
                  activeView === 'live' ? 'text-neutral-950 font-semibold border-b-2 border-rose-600' : ''
                }`}
              >
                <span>Couple Live</span>
                <span className="text-[10px] font-semibold text-rose-600 uppercase tracking-wider">Speed Meet</span>
              </button>
              <button
                onClick={openKundliCalc}
                className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5"
              >
                Kundli Milan
              </button>
              <button
                onClick={() => navigateTo('stories')}
                className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                  activeView === 'stories' ? 'text-neutral-950 font-semibold border-b-2 border-rose-600' : ''
                }`}
              >
                Success Stories
              </button>
              <button
                onClick={() => navigateTo('about')}
                className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                  activeView === 'about' ? 'text-neutral-950 font-semibold border-b-2 border-rose-600' : ''
                }`}
              >
                About Founder
              </button>
              <button
                onClick={openUpgrade}
                className="hover:text-rose-700 transition-colors whitespace-nowrap shrink-0 pb-0.5 text-amber-700 font-semibold flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>VIP Plans</span>
              </button>
            </nav>

            {/* Zone 3: Actions area */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Shortlist button */}
              <button
                onClick={() => navigateTo('shortlisted')}
                title="Shortlisted Profiles"
                className="relative min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-neutral-600 hover:text-rose-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <Heart className="w-5 h-5" />
                {shortlistCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {shortlistCount}
                  </span>
                )}
              </button>

              {/* Inbox button */}
              <button
                onClick={openInbox}
                title="Messages & Connects"
                className="relative min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                {inboxCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {inboxCount}
                  </span>
                )}
              </button>

              {/* Desktop Account / Register state */}
              <div className="hidden sm:flex items-center gap-2">
                {isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsLoggedIn(false)}
                      className="px-3.5 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
                    >
                      Log Out
                    </button>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-800">
                      <UserCheck className="w-3.5 h-3.5 text-rose-600" />
                      <span>Aarav Patel</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={openRegistration}
                    className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
                  >
                    Register Free
                  </button>
                )}
              </div>

              {/* Mobile Hamburger Menu Button (Touch Target >= 44px) */}
              <button
                onClick={() => setMenuOpen(!isMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-30 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border-b border-neutral-200 p-5 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto shadow-2xl">
            
            {/* User status card on mobile */}
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                    AP
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Aarav Patel (You)</h4>
                    <span className="text-[11px] text-emerald-700 font-medium">✓ Verified Biodata</span>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <p className="text-xs font-bold text-neutral-900">Welcome to couple.com</p>
                  <p className="text-[11px] text-neutral-500">Create your free matrimonial profile</p>
                </div>
              )}

              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setMenuOpen(false);
                  }}
                  className="p-2 text-neutral-500 hover:text-neutral-900 text-xs flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    openRegistration();
                    setMenuOpen(false);
                  }}
                  className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold"
                >
                  Register
                </button>
              )}
            </div>

            {/* Navigation links list */}
            <div className="space-y-1">
              <button
                onClick={() => navigateTo('matches')}
                className="w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-800 hover:bg-neutral-100 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <Heart className="w-4 h-4 text-rose-600" />
                </div>
                <span>Browse Verified Matches</span>
              </button>

              <button
                onClick={() => navigateTo('live')}
                className="w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-800 hover:bg-neutral-100 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                  <Video className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span>Couple Live Speed Meet</span>
                  <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.5 rounded-full font-bold">LIVE</span>
                </div>
              </button>

              <button
                onClick={() => {
                  openKundliCalc();
                  setMenuOpen(false);
                }}
                className="w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-800 hover:bg-neutral-100 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
                  <Compass className="w-4 h-4" />
                </div>
                <span>Kundli Milan (36 Gunas)</span>
              </button>

              <button
                onClick={() => navigateTo('about')}
                className="w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-800 hover:bg-neutral-100 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
                  <User className="w-4 h-4" />
                </div>
                <span>About Founder (Bablu-Rajput)</span>
              </button>

              <button
                onClick={() => navigateTo('stories')}
                className="w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-800 hover:bg-neutral-100 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span>Success Stories</span>
              </button>

              <button
                onClick={() => {
                  openUpgrade();
                  setMenuOpen(false);
                }}
                className="w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-50/70 hover:bg-amber-100 text-left border border-amber-200 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-200/70 flex items-center justify-center text-amber-800">
                  <Crown className="w-4 h-4" />
                </div>
                <span>VIP Membership Plans</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
