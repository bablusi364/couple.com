import React, { useState, useEffect } from 'react';
import { FilterState, Profile, Connection, MembershipPlan } from './types/matrimony';
import { PROFILES } from './data/mockProfiles';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { MatchFeed } from './components/MatchFeed';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { CoupleLiveModal } from './components/CoupleLiveModal';
import { InboxDrawer } from './components/InboxDrawer';
import { KundliCalculatorModal } from './components/KundliCalculatorModal';
import { RegistrationWizardModal } from './components/RegistrationWizardModal';
import { UpgradePlansModal } from './components/UpgradePlansModal';
import { SuccessStories } from './components/SuccessStories';
import { AboutFounder } from './components/AboutFounder';
import { TrustSafety } from './components/TrustSafety';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';

export default function App() {
  const [profiles, setProfiles] = useState<Profile[]>(PROFILES);
  const [activeView, setActiveView] = useState<'home' | 'matches' | 'live' | 'stories' | 'shortlisted' | 'about'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Filter state for matchmaking
  const [filters, setFilters] = useState<FilterState>({
    lookingFor: 'female',
    minAge: 21,
    maxAge: 35,
    religion: 'Any',
    motherTongue: 'Any',
    city: 'Any',
    education: 'Any',
    profession: 'Any',
    diet: 'Any',
    manglik: 'Any',
    minIncome: 'Any',
    verifiedOnly: false,
    activeTab: 'all',
  });

  // Shortlists & Connections state
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(['p-1', 'p-3']);
  const [connections, setConnections] = useState<Record<string, Connection>>({
    'p-1': {
      profileId: 'p-1',
      status: 'accepted',
      sentAt: 'Yesterday',
      messages: [
        {
          id: 'm-1',
          senderId: 'p-1',
          text: 'Namaste Aarav! I read through your profile and was very impressed by your family values and work.',
          timestamp: 'Yesterday, 6:30 PM',
          isSelf: false,
        },
        {
          id: 'm-2',
          senderId: 'self',
          text: 'Hello Ananya! Thank you so much. It is wonderful connecting with you. I really enjoyed reading about your interest in classical music.',
          timestamp: 'Yesterday, 7:15 PM',
          isSelf: true,
        },
      ],
      contactRevealed: true,
    },
    'p-3': {
      profileId: 'p-3',
      status: 'pending',
      sentAt: 'Today, 11:30 AM',
      messages: [],
    },
  });

  // User status
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [hasPremium, setHasPremium] = useState(false);

  // Modals
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isKundliCalcOpen, setIsKundliCalcOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [activeChatProfileId, setActiveChatProfileId] = useState<string | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleShortlist = (id: string) => {
    setShortlistedIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Profile removed from shortlist');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Profile added to shortlist ❤️');
        return [...prev, id];
      }
    });
  };

  const handleConnect = (profile: Profile) => {
    setConnections((prev) => ({
      ...prev,
      [profile.id]: {
        profileId: profile.id,
        status: 'pending',
        sentAt: 'Just now',
        messages: [],
      },
    }));
    showToast(`Connect invitation sent to ${profile.name}!`);
  };

  const handleAcceptInterest = (profileId: string) => {
    setConnections((prev) => ({
      ...prev,
      [profileId]: {
        profileId,
        status: 'accepted',
        sentAt: 'Accepted',
        messages: [
          {
            id: `msg-${Date.now()}`,
            senderId: profileId,
            text: 'I am delighted we connected! Looking forward to conversing with you and your family.',
            timestamp: 'Just now',
            isSelf: false,
          },
        ],
        contactRevealed: true,
      },
    }));
    showToast('Interest accepted! You can now chat directly.');
  };

  const handleDeclineInterest = (profileId: string) => {
    setConnections((prev) => ({
      ...prev,
      [profileId]: {
        profileId,
        status: 'declined',
        sentAt: 'Declined',
        messages: [],
      },
    }));
    showToast('Interest respectfully declined');
  };

  const handleSendMessage = (profileId: string, text: string) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: 'self',
      text,
      timestamp: 'Just now',
      isSelf: true,
    };

    setConnections((prev) => {
      const conn = prev[profileId] || {
        profileId,
        status: 'accepted',
        sentAt: 'Just now',
        messages: [],
      };
      return {
        ...prev,
        [profileId]: {
          ...conn,
          messages: [...conn.messages, newMsg],
        },
      };
    });

    // Auto-reply simulation after 1.5s for lively experience
    setTimeout(() => {
      const targetP = profiles.find((p) => p.id === profileId);
      if (targetP) {
        const replyMsg = {
          id: `msg-reply-${Date.now()}`,
          senderId: profileId,
          text: `Thank you for your message! My parents and I are looking into coordinating with your family. Best regards, ${targetP.name}.`,
          timestamp: 'Just now',
          isSelf: false,
        };
        setConnections((prev) => {
          const currentConn = prev[profileId];
          if (!currentConn) return prev;
          return {
            ...prev,
            [profileId]: {
              ...currentConn,
              messages: [...currentConn.messages, replyMsg],
            },
          };
        });
      }
    }, 1500);
  };

  const handleOpenChat = (profile: Profile) => {
    setActiveChatProfileId(profile.id);
    setIsInboxOpen(true);
  };

  const handleUpgradeSuccess = (plan: MembershipPlan) => {
    setHasPremium(true);
    showToast(`VIP Plan ${plan.name} successfully activated!`);
  };

  const handleRegisterSuccess = (newProfileData: Partial<Profile>) => {
    setIsLoggedIn(true);
    showToast(`Welcome ${newProfileData.name}! Your free profile is live on couple.com.`);
    setActiveView('matches');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans selection:bg-rose-100 selection:text-rose-900 pb-16 md:pb-0 overflow-x-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-neutral-700 text-xs font-medium animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* Navbar (Zone 1 Brand, Zone 2 Nav, Zone 3 Actions, Mobile Drawer) */}
      <Navbar
        activeView={activeView}
        setActiveView={(v) => {
          if (v === 'live') {
            setIsLiveOpen(true);
          } else {
            setActiveView(v as any);
          }
        }}
        openRegistration={() => setIsRegistrationOpen(true)}
        openUpgrade={() => setIsUpgradeOpen(true)}
        openInbox={() => setIsInboxOpen(true)}
        openKundliCalc={() => setIsKundliCalcOpen(true)}
        shortlistCount={shortlistedIds.length}
        inboxCount={Object.values(connections).filter((c) => c.status === 'accepted').length}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <HeroSearch
              filters={filters}
              setFilters={setFilters}
              onSearch={() => setActiveView('matches')}
              openRegistration={() => setIsRegistrationOpen(true)}
            />

            <MatchFeed
              profiles={profiles}
              filters={filters}
              setFilters={setFilters}
              onViewDetails={(p) => setSelectedProfile(p)}
              onConnect={handleConnect}
              onToggleShortlist={handleToggleShortlist}
              onOpenChat={handleOpenChat}
              shortlistedIds={shortlistedIds}
              connections={connections}
              viewTitle="Handpicked Matches for You"
            />

            <SuccessStories />
            <AboutFounder onExploreMatches={() => setActiveView('matches')} />
            <TrustSafety />
          </>
        )}

        {activeView === 'about' && (
          <div className="pt-2">
            <AboutFounder onExploreMatches={() => setActiveView('matches')} />
            <TrustSafety />
          </div>
        )}

        {activeView === 'matches' && (
          <MatchFeed
            profiles={profiles}
            filters={filters}
            setFilters={setFilters}
            onViewDetails={(p) => setSelectedProfile(p)}
            onConnect={handleConnect}
            onToggleShortlist={handleToggleShortlist}
            onOpenChat={handleOpenChat}
            shortlistedIds={shortlistedIds}
            connections={connections}
            viewTitle="Explore All Verified Biodatas"
          />
        )}

        {activeView === 'shortlisted' && (
          <MatchFeed
            profiles={profiles}
            filters={filters}
            setFilters={setFilters}
            onViewDetails={(p) => setSelectedProfile(p)}
            onConnect={handleConnect}
            onToggleShortlist={handleToggleShortlist}
            onOpenChat={handleOpenChat}
            shortlistedIds={shortlistedIds}
            connections={connections}
            viewTitle="Your Shortlisted Profiles"
            isShortlistOnly={true}
          />
        )}

        {activeView === 'stories' && (
          <div className="pt-6">
            <SuccessStories />
            <TrustSafety />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectLanguage={(lang) => {
          setFilters((prev) => ({ ...prev, motherTongue: lang }));
          setActiveView('matches');
        }}
        onSelectReligion={(rel) => {
          setFilters((prev) => ({ ...prev, religion: rel }));
          setActiveView('matches');
        }}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
      />

      {/* Modals & Overlays */}
      <ProfileDetailModal
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onConnect={handleConnect}
        onToggleShortlist={handleToggleShortlist}
        onOpenChat={handleOpenChat}
        openUpgrade={() => {
          setSelectedProfile(null);
          setIsUpgradeOpen(true);
        }}
        isShortlisted={selectedProfile ? shortlistedIds.includes(selectedProfile.id) : false}
        connectionStatus={selectedProfile ? connections[selectedProfile.id]?.status : undefined}
        hasPremium={hasPremium}
      />

      {isLiveOpen && (
        <CoupleLiveModal
          onClose={() => setIsLiveOpen(false)}
          onConnect={handleConnect}
          availableProfiles={profiles.filter((p) => p.gender === filters.lookingFor)}
        />
      )}

      <InboxDrawer
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
        connections={connections}
        profiles={profiles}
        onAcceptInterest={handleAcceptInterest}
        onDeclineInterest={handleDeclineInterest}
        onSendMessage={handleSendMessage}
        activeChatProfileId={activeChatProfileId}
        setActiveChatProfileId={setActiveChatProfileId}
      />

      <KundliCalculatorModal
        isOpen={isKundliCalcOpen}
        onClose={() => setIsKundliCalcOpen(false)}
      />

      <RegistrationWizardModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
      />

      <UpgradePlansModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
      />

      {/* Fixed Mobile Bottom Tab Bar (Native Mobile Navigation) */}
      <MobileBottomNav
        activeView={activeView}
        setActiveView={(v) => setActiveView(v as any)}
        openLive={() => setIsLiveOpen(true)}
        openKundli={() => setIsKundliCalcOpen(true)}
        openInbox={() => setIsInboxOpen(true)}
        shortlistCount={shortlistedIds.length}
        inboxCount={Object.values(connections).filter((c) => c.status === 'accepted').length}
        openMobileMenu={() => setIsMobileMenuOpen(true)}
      />

    </div>
  );
}
