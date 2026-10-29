import React, { useState } from 'react';
import { Heart, MessageSquare, Sparkles, UserCheck, Menu, X, Compass, Video, BookOpen, User, Crown, LogOut, LogIn, Phone, PhoneIncoming, Edit3, MessageCircle, Users, ShieldCheck, Smartphone, Download } from 'lucide-react';
import { Profile } from '../types/matrimony';

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
  myProfile?: Profile | null;
  openMyProfile?: () => void;
  onSimulateIncomingCall?: () => void;
  openOneToOne?: () => void;
  openApkModal?: () => void;
  isAdminAuthenticated?: boolean;
  openAdminLogin?: () => void;
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
  myProfile,
  openMyProfile,
  onSimulateIncomingCall,
  openOneToOne,
  openApkModal,
  isAdminAuthenticated,
  openAdminLogin,
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
              <span>husbandwife</span>
              <span className="text-rose-600">.com</span>
            </button>

            {/* Zone 2: Desktop 4-5 concise single-line nav links */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-neutral-600">
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
              {openOneToOne && (
                <button
                  onClick={openOneToOne}
                  className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1.5 text-neutral-800 font-semibold"
                >
                  <Users className="w-4 h-4 text-rose-600" />
                  <span>1-to-1 Connect</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 bg-emerald-100 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    Live
                  </span>
                </button>
              )}
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
              {/* 1-to-1 Real Connection quick launch button */}
              {openOneToOne && (
                <button
                  onClick={openOneToOne}
                  title="Open 1-to-1 Real Connection (Live Video & Private Chat)"
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs min-h-[38px]"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">1-to-1 Connect</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </button>
              )}

              {/* Shortlist button */}
              <button
                onClick={() => navigateTo('shortlisted')}
                title="Shortlisted Profiles"
                className="relative min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] flex items-center justify-center p-2 text-neutral-600 hover:text-rose-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <Heart className="w-5 h-5" />
                {shortlistCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {shortlistCount}
                  </span>
                )}
              </button>

              {/* WhatsApp Chat button */}
              <button
                onClick={openInbox}
                title="WhatsApp Matrimony Chat (Boys & Girls)"
                className="relative min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] flex items-center justify-center p-2 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                {inboxCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#25D366] text-white text-[10px] font-bold flex items-center justify-center">
                    {inboxCount}
                  </span>
                )}
              </button>

              {/* Test Call button (Direct simulation trigger) */}
              {onSimulateIncomingCall && (
                <button
                  onClick={onSimulateIncomingCall}
                  title="Test Receiving an Incoming Call from a Match"
                  className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold transition-all shadow-xs"
                >
                  <PhoneIncoming className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>Test Call</span>
                </button>
              )}

              {/* Desktop Account / Register state */}
              <div className="hidden sm:flex items-center gap-2">
                {isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={openMyProfile}
                      className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-semibold text-rose-900 transition-colors"
                      title="Mera Biodata & Bio Editor"
                    >
                      {myProfile?.photos?.[0] ? (
                        <img
                          src={myProfile.photos[0]}
                          alt={myProfile.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <UserCheck className="w-4 h-4 text-rose-600" />
                      )}
                      <span>{myProfile?.name || 'Aarav Patel'}</span>
                      <span className="text-[10px] bg-rose-200/80 text-rose-800 px-1.5 py-0.5 rounded font-bold">Bio</span>
                    </button>
                    <button
                      onClick={() => setIsLoggedIn(false)}
                      className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsLoggedIn(false)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#1EBE5D] rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white text-[#25D366]" />
                    <span>Login with WhatsApp OTP</span>
                  </button>
                )}
              </div>

              {/* Admin Portal Button - ONLY SHOWN IF AUTHENTICATED AS ADMIN */}
              {isAdminAuthenticated && (
                <button
                  onClick={() => navigateTo('admin')}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-amber-300 bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs transition-colors border border-amber-500/50 min-h-[38px] animate-fadeIn"
                  title="Enterprise Administration & Control Portal (Admin Active)"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin 👑</span>
                </button>
              )}

              {/* Install App / APK Button */}
              {openApkModal && (
                <button
                  onClick={openApkModal}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg shadow-xs transition-colors min-h-[38px]"
                  title="Phone App / Android APK Download & Share"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden sm:inline">App / APK</span>
                </button>
              )}

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
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                {isLoggedIn ? (
                  <div className="flex items-center gap-3">
                    {myProfile?.photos?.[0] ? (
                      <img
                        src={myProfile.photos[0]}
                        alt={myProfile.name}
                        className="w-10 h-10 rounded-full object-cover border border-rose-300"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                        {myProfile?.name?.slice(0, 2).toUpperCase() || 'AP'}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">{myProfile?.name || 'Aarav Patel'} (You)</h4>
                      <span className="text-[11px] text-emerald-700 font-medium">✓ {myProfile?.gender === 'female' ? 'Bride (Ladki)' : 'Groom (Ladka)'} · Verified</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className="text-xs font-bold text-neutral-900">Welcome to husbandwife.com</p>
                    <p className="text-[11px] text-neutral-500">Apna matrimonial profile & bio banayein</p>
                  </div>
                )}

                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setMenuOpen(false);
                    }}
                    className="p-1.5 text-neutral-500 hover:text-neutral-900 text-xs flex items-center gap-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-lg text-xs font-bold"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white text-[#25D366]" />
                    <span>WhatsApp OTP Login</span>
                  </button>
                )}
              </div>

              {/* Quick Profile & Call Action Bar in Mobile Drawer */}
              <div className="flex items-center gap-2 pt-1 border-t border-neutral-200">
                {openMyProfile && (
                  <button
                    onClick={() => {
                      openMyProfile();
                      setMenuOpen(false);
                    }}
                    className="flex-1 py-2 px-3 bg-white hover:bg-rose-50 text-rose-700 border border-neutral-300 hover:border-rose-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Mera Profile & Bio</span>
                  </button>
                )}

                {onSimulateIncomingCall && (
                  <button
                    onClick={() => {
                      onSimulateIncomingCall();
                      setMenuOpen(false);
                    }}
                    className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <PhoneIncoming className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Test Call</span>
                  </button>
                )}
              </div>
            </div>

            {/* Navigation links list */}
            <div className="space-y-1">
              {openOneToOne && (
                <button
                  onClick={() => {
                    openOneToOne();
                    setMenuOpen(false);
                  }}
                  className="w-full min-h-[44px] flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-rose-950 bg-rose-50/80 hover:bg-rose-100 border border-rose-200 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>1-to-1 Real Connection</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      </div>
                      <p className="text-[10px] text-rose-700 font-normal">Realtime Private Chat & Live Video Face</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">JOIN</span>
                </button>
              )}

              {openApkModal && (
                <button
                  onClick={() => {
                    openApkModal();
                    setMenuOpen(false);
                  }}
                  className="w-full min-h-[44px] flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>Download App & APK</span>
                        <span className="text-[9px] bg-emerald-700 text-white px-1.5 py-0.2 rounded font-bold">ANDROID</span>
                      </div>
                      <p className="text-[10px] text-emerald-700 font-normal">Phone me install karein & doston ko share karein</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-emerald-700" />
                </button>
              )}

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

              {/* Admin Management Portal - ONLY SHOWN IF AUTHENTICATED AS ADMIN */}
              {isAdminAuthenticated && (
                <button
                  onClick={() => navigateTo('admin')}
                  className="w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-amber-300 bg-neutral-900 hover:bg-neutral-800 text-left border border-amber-500/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between flex-1">
                    <span>Admin Management Portal</span>
                    <span className="text-[9px] bg-amber-500 text-neutral-950 px-1.5 py-0.5 rounded font-bold">ADMIN ACTIVE 👑</span>
                  </div>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
