import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { Video, Smartphone, Sparkles, ShieldCheck } from 'lucide-react';
import { FilterState, Profile, Connection, MembershipPlan, ActiveCall, CallType, ChatMessage } from './types/matrimony';
import { PROFILES } from './data/mockProfiles';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { MatchFeed } from './components/MatchFeed';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { InstallAppBanner } from './components/InstallAppBanner';
import { CoupleAuthGate } from './components/CoupleAuthGate';
import { realtimeCallService, OnlineUser } from './services/realtimeCallService';

// Code splitting & lazy loading: Only load modals and heavier secondary sections when needed
const ProfileDetailModal = lazy(() => import('./components/ProfileDetailModal').then(m => ({ default: m.ProfileDetailModal })));
const CoupleLiveModal = lazy(() => import('./components/CoupleLiveModal').then(m => ({ default: m.CoupleLiveModal })));
const InboxDrawer = lazy(() => import('./components/InboxDrawer').then(m => ({ default: m.InboxDrawer })));
const KundliCalculatorModal = lazy(() => import('./components/KundliCalculatorModal').then(m => ({ default: m.KundliCalculatorModal })));
const RegistrationWizardModal = lazy(() => import('./components/RegistrationWizardModal').then(m => ({ default: m.RegistrationWizardModal })));
const UpgradePlansModal = lazy(() => import('./components/UpgradePlansModal').then(m => ({ default: m.UpgradePlansModal })));
const SuccessStories = lazy(() => import('./components/SuccessStories').then(m => ({ default: m.SuccessStories })));
const AboutFounder = lazy(() => import('./components/AboutFounder').then(m => ({ default: m.AboutFounder })));
const TrustSafety = lazy(() => import('./components/TrustSafety').then(m => ({ default: m.TrustSafety })));
const CallModal = lazy(() => import('./components/CallModal').then(m => ({ default: m.CallModal })));
const MyProfileModal = lazy(() => import('./components/MyProfileModal').then(m => ({ default: m.MyProfileModal })));
const OneToOneConnectModal = lazy(() => import('./components/OneToOneConnectModal').then(m => ({ default: m.OneToOneConnectModal })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const AndroidApkModal = lazy(() => import('./components/AndroidApkModal').then(m => ({ default: m.AndroidApkModal })));
import { AdminSecurityGate } from './components/AdminSecurityGate';

export default function App() {
  const [profiles, setProfiles] = useState<Profile[]>(PROFILES);
  const [activeView, setActiveView] = useState<'home' | 'matches' | 'live' | 'stories' | 'shortlisted' | 'about' | 'admin'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Enterprise Admin Authentication (Only shown to verified admin)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('husbandwife_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  
  // Site-wide admin broadcast announcement
  const [broadcastMessage, setBroadcastMessage] = useState<string | null>(
    '🎉 Special Matchmaking Week: Verified Profiles get Free Direct WhatsApp & 1-to-1 Video Access on husbandwife.com!'
  );
  
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
          status: 'read',
        },
        {
          id: 'm-2',
          senderId: 'self',
          text: 'Hello Ananya! Thank you so much. It is wonderful connecting with you. I really enjoyed reading about your interest in classical music.',
          timestamp: 'Yesterday, 7:15 PM',
          isSelf: true,
          status: 'read',
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

  // User authentication session (husbandwife.com WhatsApp OTP)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const savedAuth = localStorage.getItem('couple_com_auth');
      return !!savedAuth;
    } catch {
      return false;
    }
  });

  const [authUserData, setAuthUserData] = useState<{
    phoneNumber: string;
    fullName: string;
    gender: 'male' | 'female';
    profileFor: string;
  } | null>(() => {
    try {
      const savedAuth = localStorage.getItem('couple_com_auth');
      return savedAuth ? JSON.parse(savedAuth) : null;
    } catch {
      return null;
    }
  });

  const [hasPremium, setHasPremium] = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  // User profile & Custom Bio (Persistent in localStorage with Unique Device ID)
  const [myProfile, setMyProfile] = useState<Profile>(() => {
    let savedProfile: Profile | null = null;
    try {
      const saved = localStorage.getItem('couple_my_profile');
      if (saved) savedProfile = JSON.parse(saved);
    } catch {
      // ignore
    }

    let uniqueDeviceId = '';
    try {
      uniqueDeviceId = localStorage.getItem('couple_device_id') || '';
      if (!uniqueDeviceId) {
        uniqueDeviceId = `device_${Date.now().toString().slice(-5)}_${Math.random().toString(36).substring(2, 6)}`;
        localStorage.setItem('couple_device_id', uniqueDeviceId);
      }
    } catch {
      uniqueDeviceId = `device_${Date.now()}`;
    }

    if (savedProfile) {
      return {
        ...savedProfile,
        id: savedProfile.id && savedProfile.id !== 'my-profile-user' ? savedProfile.id : uniqueDeviceId,
      };
    }

    return {
      id: uniqueDeviceId,
      name: 'Aarav Patel',
      age: 28,
      gender: 'male',
      height: "5' 10\" (178 cm)",
      religion: 'Hindu',
      caste: 'Patel / Gujarati',
      motherTongue: 'Hindi',
      city: 'New Delhi',
      state: 'Delhi NCR',
      country: 'India',
      education: 'B.Tech in Computer Science',
      college: 'IIT Delhi',
      profession: 'Senior Software Engineer',
      companyType: 'Top Tech MNC',
      annualIncome: '₹28 - 32 LPA',
      diet: 'Vegetarian',
      drinking: 'Never',
      smoking: 'No',
      about: 'Namaste! I am an ambitious, warm-hearted professional who values deep family bonds, intellectual curiosity, and meaningful conversations. Looking for a partner who believes in mutual respect and building a happy life together.',
      photos: ['/assets/images/profile_rohit_1792826629953.jpg'],
      isVerified: true,
      verifiedDetails: ['Govt ID (Aadhaar) Verified', 'Degree Verified (IIT Delhi)', 'Mobile Verified'],
      lastActive: 'Active now',
      compatibilityScore: 98,
      kundli: {
        rashi: 'Simha (Leo)',
        nakshatra: 'Purva Phalguni',
        manglik: 'Non-Manglik',
        gunaScore: 33,
        breakdown: {
          varna: 1,
          vashya: 2,
          tara: 3,
          yoni: 4,
          grahaMaitri: 5,
          gana: 5,
          bhakoot: 6,
          nadi: 7,
        },
      },
      family: {
        familyType: 'Nuclear',
        familyValues: 'Moderate',
        fatherOccupation: 'Executive in Public Sector',
        motherOccupation: 'Homemaker',
        siblings: '1 Sibling',
        nativeLocation: 'New Delhi',
        familyStatus: 'Upper Middle Class',
      },
      expectations: {
        ageRange: '24 - 30 yrs',
        heightRange: "5' 2\" to 5' 9\"",
        maritalStatus: 'Never Married',
        religion: 'Hindu',
        motherTongue: 'Hindi / Gujarati',
        education: 'Graduate / Professional degree',
        annualIncome: '₹12 LPA+',
        diet: 'Vegetarian or Eggetarian',
      },
      interests: ['Coding', 'Reading', 'Himalayan Treks', 'Classical Sitar', 'Filter Coffee'],
      isMyProfile: true,
      isUserCreated: true,
    };
  });

  // Call & Profile Modals
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [isMyProfileOpen, setIsMyProfileOpen] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Sync myProfile to profiles list
  useEffect(() => {
    setProfiles((prev) => {
      const rest = prev.filter((p) => p.id !== myProfile.id);
      return [myProfile, ...rest];
    });
  }, [myProfile]);

  // Initial fetch of community profiles created by other users from the server
  useEffect(() => {
    let isMounted = true;
    fetch('/api/profiles')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.profiles) && data.profiles.length > 0) {
          setProfiles((prev) => {
            const map = new Map<string, Profile>();
            prev.forEach((p) => map.set(p.id, p));
            data.profiles.forEach((p: Profile) => {
              if (p.id !== myProfile.id) {
                map.set(p.id, { ...p, isMyProfile: false });
              }
            });
            if (myProfile) map.set(myProfile.id, myProfile);
            return Array.from(map.values());
          });
        }
      })
      .catch((err) => {
        console.warn('Could not fetch community profiles from server:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [myProfile.id]);

  // Real-time listener: when another user creates or updates their ID, immediately show it in the feed
  useEffect(() => {
    const unsubAdded = realtimeCallService.onProfileAdded((profile: Profile) => {
      if (profile.id === myProfile.id) return;
      setProfiles((prev) => {
        const existingIdx = prev.findIndex((p) => p.id === profile.id);
        const externalProfile = { ...profile, isMyProfile: false };
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = externalProfile;
          return updated;
        }
        return [externalProfile, ...prev];
      });
      showToast(`🌟 Naya Matrimonial Profile shamil hua: ${profile.name} (${profile.city || profile.state || 'India'})!`);
    });

    const unsubDeleted = realtimeCallService.onProfileDeleted((id: string) => {
      setProfiles((prev) => prev.filter((p) => p.id !== id));
    });

    return () => {
      unsubAdded();
      unsubDeleted();
    };
  }, [myProfile.id, showToast]);

  // Sync current user's profile to server so other phones see them immediately
  useEffect(() => {
    if (myProfile && myProfile.id && (isLoggedIn || myProfile.isUserCreated)) {
      realtimeCallService.syncProfile(myProfile);
    }
  }, [myProfile.id, isLoggedIn]);

  // Modals
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isKundliCalcOpen, setIsKundliCalcOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [activeChatProfileId, setActiveChatProfileId] = useState<string | null>(null);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // 1-to-1 Real Connection State
  const [isOneToOneOpen, setIsOneToOneOpen] = useState(false);
  const [oneToOneTargetProfile, setOneToOneTargetProfile] = useState<Profile | null>(null);
  const [oneToOneRoomId, setOneToOneRoomId] = useState<string | null>(null);

  // Detect URL shared room code (e.g. ?room=COUPLE-8912) or admin URL (?admin=1)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const room = searchParams.get('room');
      if (room) {
        setOneToOneRoomId(room.toUpperCase());
        setIsOneToOneOpen(true);
      }
      const adminParam = searchParams.get('admin');
      if (adminParam === '1' || adminParam === 'true' || adminParam === 'login') {
        const isAuth = localStorage.getItem('husbandwife_admin_auth') === 'true';
        if (isAuth) {
          setActiveView('admin');
        } else {
          setIsAdminLoginModalOpen(true);
        }
      }
    } catch (e) {
      console.warn('Could not read query parameters', e);
    }
  }, []);

  const handleOpenOneToOne = useCallback((profile?: Profile, roomId?: string) => {
    if (profile) {
      setOneToOneTargetProfile(profile);
    }
    if (roomId) {
      setOneToOneRoomId(roomId);
    }
    setIsOneToOneOpen(true);
  }, []);



  const handleLoginSuccess = (userData: {
    phoneNumber: string;
    fullName: string;
    gender: 'male' | 'female';
    profileFor: string;
  }) => {
    try {
      localStorage.setItem('couple_com_auth', JSON.stringify({
        ...userData,
        verifiedAt: new Date().toISOString(),
      }));
    } catch (e) {
      console.warn('Failed to save auth to localStorage', e);
    }
    setAuthUserData(userData);
    setIsLoggedIn(true);

    // Update user profile name, gender and ID according to verified WhatsApp profile
    const cleanPhone = userData.phoneNumber.replace(/[^0-9]/g, '');
    const newUserId = cleanPhone ? `user_${cleanPhone}` : `user_${Date.now()}`;
    
    const updatedProfile: Profile = {
      ...myProfile,
      id: newUserId,
      name: userData.fullName || myProfile.name,
      gender: userData.gender || myProfile.gender,
      verifiedDetails: [
        ...myProfile.verifiedDetails.filter((d) => !d.includes('WhatsApp')),
        `WhatsApp Verified (${userData.phoneNumber})`,
      ],
      isMyProfile: true,
      isUserCreated: true,
    };

    setMyProfile(updatedProfile);
    try {
      localStorage.setItem('couple_my_profile', JSON.stringify(updatedProfile));
    } catch {
      // ignore
    }

    // Immediately push to backend and notify all connected phones
    realtimeCallService.syncProfile(updatedProfile);

    showToast(`Welcome to husbandwife.com, ${userData.fullName}! WhatsApp OTP Verified ✓`);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('couple_com_auth');
    } catch {
      // ignore
    }
    setAuthUserData(null);
    setIsLoggedIn(false);
    showToast('Logged out of husbandwife.com. Please login via WhatsApp OTP to re-enter.');
  };

  const handleToggleShortlist = useCallback((id: string) => {
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
  }, [showToast]);

  const handleConnect = useCallback((profile: Profile) => {
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
  }, [showToast]);

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

  const handleSendMessage = (
    profileId: string,
    text: string,
    extra?: {
      mediaUrl?: string;
      mediaType?: 'image' | 'audio';
      audioDuration?: string;
      caption?: string;
    }
  ) => {
    const timeFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgId = `msg-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: msgId,
      senderId: 'self',
      text,
      timestamp: timeFormatted,
      isSelf: true,
      status: 'sent',
      ...extra,
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

    // Step 1: Update status to 'delivered' (grey double ticks) after 600ms
    setTimeout(() => {
      setConnections((prev) => {
        const conn = prev[profileId];
        if (!conn) return prev;
        return {
          ...prev,
          [profileId]: {
            ...conn,
            messages: conn.messages.map((m) =>
              m.id === msgId ? { ...m, status: 'delivered' as const } : m
            ),
          },
        };
      });
    }, 600);

    // Step 2: Update status to 'read' (double blue ticks) after 1500ms
    setTimeout(() => {
      setConnections((prev) => {
        const conn = prev[profileId];
        if (!conn) return prev;
        return {
          ...prev,
          [profileId]: {
            ...conn,
            messages: conn.messages.map((m) =>
              m.id === msgId ? { ...m, status: 'read' as const } : m
            ),
          },
        };
      });
    }, 1500);

    // Step 3: Match sends an authentic, cultured reply after 2600ms
    setTimeout(() => {
      const targetP = profiles.find((p) => p.id === profileId);
      if (targetP) {
        let replyContent = `Namaste! Aapka message mila. Hamare parivar ne aapka bio dekha aur bohot pasand kiya. Shaam ko detail me baat karte hain! 😊`;

        if (extra?.mediaType === 'audio') {
          replyContent = `Namaste! Thank you for the voice note. Aapki voice sun kar bohot achha laga. Let's arrange a time to speak over a call! 🎙️`;
        } else if (extra?.mediaType === 'image') {
          replyContent = `Thank you for sharing this! The photo/biodata looks great. Kundli match and family background seem very aligned. 🌟`;
        } else if (text.toLowerCase().includes('namaste') || text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
          replyContent = `Namaste! Delighted to connect with you. I noticed we both share similar aspirations and value family traditions. How has your week been?`;
        } else if (text.toLowerCase().includes('kundli') || text.toLowerCase().includes('guna')) {
          replyContent = `Yes! Our astro compatibility score is ${targetP.kundli.gunaScore}/36 (${targetP.kundli.manglik}), which our family astrologer also found very auspicious. 🙏`;
        } else if (text.toLowerCase().includes('family') || text.toLowerCase().includes('call')) {
          replyContent = `That sounds wonderful! My parents (${targetP.family.fatherOccupation} & ${targetP.family.motherOccupation}) would be very glad to speak with your family this weekend.`;
        } else {
          replyContent = `Thank you for your warm note! I am currently working as a ${targetP.profession} in ${targetP.city}. Would love to learn more about your passions and aspirations.`;
        }

        const replyMsg: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          senderId: profileId,
          text: replyContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSelf: false,
          status: 'read',
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
    }, 2600);
  };

  const handleOpenChat = useCallback((profile: Profile) => {
    // If connection doesn't exist, create an accepted one immediately so any boy or girl can chat right away!
    setConnections((prev) => {
      if (prev[profile.id]) return prev;
      return {
        ...prev,
        [profile.id]: {
          profileId: profile.id,
          status: 'accepted',
          sentAt: 'Just now',
          messages: [
            {
              id: `msg-init-${Date.now()}`,
              senderId: profile.id,
              text: `Namaste! I am glad to connect on Husbandwife.com. Looking forward to knowing you better! 🙏`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isSelf: false,
              status: 'read',
            },
          ],
          contactRevealed: true,
        },
      };
    });
    setActiveChatProfileId(profile.id);
    setIsInboxOpen(true);
  }, []);

  const handleUpgradeSuccess = (plan: MembershipPlan) => {
    setHasPremium(true);
    showToast(`VIP Plan ${plan.name} successfully activated!`);
  };

  // Real-Time 2-Phone WebSocket & WebRTC Call Sync
  useEffect(() => {
    // 1. Register current device/user with server WebSocket
    realtimeCallService.registerUser({
      id: myProfile.id,
      name: myProfile.name,
      gender: myProfile.gender,
      photo: myProfile.photos[0] || '',
      phone: authUserData?.phoneNumber || myProfile.verifiedDetails?.[0] || '',
      joinedAt: new Date().toLocaleTimeString(),
    });

    // 2. Listen for online users from server
    const unsubOnline = realtimeCallService.onOnlineUsers((users) => {
      setOnlineUsers(users);
    });

    // 3. Listen for incoming call from another phone
    const unsubIncoming = realtimeCallService.onIncomingCall((data) => {
      const callerProfile: Profile = {
        id: data.caller.id,
        name: data.caller.name,
        gender: data.caller.gender,
        age: 26,
        height: "5' 6\"",
        religion: 'Hindu',
        caste: 'Any',
        motherTongue: 'Hindi',
        city: 'Online Member',
        state: 'Live Phone',
        country: 'India',
        education: 'Verified Profile',
        college: 'University',
        companyType: 'Private Firm',
        profession: 'Candidate',
        annualIncome: 'Verified',
        diet: 'Vegetarian',
        drinking: 'Never',
        smoking: 'No',
        photos: [data.caller.photo || (data.caller.gender === 'female' ? '/assets/images/profile_ananya_1792826629253.jpg' : '/assets/images/profile_rohit_1792826629953.jpg')],
        about: 'Connecting live on husbandwife.com from another phone.',
        isVerified: true,
        verifiedDetails: ['Mobile Verified', 'Live Connected'],
        lastActive: 'Active now',
        compatibilityScore: 99,
        kundli: { gunaScore: 35, manglik: 'Non-Manglik' } as any,
        family: { familyType: 'Nuclear', familyValues: 'Moderate', nativeLocation: 'India' } as any,
        expectations: { maritalStatus: 'Never Married' } as any,
        interests: ['Live Video Call', 'Matrimony'],
      };

      setActiveCall({
        partner: callerProfile,
        type: data.callType,
        state: 'incoming',
        roomId: data.roomId,
        isIncoming: true,
        isRealCall: true,
      });
      showToast(`📞 Incoming Video Call from ${data.caller.name}!`);
    });

    // 4. Listen for call accepted on caller's phone
    const unsubAccepted = realtimeCallService.onCallAccepted(async (data) => {
      setActiveCall((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          state: 'connected',
        };
      });
      showToast(`Call connected with ${data.receiver?.name || 'partner'}! Setting up HD video...`);
      // Caller initiates WebRTC offer
      await realtimeCallService.setupPeerConnection(data.roomId, true);
    });

    // 5. Listen for call ringing on other phone
    const unsubRinging = realtimeCallService.onCallRinging(() => {
      showToast('Calling... Ringing on the other phone! 📱');
    });

    // 6. Listen for call declined
    const unsubDeclined = realtimeCallService.onCallDeclined((data) => {
      showToast(data.reason || 'Call was declined by partner');
      setActiveCall(null);
      setRemoteStream(null);
    });

    // 7. Listen for call ended
    const unsubEnded = realtimeCallService.onCallEnded(() => {
      showToast('Call ended by partner');
      setActiveCall(null);
      setRemoteStream(null);
    });

    // 8. Listen for remote media stream from the other phone
    const unsubRemoteStream = realtimeCallService.onRemoteStream((stream) => {
      setRemoteStream(stream);
    });

    return () => {
      unsubOnline();
      unsubIncoming();
      unsubAccepted();
      unsubRinging();
      unsubDeclined();
      unsubEnded();
      unsubRemoteStream();
    };
  }, [myProfile, authUserData, showToast]);

  // Audio & Video Call Handlers
  const handleStartCall = useCallback(async (partner: Profile, type: CallType, customRoomId?: string) => {
    showToast(`Connecting ${type === 'video' ? 'Video' : 'Voice'} Call with ${partner.name}...`);
    
    // Start real call through server signaling
    const roomId = await realtimeCallService.startCall(partner, type, customRoomId);
    
    setActiveCall({
      partner,
      type,
      state: 'outgoing',
      roomId,
      isRealCall: true,
    });

    // If calling a sample profile when no 2nd phone is active, show hint after 8 seconds
    setTimeout(() => {
      setActiveCall((prev) => {
        if (prev && prev.state === 'outgoing') {
          showToast('Notice: Phone 2 is not answered yet. Open this link on Phone 2 to video call!');
        }
        return prev;
      });
    }, 8000);
  }, [showToast]);

  const handleSimulateIncomingCall = () => {
    const oppositeGender = myProfile.gender === 'male' ? 'female' : 'male';
    const match = profiles.find((p) => p.gender === oppositeGender && !p.isMyProfile) || profiles[0];
    
    setActiveCall({
      partner: match,
      type: 'video',
      state: 'incoming',
      isIncoming: true,
    });
    showToast(`Incoming Video Call from ${match.name}!`);
  };

  const handleAcceptIncomingCall = useCallback(async () => {
    if (!activeCall) return;
    const roomId = activeCall.roomId || `CALL-${Date.now()}`;
    realtimeCallService.acceptIncomingCall(roomId, activeCall.partner);
    
    setActiveCall((prev) => prev ? { ...prev, state: 'connected' } : null);
    showToast('Call answered! Connecting live camera...');
    
    // Receiver sets up WebRTC and waits for offer
    await realtimeCallService.setupPeerConnection(roomId, false);
  }, [activeCall, showToast]);

  const handleEndCall = useCallback((durationStr: string) => {
    if (activeCall?.roomId) {
      realtimeCallService.endCall(activeCall.roomId);
    } else {
      realtimeCallService.endCall();
    }
    realtimeCallService.cleanupWebRTC();
    setRemoteStream(null);

    if (activeCall) {
      const partnerId = activeCall.partner.id;
      const callMsg = {
        id: `call-log-${Date.now()}`,
        senderId: 'system',
        text: `${activeCall.type === 'video' ? '📹 Video Call' : '📞 Voice Call'} ended · Duration: ${durationStr}`,
        timestamp: 'Just now',
        isSelf: false,
        callInfo: {
          type: activeCall.type,
          duration: durationStr,
        },
      };

      setConnections((prev) => {
        const conn = prev[partnerId] || {
          profileId: partnerId,
          status: 'accepted',
          sentAt: 'Just now',
          messages: [],
        };
        return {
          ...prev,
          [partnerId]: {
            ...conn,
            messages: [...conn.messages, callMsg],
          },
        };
      });

      showToast(`Call ended (${durationStr})`);
    }

    setActiveCall((prev) => (prev ? { ...prev, state: 'ended' } : null));
    setTimeout(() => {
      setActiveCall(null);
    }, 400);
  }, [activeCall, showToast]);

  const handleSaveMyProfile = (updated: Profile) => {
    const finalProfile = { ...updated, isMyProfile: true };
    setMyProfile(finalProfile);
    try {
      localStorage.setItem('couple_my_profile', JSON.stringify(finalProfile));
    } catch {
      // ignore
    }

    setProfiles((prev) => {
      const filtered = prev.filter((p) => p.id !== finalProfile.id);
      return [finalProfile, ...filtered];
    });

    // Also adjust default search filter to opposite gender
    setFilters((prev) => ({
      ...prev,
      lookingFor: finalProfile.gender === 'male' ? 'female' : 'male',
    }));

    // Live sync to server database & broadcast to all connected phones
    realtimeCallService.syncProfile(finalProfile);

    showToast(`Mera Profile & Bio saved successfully, ${finalProfile.name}!`);
  };

  const handleRegisterSuccess = (newProfileData: Partial<Profile>) => {
    setIsLoggedIn(true);
    const newProfile: Profile = {
      id: `user-${Date.now()}`,
      name: newProfileData.name || 'Aarav Patel',
      gender: newProfileData.gender || 'male',
      age: newProfileData.age || 28,
      height: newProfileData.height || "5' 10\" (178 cm)",
      religion: newProfileData.religion || 'Hindu',
      caste: newProfileData.caste || 'General',
      motherTongue: newProfileData.motherTongue || 'Hindi',
      city: newProfileData.city || 'New Delhi',
      state: newProfileData.state || 'Delhi NCR',
      country: 'India',
      education: newProfileData.education || 'Graduate',
      college: newProfileData.college || 'Premier Institute',
      profession: newProfileData.profession || 'Professional',
      companyType: newProfileData.companyType || 'Leading Firm',
      annualIncome: newProfileData.annualIncome || '₹20 - 25 LPA',
      diet: newProfileData.diet || 'Vegetarian',
      drinking: 'Never',
      smoking: 'No',
      about: newProfileData.about || 'Ambitious, family-oriented professional looking for a life partner with shared moral values and aspirations.',
      photos: newProfileData.gender === 'female' 
        ? ['/assets/images/profile_ananya_1792826629253.jpg'] 
        : ['/assets/images/profile_rohit_1792826629953.jpg'],
      isVerified: true,
      verifiedDetails: ['Govt ID (Aadhaar) Verified', 'Education Verified', 'Mobile Verified'],
      lastActive: 'Active now',
      compatibilityScore: 98,
      kundli: {
        rashi: 'Simha (Leo)',
        nakshatra: 'Purva Phalguni',
        manglik: 'Non-Manglik',
        gunaScore: 33,
        breakdown: {
          varna: 1,
          vashya: 2,
          tara: 3,
          yoni: 4,
          grahaMaitri: 5,
          gana: 5,
          bhakoot: 6,
          nadi: 7,
        },
      },
      family: {
        familyType: 'Nuclear',
        familyValues: 'Moderate',
        fatherOccupation: 'Executive in Public Sector',
        motherOccupation: 'Homemaker',
        siblings: '1 Sibling',
        nativeLocation: newProfileData.city || 'New Delhi',
        familyStatus: 'Upper Middle Class',
      },
      expectations: {
        ageRange: '24 - 30 yrs',
        heightRange: "5' 2\" to 5' 9\"",
        maritalStatus: 'Never Married',
        religion: newProfileData.religion || 'Hindu',
        motherTongue: newProfileData.motherTongue || 'Hindi',
        education: 'Postgraduate / Professional degree',
        annualIncome: '₹12 LPA+',
        diet: 'Vegetarian or Eggetarian',
      },
      interests: ['Reading', 'Travel', 'Music', 'Fitness'],
      isMyProfile: true,
      isUserCreated: true,
    };

    handleSaveMyProfile(newProfile);
    setActiveView('matches');
  };

  if (activeView === 'admin') {
    // If not authenticated as Admin, show the high-security Admin Gate
    if (!isAdminAuthenticated) {
      return (
        <AdminSecurityGate
          onSuccess={() => {
            setIsAdminAuthenticated(true);
          }}
          onCancel={() => setActiveView('home')}
          showToast={showToast}
        />
      );
    }

    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-rose-900 selection:text-white">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-neutral-700 text-xs font-medium animate-fadeIn">
            {toastMessage}
          </div>
        )}

        <Suspense
          fallback={
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white text-xs gap-3">
              <div className="w-7 h-7 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading husbandwife.com Enterprise Admin Portal...</span>
            </div>
          }
        >
          <AdminPanel
            profiles={profiles}
            setProfiles={setProfiles}
            connections={connections}
            activeCall={activeCall}
            onExitAdmin={() => setActiveView('home')}
            onLogoutAdmin={() => {
              setIsAdminAuthenticated(false);
              try {
                localStorage.removeItem('husbandwife_admin_auth');
              } catch {}
              setActiveView('home');
              showToast('Admin logged out safely. User mode active.');
            }}
            broadcastMessage={broadcastMessage}
            setBroadcastMessage={setBroadcastMessage}
            showToast={showToast}
          />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans selection:bg-rose-100 selection:text-rose-900 pb-16 md:pb-0 overflow-x-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-neutral-700 text-xs font-medium animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* Admin Broadcast Announcement Bar */}
      {broadcastMessage && (
        <div className="bg-gradient-to-r from-rose-900 via-pink-900 to-purple-950 text-rose-100 text-xs px-3 sm:px-6 py-2 border-b border-rose-800/80 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 max-w-7xl mx-auto flex-1 overflow-hidden">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white shrink-0">
              Notice
            </span>
            <span className="font-medium truncate">{broadcastMessage}</span>
          </div>
          <button
            onClick={() => setBroadcastMessage(null)}
            className="text-rose-300 hover:text-white text-xs px-1.5 py-0.5 hover:bg-white/10 rounded transition-colors shrink-0"
            title="Dismiss announcement"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2-Phone Real Connection Live Status Banner */}
      {onlineUsers.filter((u) => u.id !== myProfile.id).length > 0 && (
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-900 border-b border-emerald-500/40 text-emerald-100 text-xs px-3 sm:px-6 py-2 flex items-center justify-between gap-3 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2 max-w-7xl mx-auto flex-1 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-bold text-white flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dusra Phone Live Online Hai:</span>
            </span>
            <span className="text-emerald-200">
              {onlineUsers.filter((u) => u.id !== myProfile.id).map((u) => u.name).join(', ')} connected!
            </span>
            <button
              onClick={() => {
                const other = onlineUsers.find((u) => u.id !== myProfile.id);
                if (other) {
                  const targetP: Profile = {
                    id: other.id,
                    name: other.name,
                    gender: other.gender,
                    age: 26,
                    height: "5' 6\"",
                    religion: 'Hindu',
                    caste: 'Any',
                    motherTongue: 'Hindi',
                    city: 'Live Device',
                    state: 'India',
                    country: 'India',
                    education: 'Verified',
                    college: 'University',
                    companyType: 'Private Firm',
                    profession: 'Candidate',
                    annualIncome: 'Verified',
                    diet: 'Vegetarian',
                    drinking: 'Never',
                    smoking: 'No',
                    photos: [other.photo || (other.gender === 'female' ? '/assets/images/profile_ananya_1792826629253.jpg' : '/assets/images/profile_rohit_1792826629953.jpg')],
                    about: 'Live connected phone user on husbandwife.com',
                    isVerified: true,
                    verifiedDetails: ['Mobile Verified', 'Live Connected'],
                    lastActive: 'Active now',
                    compatibilityScore: 99,
                    kundli: { gunaScore: 35, manglik: 'Non-Manglik' } as any,
                    family: { familyType: 'Nuclear', familyValues: 'Moderate', nativeLocation: 'India' } as any,
                    expectations: { maritalStatus: 'Never Married' } as any,
                    interests: ['Live Video Call', 'Matrimony'],
                  };
                  handleStartCall(targetP, 'video');
                }
              }}
              className="ml-auto px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-lg text-xs shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Direct Video Call Dusre Phone Ko</span>
            </button>
          </div>
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
        setIsLoggedIn={(status) => {
          if (!status) {
            handleLogout();
          } else {
            setIsLoggedIn(true);
          }
        }}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        myProfile={myProfile}
        openMyProfile={() => setIsMyProfileOpen(true)}
        onSimulateIncomingCall={handleSimulateIncomingCall}
        openOneToOne={() => handleOpenOneToOne()}
        openApkModal={() => setIsApkModalOpen(true)}
        isAdminAuthenticated={isAdminAuthenticated}
        openAdminLogin={() => setIsAdminLoginModalOpen(true)}
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
              onStartCall={handleStartCall}
              onOpenEditProfile={() => setIsMyProfileOpen(true)}
              onOpenOneToOne={handleOpenOneToOne}
            />

            <Suspense fallback={null}>
              <SuccessStories />
              <AboutFounder onExploreMatches={() => setActiveView('matches')} />
              <TrustSafety />
            </Suspense>
          </>
        )}

        {activeView === 'about' && (
          <Suspense fallback={null}>
            <div className="pt-2">
              <AboutFounder onExploreMatches={() => setActiveView('matches')} />
              <TrustSafety />
            </div>
          </Suspense>
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
            onStartCall={handleStartCall}
            onOpenEditProfile={() => setIsMyProfileOpen(true)}
            onOpenOneToOne={handleOpenOneToOne}
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
            onStartCall={handleStartCall}
            onOpenEditProfile={() => setIsMyProfileOpen(true)}
            onOpenOneToOne={handleOpenOneToOne}
          />
        )}

        {activeView === 'stories' && (
          <Suspense fallback={null}>
            <div className="pt-6">
              <SuccessStories />
              <TrustSafety />
            </div>
          </Suspense>
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
        onOpenAdmin={() => {
          if (isAdminAuthenticated) {
            setActiveView('admin');
          } else {
            setIsAdminLoginModalOpen(true);
          }
        }}
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        isAdminAuthenticated={isAdminAuthenticated}
        openApkModal={() => setIsApkModalOpen(true)}
      />

      {/* Modals & Overlays - Conditionally mounted with Suspense to guarantee instant initial page loads */}
      <Suspense fallback={null}>
        {selectedProfile && (
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
            isShortlisted={shortlistedIds.includes(selectedProfile.id)}
            connectionStatus={connections[selectedProfile.id]?.status}
            hasPremium={hasPremium}
            onStartCall={handleStartCall}
          />
        )}

        {isLiveOpen && (
          <CoupleLiveModal
            onClose={() => setIsLiveOpen(false)}
            onConnect={handleConnect}
            availableProfiles={profiles.filter((p) => p.gender === filters.lookingFor)}
          />
        )}

        {isInboxOpen && (
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
            onStartCall={handleStartCall}
            onViewProfileDetails={(p) => setSelectedProfile(p)}
          />
        )}

        {isKundliCalcOpen && (
          <KundliCalculatorModal
            isOpen={isKundliCalcOpen}
            onClose={() => setIsKundliCalcOpen(false)}
          />
        )}

        {isRegistrationOpen && (
          <RegistrationWizardModal
            isOpen={isRegistrationOpen}
            onClose={() => setIsRegistrationOpen(false)}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}

        {isUpgradeOpen && (
          <UpgradePlansModal
            isOpen={isUpgradeOpen}
            onClose={() => setIsUpgradeOpen(false)}
            onUpgradeSuccess={handleUpgradeSuccess}
          />
        )}

        {isMyProfileOpen && (
          <MyProfileModal
            isOpen={isMyProfileOpen}
            onClose={() => setIsMyProfileOpen(false)}
            myProfile={myProfile}
            onSaveProfile={handleSaveMyProfile}
            onOpenCreateNew={() => {
              setIsMyProfileOpen(false);
              setIsRegistrationOpen(true);
            }}
          />
        )}

        {activeCall && (
          <CallModal
            call={activeCall}
            onEndCall={handleEndCall}
            onAcceptIncoming={handleAcceptIncomingCall}
            myProfile={myProfile}
            remoteStream={remoteStream}
            isRealPeerConnected={!!remoteStream}
          />
        )}

        {isOneToOneOpen && (
          <OneToOneConnectModal
            isOpen={isOneToOneOpen}
            onClose={() => {
              setIsOneToOneOpen(false);
              setOneToOneTargetProfile(null);
            }}
            myProfile={myProfile}
            targetProfile={oneToOneTargetProfile}
            initialRoomId={oneToOneRoomId}
            onStartVideoCall={(partner) => {
              setIsOneToOneOpen(false);
              handleStartCall(partner, 'video', oneToOneRoomId || undefined);
            }}
          />
        )}
        {isApkModalOpen && (
          <AndroidApkModal
            isOpen={isApkModalOpen}
            onClose={() => setIsApkModalOpen(false)}
            showToast={showToast}
          />
        )}
        {isAdminLoginModalOpen && (
          <AdminSecurityGate
            isModal={true}
            onSuccess={() => {
              setIsAdminAuthenticated(true);
              setIsAdminLoginModalOpen(false);
              setActiveView('admin');
            }}
            onCancel={() => setIsAdminLoginModalOpen(false)}
            showToast={showToast}
          />
        )}
      </Suspense>

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
        openMyProfile={() => setIsMyProfileOpen(true)}
        openOneToOne={() => handleOpenOneToOne()}
      />

      {/* Play Store & PWA Install Banner */}
      <InstallAppBanner onOpenApkGuide={() => setIsApkModalOpen(true)} />

      {/* Mandatory husbandwife.com WhatsApp OTP Login Gate */}
      {!isLoggedIn && (
        <CoupleAuthGate onLoginSuccess={handleLoginSuccess} />
      )}

    </div>
  );
}
