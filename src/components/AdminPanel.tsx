import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Video,
  AlertTriangle,
  Bell,
  FileText,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Download,
  RefreshCw,
  Sparkles,
  Crown,
  ArrowLeft,
  Check,
  X,
  Lock,
  Unlock,
  Activity,
  Server,
  Clock,
  PhoneCall,
  MessageSquare,
  BadgeCheck,
  ChevronRight,
  TrendingUp,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Send,
  UserX,
  UserCheck
} from 'lucide-react';
import { Profile, Gender } from '../types/matrimony';

interface AdminPanelProps {
  profiles: Profile[];
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
  connections: Record<string, any>;
  activeCall: any;
  onExitAdmin: () => void;
  onLogoutAdmin?: () => void;
  broadcastMessage: string | null;
  setBroadcastMessage: (msg: string | null) => void;
  showToast: (msg: string) => void;
}

type AdminTab = 'overview' | 'profiles' | 'kyc' | 'calls' | 'reports' | 'broadcasts' | 'logs';

interface KYCRequest {
  id: string;
  profileId: string;
  profileName: string;
  gender: Gender;
  docType: 'Aadhaar Card' | 'Passport' | 'Voter ID' | 'University Degree';
  docNumberMasked: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  docImageUrl: string;
}

interface ReportTicket {
  id: string;
  reportedProfileId: string;
  reportedName: string;
  reporterName: string;
  reason: string;
  status: 'open' | 'resolved' | 'dismissed';
  reportedAt: string;
  severity: 'low' | 'medium' | 'high';
}

interface AuditLog {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  category: 'auth' | 'verification' | 'profile' | 'call' | 'system';
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  profiles,
  setProfiles,
  connections,
  activeCall,
  onExitAdmin,
  onLogoutAdmin,
  broadcastMessage,
  setBroadcastMessage,
  showToast,
}) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Search & Filters for Profiles Table
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'unverified' | 'vip' | 'suspended'>('all');

  // Suspended profiles IDs tracker
  const [suspendedProfileIds, setSuspendedProfileIds] = useState<string[]>([]);

  // Selected Profile for Inspector Modal
  const [inspectingProfile, setInspectingProfile] = useState<Profile | null>(null);

  // Edit Profile Modal
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  // Add New Profile Modal
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [newProfileForm, setNewProfileForm] = useState({
    name: '',
    gender: 'female' as Gender,
    age: 26,
    height: "5' 5\" (165 cm)",
    religion: 'Hindu',
    caste: 'Sharma / Brahmin',
    motherTongue: 'Hindi',
    city: 'New Delhi',
    state: 'Delhi NCR',
    education: 'B.Tech / MBA',
    college: 'Delhi University',
    profession: 'Software Engineer',
    companyType: 'Top Tech MNC',
    annualIncome: '₹18 - 22 LPA',
    diet: 'Vegetarian' as const,
    about: 'Ambitious, family-oriented individual looking for a supportive and cheerful life partner.',
    photoUrl: '/assets/images/profile_ananya_1792826629253.jpg',
  });

  // KYC Verification Queue State
  const [kycQueue, setKycQueue] = useState<KYCRequest[]>([
    {
      id: 'kyc-101',
      profileId: 'p-1',
      profileName: 'Ananya Sharma',
      gender: 'female',
      docType: 'Aadhaar Card',
      docNumberMasked: 'XXXX-XXXX-4812',
      status: 'pending',
      submittedAt: 'Today, 09:15 AM',
      docImageUrl: '/assets/images/profile_ananya_1792826629253.jpg',
    },
    {
      id: 'kyc-102',
      profileId: 'p-2',
      profileName: 'Dr. Priya Desai',
      gender: 'female',
      docType: 'University Degree',
      docNumberMasked: 'MBBS-AIIMS-9821',
      status: 'pending',
      submittedAt: 'Yesterday, 04:30 PM',
      docImageUrl: '/assets/images/profile_priya_1792826629603.jpg',
    },
    {
      id: 'kyc-103',
      profileId: 'p-3',
      profileName: 'Meera Iyer',
      gender: 'female',
      docType: 'Passport',
      docNumberMasked: 'PXXXXX891',
      status: 'pending',
      submittedAt: '2 days ago',
      docImageUrl: '/assets/images/profile_meera_1792826629783.jpg',
    },
  ]);

  // Moderation Reports Queue
  const [reports, setReports] = useState<ReportTicket[]>([
    {
      id: 'rep-1',
      reportedProfileId: 'p-4',
      reportedName: 'Sneha Kulkarni',
      reporterName: 'Vikram Mehta',
      reason: 'Unclear biodata details regarding current city and location.',
      status: 'open',
      reportedAt: 'Today, 11:45 AM',
      severity: 'low',
    },
    {
      id: 'rep-2',
      reportedProfileId: 'p-6',
      reportedName: 'Rhea Sen',
      reporterName: 'Rahul Verma',
      reason: 'Frequent profile photo updates; please review ID authenticity.',
      status: 'open',
      reportedAt: 'Yesterday, 02:10 PM',
      severity: 'medium',
    },
  ]);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      action: 'Super Admin logged in to Enterprise Console',
      actor: 'Bablu Rajput (Owner)',
      timestamp: 'Today, 08:30:12 AM',
      category: 'auth',
    },
    {
      id: 'log-2',
      action: 'Aadhaar ID verification approved for Rohit Verma',
      actor: 'Automated KYC Engine',
      timestamp: 'Today, 09:10:45 AM',
      category: 'verification',
    },
    {
      id: 'log-3',
      action: '1-to-1 WebRTC Video Call room session initialized',
      actor: 'User Aarav Patel -> Partner',
      timestamp: 'Today, 10:22:18 AM',
      category: 'call',
    },
    {
      id: 'log-4',
      action: 'WhatsApp OTP gateway synchronized (+91-9876543210)',
      actor: 'WhatsApp Cloud Webhook',
      timestamp: 'Today, 10:45:00 AM',
      category: 'system',
    },
  ]);

  // Local Broadcast Input
  const [broadcastDraft, setBroadcastDraft] = useState(
    broadcastMessage || 'Namaste! Over 1,480+ verified biodatas are active today. Matchmaking advisors are available 24x7.'
  );

  // Statistics Calculations
  const stats = useMemo(() => {
    const totalUsers = profiles.length + 1475; // Adding simulated registry count for enterprise depth
    const verifiedUsers = profiles.filter((p) => p.isVerified).length + 1290;
    const vipUsers = profiles.filter((p) => p.isPremium).length + 380;
    const totalConnectionsCount = Object.keys(connections).length + 2840;
    const activeRooms = activeCall ? 1 : 4; // current live rooms
    return {
      totalUsers,
      verifiedUsers,
      verificationRate: Math.round((verifiedUsers / totalUsers) * 100),
      vipUsers,
      totalConnectionsCount,
      activeRooms,
      revenueToday: '₹84,500',
    };
  }, [profiles, connections, activeCall]);

  // Filtered Profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      // Gender filter
      if (genderFilter !== 'all' && p.gender !== genderFilter) {
        return false;
      }
      // Status filter
      if (statusFilter === 'verified' && !p.isVerified) return false;
      if (statusFilter === 'unverified' && p.isVerified) return false;
      if (statusFilter === 'vip' && !p.isPremium) return false;
      if (statusFilter === 'suspended' && !suspendedProfileIds.includes(p.id)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const full = `${p.name} ${p.city} ${p.profession} ${p.caste} ${p.religion} ${p.education} ${p.id}`.toLowerCase();
        if (!full.includes(q)) return false;
      }
      return true;
    });
  }, [profiles, genderFilter, statusFilter, searchQuery, suspendedProfileIds]);

  // Actions
  const handleToggleVerify = (profileId: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === profileId) {
          const next = !p.isVerified;
          return {
            ...p,
            isVerified: next,
            verifiedDetails: next
              ? ['Govt ID (Aadhaar) Verified', 'Education Verified', 'Mobile Verified']
              : [],
          };
        }
        return p;
      })
    );
    showToast(`Verification status updated for profile #${profileId}`);
    addLog(`Updated ID verification status for profile ${profileId}`, 'verification');
  };

  const handleToggleVip = (profileId: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === profileId) {
          const next = !p.isPremium;
          return { ...p, isPremium: next };
        }
        return p;
      })
    );
    showToast(`VIP membership toggled for profile #${profileId}`);
    addLog(`VIP Membership toggled for profile ${profileId}`, 'profile');
  };

  const handleToggleSuspend = (profileId: string) => {
    if (suspendedProfileIds.includes(profileId)) {
      setSuspendedProfileIds((prev) => prev.filter((id) => id !== profileId));
      showToast(`Profile #${profileId} unsuspended and restored to active pool.`);
      addLog(`Unbanned and restored profile ${profileId}`, 'profile');
    } else {
      setSuspendedProfileIds((prev) => [...prev, profileId]);
      showToast(`Profile #${profileId} has been suspended.`);
      addLog(`Suspended profile ${profileId} due to administrative review`, 'profile');
    }
  };

  const handleDeleteProfile = (profileId: string) => {
    if (confirm('Are you sure you want to permanently delete this profile from husbandwife.com?')) {
      setProfiles((prev) => prev.filter((p) => p.id !== profileId));
      showToast(`Profile #${profileId} deleted successfully.`);
      addLog(`Deleted profile ${profileId} permanently`, 'profile');
    }
  };

  const handleSaveEditedProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;
    setProfiles((prev) => prev.map((p) => (p.id === editingProfile.id ? editingProfile : p)));
    setEditingProfile(null);
    showToast(`Profile ${editingProfile.name} details saved successfully!`);
    addLog(`Edited profile metadata for ${editingProfile.name}`, 'profile');
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `p-adm-${Date.now()}`;
    const created: Profile = {
      id: newId,
      name: newProfileForm.name,
      age: Number(newProfileForm.age),
      gender: newProfileForm.gender,
      height: newProfileForm.height,
      religion: newProfileForm.religion,
      caste: newProfileForm.caste,
      motherTongue: newProfileForm.motherTongue,
      city: newProfileForm.city,
      state: newProfileForm.state,
      country: 'India',
      education: newProfileForm.education,
      college: newProfileForm.college,
      profession: newProfileForm.profession,
      companyType: newProfileForm.companyType,
      annualIncome: newProfileForm.annualIncome,
      diet: newProfileForm.diet,
      drinking: 'Never',
      smoking: 'No',
      about: newProfileForm.about,
      photos: [newProfileForm.photoUrl],
      isVerified: true,
      verifiedDetails: ['Govt ID (Aadhaar) Verified', 'Admin Approved'],
      lastActive: 'Active now',
      compatibilityScore: 96,
      kundli: {
        rashi: 'Simha (Leo)',
        nakshatra: 'Purva Phalguni',
        manglik: 'Non-Manglik',
        gunaScore: 32,
        breakdown: {
          varna: 1,
          vashya: 2,
          tara: 3,
          yoni: 4,
          grahaMaitri: 5,
          gana: 5,
          bhakoot: 6,
          nadi: 6,
        },
      },
      family: {
        familyType: 'Nuclear',
        familyValues: 'Moderate',
        fatherOccupation: 'Government Officer',
        motherOccupation: 'Educator',
        siblings: '1 Sibling',
        nativeLocation: newProfileForm.city,
        familyStatus: 'Upper Middle Class',
      },
      expectations: {
        ageRange: '24 - 32 yrs',
        heightRange: "5' 2\" to 6' 0\"",
        maritalStatus: 'Never Married',
        religion: newProfileForm.religion,
        motherTongue: newProfileForm.motherTongue,
        education: 'Graduate / Post Graduate',
        annualIncome: '₹10 LPA+',
        diet: 'Vegetarian',
      },
      interests: ['Reading', 'Travel', 'Music', 'Fitness'],
      isUserCreated: true,
    };

    setProfiles((prev) => [created, ...prev]);
    setIsAddingProfile(false);
    showToast(`New profile ${created.name} added to husbandwife.com!`);
    addLog(`Created new profile ${created.name} (${newId})`, 'profile');
  };

  const handleApproveKyc = (item: KYCRequest) => {
    setKycQueue((prev) => prev.map((k) => (k.id === item.id ? { ...k, status: 'approved' } : k)));
    // Also verify profile
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === item.profileId) {
          return {
            ...p,
            isVerified: true,
            verifiedDetails: [
              ...p.verifiedDetails.filter((d) => !d.includes('Aadhaar')),
              `${item.docType} Verified`,
            ],
          };
        }
        return p;
      })
    );
    showToast(`KYC Approved for ${item.profileName}! Badge issued.`);
    addLog(`Approved KYC (${item.docType}) for ${item.profileName}`, 'verification');
  };

  const handleRejectKyc = (item: KYCRequest) => {
    setKycQueue((prev) => prev.map((k) => (k.id === item.id ? { ...k, status: 'rejected' } : k)));
    showToast(`KYC Rejected for ${item.profileName}. Notification sent.`);
    addLog(`Rejected KYC request for ${item.profileName}`, 'verification');
  };

  const handleResolveReport = (reportId: string, actionText: string) => {
    setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' } : r)));
    showToast(`Report ${reportId} marked as resolved: ${actionText}`);
    addLog(`Resolved grievance ticket ${reportId} (${actionText})`, 'system');
  };

  const handleSaveBroadcast = () => {
    setBroadcastMessage(broadcastDraft.trim() ? broadcastDraft : null);
    showToast('Site-wide announcement broadcast updated successfully!');
    addLog(`Updated system broadcast banner: "${broadcastDraft.slice(0, 30)}..."`, 'system');
  };

  const handleExportData = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profiles, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `husbandwife_profiles_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Profile database JSON exported successfully!');
      addLog('Exported profiles database to JSON', 'system');
    } catch (e) {
      showToast('Error exporting data');
    }
  };

  const addLog = (action: string, category: AuditLog['category']) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      actor: 'Bablu Rajput (Super Admin)',
      timestamp: 'Just now',
      category,
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 50)]);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col antialiased selection:bg-rose-900 selection:text-white">
      
      {/* Top Enterprise Bar (Fully Mobile Responsive) */}
      <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand & Back Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold transition-colors border border-neutral-700 min-h-[38px]"
            title="Return to Main Matrimony App"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">App</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-serif text-base sm:text-xl font-bold tracking-tight text-white whitespace-nowrap">
              husbandwife<span className="text-rose-500">.com</span>
            </span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800/60 whitespace-nowrap">
              Admin
            </span>
          </div>
        </div>

        {/* System Status Indicators, Export & Admin Profile (All Visible on Mobile) */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs">
          
          {/* Real-time server health (Compact on Mobile, Detailed on Desktop) */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-neutral-950/70 rounded-md border border-neutral-800 text-[11px] text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="hidden md:inline text-neutral-400">WebRTC Socket:</span>
            <span className="font-bold text-emerald-400">14ms</span>
          </div>

          {/* Quick Data Export (Visible on Mobile) */}
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md transition-colors border border-neutral-700 font-medium text-xs min-h-[36px]"
            title="Download full database snapshot JSON"
          >
            <Download className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Super Admin User Capsule & Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-neutral-800">
            <div className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
              BR
            </div>
            <div className="hidden lg:block text-left">
              <p className="font-semibold text-white leading-none">Bablu Rajput</p>
              <p className="text-[10px] text-neutral-400">Super Admin</p>
            </div>
            {onLogoutAdmin && (
              <button
                onClick={onLogoutAdmin}
                className="ml-1 sm:ml-2 px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-300 rounded-md text-[11px] font-bold flex items-center gap-1 transition-colors min-h-[32px]"
                title="Admin session se log out karein"
              >
                <Lock className="w-3 h-3 text-rose-400" />
                <span className="hidden sm:inline">Admin</span> Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar (Scrollable Mobile Tab Bar + Desktop Sidebar) */}
        <aside className="w-full md:w-64 bg-neutral-900 border-b md:border-b-0 md:border-r border-neutral-800 p-2 sm:p-4 shrink-0 flex md:flex-col justify-between overflow-x-auto no-scrollbar shadow-xs">
          <div className="flex md:flex-col gap-1.5 sm:gap-1 w-full">
            <div className="hidden md:block px-3 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Management
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left whitespace-nowrap min-h-[40px] shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('profiles')}
              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left whitespace-nowrap min-h-[40px] shrink-0 ${
                activeTab === 'profiles'
                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 shrink-0" />
                <span>Biodatas</span>
              </div>
              <span className="text-[10px] bg-neutral-800 text-neutral-200 px-1.5 py-0.5 rounded font-bold">
                {profiles.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('kyc')}
              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left whitespace-nowrap min-h-[40px] shrink-0 ${
                activeTab === 'kyc'
                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>KYC Queue</span>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded font-bold">
                {kycQueue.filter((k) => k.status === 'pending').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('calls')}
              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left whitespace-nowrap min-h-[40px] shrink-0 ${
                activeTab === 'calls'
                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Live Calls</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left whitespace-nowrap min-h-[40px] shrink-0 ${
                activeTab === 'reports'
                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Reports</span>
              </div>
              <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded font-bold">
                {reports.filter((r) => r.status === 'open').length}
              </span>
            </button>

            <div className="hidden md:block px-3 pt-3 pb-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              System Operations
            </div>

            <button
              onClick={() => setActiveTab('broadcasts')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left whitespace-nowrap min-h-[40px] shrink-0 ${
                activeTab === 'broadcasts'
                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Announcements</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left whitespace-nowrap min-h-[40px] shrink-0 ${
                activeTab === 'logs'
                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>Audit Logs</span>
            </button>
          </div>

          {/* Quick Admin Meta Footer in Sidebar */}
          <div className="hidden md:block pt-4 border-t border-neutral-800 text-[11px] text-neutral-400 space-y-1">
            <p className="text-neutral-300 font-semibold">husbandwife.com v2.4</p>
            <p>Admin: bablukumar9012123@gmail.com</p>
            <p className="text-emerald-500 font-medium">SSL Encrypted 256-Bit</p>
          </div>
        </aside>

        {/* Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {/* TAB 1: OVERVIEW & DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Platform Operations Dashboard</h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Real-time health, verified biodatas registry, 1-to-1 video stream channels, and trust metrics.
                </p>
              </div>

              {/* KPI Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-neutral-400 text-xs">
                    <span>Registered Biodatas</span>
                    <Users className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">{stats.totalUsers.toLocaleString()}</span>
                    <span className="text-[11px] text-emerald-400 font-semibold">+18% this month</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">{profiles.length} locally managed in real-time</p>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-neutral-400 text-xs">
                    <span>Aadhaar Verified</span>
                    <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{stats.verifiedUsers.toLocaleString()}</span>
                    <span className="text-[11px] text-neutral-400">{stats.verificationRate}% trust rate</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">Govt ID & Education Verified</p>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-neutral-400 text-xs">
                    <span>VIP Subscriptions</span>
                    <Crown className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">{stats.vipUsers}</span>
                    <span className="text-[11px] text-emerald-400 font-semibold">Today: {stats.revenueToday}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">Assisted match advisor plans</p>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-neutral-400 text-xs">
                    <span>Active Video Calls</span>
                    <PhoneCall className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-sky-400">{stats.activeRooms}</span>
                    <span className="text-[11px] text-emerald-400 font-semibold">1080p HD Live</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">Phone / Laptop WebRTC connections</p>
                </div>
              </div>

              {/* System Infrastructure Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Real-time Infrastructure Health */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-rose-500" />
                    <span>Real-Time Services Status</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-neutral-950/60 rounded-lg border border-neutral-800/80">
                      <div>
                        <p className="font-semibold text-white">MediaStream Video Engine</p>
                        <p className="text-[11px] text-neutral-400">Facing mode: user (selfie/front camera)</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Operational
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-neutral-950/60 rounded-lg border border-neutral-800/80">
                      <div>
                        <p className="font-semibold text-white">WhatsApp Cloud OTP Gateway</p>
                        <p className="text-[11px] text-neutral-400">99.8% verification delivery rate</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Healthy
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-neutral-950/60 rounded-lg border border-neutral-800/80">
                      <div>
                        <p className="font-semibold text-white">36 Guna Kundli Milan Engine</p>
                        <p className="text-[11px] text-neutral-400">Ashtakoot calculation precision</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-neutral-950/60 rounded-lg border border-neutral-800/80">
                      <div>
                        <p className="font-semibold text-white">WebSocket Room Mesh</p>
                        <p className="text-[11px] text-neutral-400">Latency: 12ms - 22ms</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        100% Up
                      </span>
                    </div>
                  </div>
                </div>

                {/* Regional & Demographics Distribution */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>Top Matrimonial Hubs</span>
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    {[
                      { city: 'Delhi NCR (New Delhi, Noida, Gurgaon)', pct: 36 },
                      { city: 'Mumbai & Pune (Maharashtra)', pct: 28 },
                      { city: 'Bengaluru & Hyderabad (Tech Hub)', pct: 18 },
                      { city: 'Ahmedabad & Surat (Gujarat)', pct: 12 },
                      { city: 'Other Cities & NRI (USA, UK, Canada)', pct: 6 },
                    ].map((hub) => (
                      <div key={hub.city} className="space-y-1">
                        <div className="flex justify-between text-neutral-300 text-[11px]">
                          <span>{hub.city}</span>
                          <span className="font-bold text-white">{hub.pct}%</span>
                        </div>
                        <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-rose-600 h-full rounded-full" style={{ width: `${hub.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Shortcuts & Administrative Actions */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Admin Quick Actions</span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Directly execute actions affecting the live matrimonial application.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <button
                      onClick={() => setIsAddingProfile(true)}
                      className="w-full flex items-center justify-between p-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors border border-neutral-700 font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-rose-500" />
                        <span>Add New Profile Manually</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab('kyc')}
                      className="w-full flex items-center justify-between p-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors border border-neutral-700 font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Review KYC Queue ({kycQueue.filter((k) => k.status === 'pending').length})</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab('broadcasts')}
                      className="w-full flex items-center justify-between p-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors border border-neutral-700 font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-purple-400" />
                        <span>Post Announcement Banner</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    </button>

                    <button
                      onClick={handleExportData}
                      className="w-full flex items-center justify-between p-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors border border-neutral-700 font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-sky-400" />
                        <span>Download Full JSON Backup</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: PROFILES & BIODATAS DIRECTORY */}
          {activeTab === 'profiles' && (
            <div className="space-y-4">
              
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Biodatas Directory ({filteredProfiles.length})</h1>
                  <p className="text-xs text-neutral-400">
                    Search, verify, edit, and moderate matrimonial profiles registered on husbandwife.com.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddingProfile(true)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Profile</span>
                  </button>
                </div>
              </div>

              {/* Filter bar (Fully Responsive) */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                
                {/* Search query */}
                <div className="relative w-full sm:flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, city, profession, caste..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 min-h-[40px]"
                  />
                </div>

                {/* Gender filter */}
                <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded-lg p-1 w-full sm:w-auto justify-between sm:justify-start">
                  {(['all', 'female', 'male'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGenderFilter(g)}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded text-xs capitalize font-medium transition-colors text-center min-h-[34px] ${
                        genderFilter === g ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {g === 'all' ? 'All Genders' : g}
                    </button>
                  ))}
                </div>

                {/* Status filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 w-full sm:w-auto min-h-[40px]"
                >
                  <option value="all">All Verification Status</option>
                  <option value="verified">Verified Only (Aadhaar/ID)</option>
                  <option value="unverified">Unverified Profiles</option>
                  <option value="vip">VIP Members</option>
                  <option value="suspended">Suspended Profiles</option>
                </select>
              </div>

              {/* MOBILE CARDS VIEW (md:hidden) - Zero Horizontal Scrolling, All Actions Direct */}
              <div className="md:hidden space-y-3">
                {filteredProfiles.length === 0 ? (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center text-neutral-400 text-xs">
                    No profiles matching current filter criteria.
                  </div>
                ) : (
                  filteredProfiles.map((p) => {
                    const isSuspended = suspendedProfileIds.includes(p.id);
                    return (
                      <div key={p.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 space-y-3 text-xs">
                        
                        {/* Card Top: Photo, Name, Age, Status */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.photos[0]}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover border border-neutral-700 shrink-0"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  p.gender === 'female'
                                    ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
                                    : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80';
                              }}
                            />
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-white text-sm">{p.name}</span>
                                {p.isPremium && (
                                  <span title="VIP Member" className="text-amber-400">
                                    <Crown className="w-3.5 h-3.5" />
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-neutral-400 capitalize">
                                {p.gender} · {p.age} yrs · {p.height}
                              </p>
                              <p className="text-[11px] text-neutral-300">
                                {p.city}, {p.state}
                              </p>
                            </div>
                          </div>

                          {/* Verification & Account Badges */}
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <button
                              onClick={() => handleToggleVerify(p.id)}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                                p.isVerified
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                              }`}
                              title="Click to toggle verification status"
                            >
                              {p.isVerified ? (
                                <>
                                  <BadgeCheck className="w-3 h-3 text-emerald-400" />
                                  <span>Verified</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3 text-neutral-400" />
                                  <span>Unverified</span>
                                </>
                              )}
                            </button>

                            {isSuspended ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                                Suspended
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-800 text-neutral-300">
                                Active
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Candidate Details Snippet */}
                        <div className="grid grid-cols-2 gap-2 p-2.5 bg-neutral-950 rounded-lg border border-neutral-800/80 text-[11px]">
                          <div>
                            <p className="text-neutral-400">Career & Income:</p>
                            <p className="font-medium text-white truncate">{p.profession}</p>
                            <p className="font-bold text-emerald-400">{p.annualIncome}</p>
                          </div>
                          <div>
                            <p className="text-neutral-400">Astro & Religion:</p>
                            <p className="font-medium text-amber-300">{p.kundli.gunaScore}/36 Gunas</p>
                            <p className="text-neutral-300 truncate">{p.religion} · {p.caste}</p>
                          </div>
                        </div>

                        {/* Action Buttons Row (Touch targets >= 40px, All Visible on Phone) */}
                        <div className="grid grid-cols-5 gap-1.5 pt-1">
                          
                          <button
                            onClick={() => setInspectingProfile(p)}
                            className="flex flex-col items-center justify-center p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors border border-neutral-700/80 min-h-[42px]"
                            title="View Full Biodata"
                          >
                            <Eye className="w-3.5 h-3.5 text-neutral-300" />
                            <span className="text-[9px] mt-0.5">Inspect</span>
                          </button>

                          <button
                            onClick={() => setEditingProfile(p)}
                            className="flex flex-col items-center justify-center p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors border border-neutral-700/80 min-h-[42px]"
                            title="Edit Biodata"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-neutral-300" />
                            <span className="text-[9px] mt-0.5">Edit</span>
                          </button>

                          <button
                            onClick={() => handleToggleVip(p.id)}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors border min-h-[42px] ${
                              p.isPremium
                                ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700/80'
                            }`}
                            title="Toggle VIP"
                          >
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[9px] mt-0.5">VIP</span>
                          </button>

                          <button
                            onClick={() => handleToggleSuspend(p.id)}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors border min-h-[42px] ${
                              isSuspended
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700/80'
                            }`}
                            title={isSuspended ? 'Restore Profile' : 'Suspend Profile'}
                          >
                            {isSuspended ? <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> : <UserX className="w-3.5 h-3.5 text-rose-400" />}
                            <span className="text-[9px] mt-0.5">{isSuspended ? 'Restore' : 'Suspend'}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteProfile(p.id)}
                            className="flex flex-col items-center justify-center p-2 rounded-lg bg-neutral-800 hover:bg-rose-950 hover:text-rose-300 text-neutral-300 transition-colors border border-neutral-700/80 min-h-[42px]"
                            title="Delete Profile"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span className="text-[9px] mt-0.5">Delete</span>
                          </button>

                        </div>

                      </div>
                    );
                  })
                )}
              </div>

              {/* DESKTOP PROFILES TABLE (hidden md:block) */}
              <div className="hidden md:block bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto shadow-md">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-950/70 text-neutral-400 text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4">Profile & Photo</th>
                      <th className="py-3 px-4">Demographics</th>
                      <th className="py-3 px-4">Profession & Income</th>
                      <th className="py-3 px-4">Kundli & Guna</th>
                      <th className="py-3 px-4">Verification</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80">
                    {filteredProfiles.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-neutral-400">
                          No profiles matching current filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredProfiles.map((p) => {
                        const isSuspended = suspendedProfileIds.includes(p.id);
                        return (
                          <tr key={p.id} className="hover:bg-neutral-800/50 transition-colors">
                            
                            {/* Profile & Photo */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.photos[0]}
                                  alt={p.name}
                                  className="w-10 h-10 rounded-full object-cover border border-neutral-700 shrink-0"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src =
                                      p.gender === 'female'
                                        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
                                        : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80';
                                  }}
                                />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-white">{p.name}</span>
                                    {p.isPremium && (
                                      <span title="VIP Member">
                                        <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-neutral-400 capitalize">
                                    {p.gender} · {p.age} yrs · {p.height}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Demographics */}
                            <td className="py-3 px-4">
                              <p className="text-white font-medium">{p.city}, {p.state}</p>
                              <p className="text-[11px] text-neutral-400">{p.religion} · {p.caste}</p>
                            </td>

                            {/* Profession & Income */}
                            <td className="py-3 px-4">
                              <p className="text-white font-medium">{p.profession}</p>
                              <p className="text-[11px] text-emerald-400 font-semibold">{p.annualIncome}</p>
                            </td>

                            {/* Kundli & Guna */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-amber-300">{p.kundli.gunaScore}/36</span>
                                <span className="text-[11px] text-neutral-400">Gunas</span>
                              </div>
                              <p className="text-[10px] text-neutral-400">{p.kundli.manglik}</p>
                            </td>

                            {/* Verification Toggle */}
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleToggleVerify(p.id)}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                                  p.isVerified
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-white'
                                }`}
                                title="Click to toggle verification status"
                              >
                                {p.isVerified ? (
                                  <>
                                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Verified</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3.5 h-3.5 text-neutral-400" />
                                    <span>Unverified</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Account Status */}
                            <td className="py-3 px-4">
                              {isSuspended ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                                  Suspended
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300">
                                  Active
                                </span>
                              )}
                            </td>

                            {/* Actions Buttons */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                
                                {/* Inspect Full Biodata */}
                                <button
                                  onClick={() => setInspectingProfile(p)}
                                  className="p-1.5 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
                                  title="View Full Biodata & Kundli"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                {/* Edit Profile */}
                                <button
                                  onClick={() => setEditingProfile(p)}
                                  className="p-1.5 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
                                  title="Edit Profile"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                {/* Toggle VIP status */}
                                <button
                                  onClick={() => handleToggleVip(p.id)}
                                  className={`p-1.5 rounded-md transition-colors ${
                                    p.isPremium
                                      ? 'text-amber-300 bg-amber-950/60 border border-amber-800'
                                      : 'text-neutral-400 hover:text-amber-300 bg-neutral-800 hover:bg-neutral-700'
                                  }`}
                                  title="Toggle VIP Plan"
                                >
                                  <Crown className="w-3.5 h-3.5" />
                                </button>

                                {/* Suspend / Unsuspend */}
                                <button
                                  onClick={() => handleToggleSuspend(p.id)}
                                  className={`p-1.5 rounded-md transition-colors ${
                                    isSuspended
                                      ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800'
                                      : 'text-neutral-400 hover:text-rose-400 bg-neutral-800 hover:bg-neutral-700'
                                  }`}
                                  title={isSuspended ? 'Restore profile' : 'Suspend profile'}
                                >
                                  {isSuspended ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                                </button>

                                {/* Delete Profile */}
                                <button
                                  onClick={() => handleDeleteProfile(p.id)}
                                  className="p-1.5 text-neutral-400 hover:text-rose-400 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
                                  title="Delete Profile permanently"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: KYC & VERIFICATION QUEUE */}
          {activeTab === 'kyc' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">KYC Identity Verification Queue</h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Authenticate Aadhaar, Degrees, and Identity cards submitted by boys and girls to maintain 100% verified matrimonial trust.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {kycQueue.map((item) => (
                  <div key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-white text-xs">{item.docType}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : item.status === 'rejected'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    {/* Profile Information */}
                    <div className="flex items-center gap-3 p-3 bg-neutral-950 rounded-lg border border-neutral-800/80">
                      <img
                        src={item.docImageUrl}
                        alt={item.profileName}
                        className="w-12 h-12 rounded-lg object-cover border border-neutral-700 shrink-0"
                      />
                      <div className="text-xs">
                        <p className="font-semibold text-white">{item.profileName}</p>
                        <p className="text-neutral-400 text-[11px] capitalize">{item.gender} · Profile #{item.profileId}</p>
                        <p className="text-neutral-400 text-[11px]">Submitted: {item.submittedAt}</p>
                      </div>
                    </div>

                    {/* Document details */}
                    <div className="bg-neutral-950/70 p-3 rounded-lg border border-neutral-800 text-xs space-y-1.5">
                      <p className="text-neutral-400 text-[11px]">Document Reference No.:</p>
                      <p className="font-mono font-bold text-emerald-400 tracking-wider text-sm">{item.docNumberMasked}</p>
                      <p className="text-[10px] text-neutral-400">Encrypted Aadhaar Vault UIDAI Compliance</p>
                    </div>

                    {/* Action buttons */}
                    {item.status === 'pending' ? (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleApproveKyc(item)}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Verify</span>
                        </button>
                        <button
                          onClick={() => handleRejectKyc(item)}
                          className="py-2 px-3 bg-neutral-800 hover:bg-rose-950 hover:text-rose-300 text-neutral-300 border border-neutral-700 rounded-lg text-xs font-semibold transition-colors"
                          title="Reject document"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400 text-center py-1">
                        Processed by Administrator ✓
                      </p>
                    )}

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LIVE VIDEO CALLS MONITOR */}
          {activeTab === 'calls' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Active Video Call Channels & Rooms</h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Monitor real-time WebRTC sessions, phone and laptop camera streams, bandwidth, and room latency.
                </p>
              </div>

              {/* Active Sessions Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* Session Card 1 */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="font-bold text-white text-xs">Room: COUPLE-8912</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      LIVE · 04:32
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                    <div className="space-y-1">
                      <p className="text-[11px] text-neutral-400">Caller (Host):</p>
                      <p className="font-semibold text-white text-xs">Aarav Patel (28, Delhi)</p>
                      <p className="text-[10px] text-emerald-400">Phone Front Camera (60fps)</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] text-neutral-400">Participant:</p>
                      <p className="font-semibold text-white text-xs">Ananya Sharma (26, Delhi)</p>
                      <p className="text-[10px] text-emerald-400">Laptop Webcam (720p HD)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-neutral-950/80 rounded border border-neutral-800">
                      <p className="text-[10px] text-neutral-400">Latency</p>
                      <p className="font-bold text-emerald-400">18 ms</p>
                    </div>
                    <div className="p-2 bg-neutral-950/80 rounded border border-neutral-800">
                      <p className="text-[10px] text-neutral-400">Bitrate</p>
                      <p className="font-bold text-white">1,850 kbps</p>
                    </div>
                    <div className="p-2 bg-neutral-950/80 rounded border border-neutral-800">
                      <p className="text-[10px] text-neutral-400">Packet Loss</p>
                      <p className="font-bold text-emerald-400">0.02%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-neutral-400">Encryption: DTLS / SRTP 128-bit</span>
                    <button
                      onClick={() => showToast('Room COUPLE-8912 connection quality verified.')}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs font-semibold"
                    >
                      Inspect Stats
                    </button>
                  </div>
                </div>

                {/* Session Card 2 */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="font-bold text-white text-xs">Room: COUPLE-4201</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      LIVE · 11:45
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                    <div className="space-y-1">
                      <p className="text-[11px] text-neutral-400">Caller (Host):</p>
                      <p className="font-semibold text-white text-xs">Kabir Kapoor (29, Mumbai)</p>
                      <p className="text-[10px] text-emerald-400">Phone Front Camera (60fps)</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] text-neutral-400">Participant:</p>
                      <p className="font-semibold text-white text-xs">Dr. Priya Desai (27, Mumbai)</p>
                      <p className="text-[10px] text-emerald-400">Phone Front Camera (60fps)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-neutral-950/80 rounded border border-neutral-800">
                      <p className="text-[10px] text-neutral-400">Latency</p>
                      <p className="font-bold text-emerald-400">22 ms</p>
                    </div>
                    <div className="p-2 bg-neutral-950/80 rounded border border-neutral-800">
                      <p className="text-[10px] text-neutral-400">Bitrate</p>
                      <p className="font-bold text-white">2,100 kbps</p>
                    </div>
                    <div className="p-2 bg-neutral-950/80 rounded border border-neutral-800">
                      <p className="text-[10px] text-neutral-400">Packet Loss</p>
                      <p className="font-bold text-emerald-400">0.00%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-neutral-400">Encryption: DTLS / SRTP 128-bit</span>
                    <button
                      onClick={() => showToast('Room COUPLE-4201 connection quality verified.')}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs font-semibold"
                    >
                      Inspect Stats
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: REPORTS & MODERATION */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Trust & Safety Moderation Tickets</h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Manage user complaints, grievance redressal, and maintain respectful family matrimonial conduct.
                </p>
              </div>

              <div className="space-y-3">
                {reports.map((r) => (
                  <div key={r.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 ${r.severity === 'high' ? 'text-rose-500' : 'text-amber-400'}`} />
                        <span className="font-bold text-white text-xs">Ticket #{r.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          r.status === 'open' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300">
                        Reported Profile: <strong className="text-white">{r.reportedName}</strong> by <span className="text-neutral-400">{r.reporterName}</span>
                      </p>
                      <p className="text-xs text-neutral-400 max-w-2xl bg-neutral-950 p-2 rounded border border-neutral-800/80">
                        &quot;{r.reason}&quot;
                      </p>
                      <p className="text-[10px] text-neutral-400">Timestamp: {r.reportedAt}</p>
                    </div>

                    {r.status === 'open' && (
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <button
                          onClick={() => handleResolveReport(r.id, 'Warning Sent')}
                          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 rounded-lg transition-colors border border-neutral-700"
                        >
                          Send Warning
                        </button>
                        <button
                          onClick={() => handleResolveReport(r.id, 'Dismissed (False alarm)')}
                          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-400 hover:text-white rounded-lg transition-colors border border-neutral-700"
                        >
                          Dismiss Ticket
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: BROADCAST ANNOUNCEMENTS */}
          {activeTab === 'broadcasts' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">System Broadcast Banner</h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Publish an announcement banner that displays at the top of the user matrimonial app in real-time.
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-300">
                    Announcement Message (Hinglish or English):
                  </label>
                  <textarea
                    rows={3}
                    value={broadcastDraft}
                    onChange={(e) => setBroadcastDraft(e.target.value)}
                    placeholder="Enter announcement text to show across all users..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Banner Live Preview */}
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-neutral-400">Live Preview on User Screens:</p>
                  <div className="bg-gradient-to-r from-rose-900/80 via-pink-900/80 to-purple-900/80 border border-rose-700/60 text-rose-100 p-2.5 rounded-lg text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="font-medium">{broadcastDraft || 'No active announcement'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSaveBroadcast}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Announcement</span>
                  </button>
                  <button
                    onClick={() => {
                      setBroadcastDraft('');
                      setBroadcastMessage(null);
                      showToast('Announcement banner cleared.');
                    }}
                    className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Clear Banner
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: AUDIT EVENT LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Security & Operational Audit Logs</h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Chronological trail of administrative actions, authentication milestones, and security verifications.
                </p>
              </div>

              {/* MOBILE AUDIT LOGS VIEW (md:hidden) */}
              <div className="md:hidden space-y-2.5">
                {auditLogs.map((log) => (
                  <div key={log.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 space-y-1.5 text-xs">
                    <p className="font-semibold text-white">{log.action}</p>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>{log.actor}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-950 border border-neutral-800 text-neutral-300">
                        {log.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>{log.timestamp}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* DESKTOP AUDIT LOGS TABLE (hidden md:block) */}
              <div className="hidden md:block bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-950/70 text-neutral-400 text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4">Action Event</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="py-2.5 px-4 font-medium text-white">{log.action}</td>
                        <td className="py-2.5 px-4 text-neutral-300">{log.actor}</td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-950 border border-neutral-800 text-neutral-300">
                            {log.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right text-neutral-400 text-[11px]">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL 1: INSPECT FULL BIODATA */}
      {inspectingProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 text-xs text-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Biodata Inspector · #{inspectingProfile.id}</h2>
                {inspectingProfile.isVerified && (
                  <BadgeCheck className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <button
                onClick={() => setInspectingProfile(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={inspectingProfile.photos[0]}
                alt={inspectingProfile.name}
                className="w-20 h-20 rounded-xl object-cover border border-neutral-700"
              />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">{inspectingProfile.name}</h3>
                <p className="text-neutral-400">
                  {inspectingProfile.gender} · {inspectingProfile.age} yrs · {inspectingProfile.height}
                </p>
                <p className="text-neutral-300">
                  {inspectingProfile.religion} · {inspectingProfile.caste} · {inspectingProfile.city}, {inspectingProfile.state}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <div>
                <p className="text-[11px] text-neutral-400">Profession & Education:</p>
                <p className="font-semibold text-white">{inspectingProfile.profession} at {inspectingProfile.companyType}</p>
                <p className="text-neutral-400">{inspectingProfile.education} ({inspectingProfile.college})</p>
              </div>
              <div>
                <p className="text-[11px] text-neutral-400">Income & Lifestyle:</p>
                <p className="font-bold text-emerald-400">{inspectingProfile.annualIncome}</p>
                <p className="text-neutral-400">Diet: {inspectingProfile.diet} · Drinks: {inspectingProfile.drinking}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="font-bold text-white text-xs">About Candidate:</p>
              <p className="text-neutral-300 leading-relaxed bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                {inspectingProfile.about}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <div>
                <p className="font-bold text-amber-300">Kundli Compatibility (Milan):</p>
                <p className="text-neutral-300">Score: {inspectingProfile.kundli.gunaScore}/36 Gunas</p>
                <p className="text-neutral-400">Rashi: {inspectingProfile.kundli.rashi}</p>
                <p className="text-neutral-400">Nakshatra: {inspectingProfile.kundli.nakshatra}</p>
                <p className="text-neutral-400">Manglik: {inspectingProfile.kundli.manglik}</p>
              </div>
              <div>
                <p className="font-bold text-white">Family Background:</p>
                <p className="text-neutral-300">Type: {inspectingProfile.family.familyType} ({inspectingProfile.family.familyValues})</p>
                <p className="text-neutral-400">Father: {inspectingProfile.family.fatherOccupation}</p>
                <p className="text-neutral-400">Mother: {inspectingProfile.family.motherOccupation}</p>
                <p className="text-neutral-400">Native: {inspectingProfile.family.nativeLocation}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectingProfile(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT PROFILE */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEditedProfile}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 space-y-4 text-xs text-neutral-200"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-base font-bold text-white">Edit Profile Metadata</h2>
              <button
                type="button"
                onClick={() => setEditingProfile(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-neutral-400">Full Name</label>
                <input
                  type="text"
                  value={editingProfile.name}
                  onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-neutral-400">Age</label>
                <input
                  type="number"
                  value={editingProfile.age}
                  onChange={(e) => setEditingProfile({ ...editingProfile, age: Number(e.target.value) })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-neutral-400">City</label>
                <input
                  type="text"
                  value={editingProfile.city}
                  onChange={(e) => setEditingProfile({ ...editingProfile, city: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-neutral-400">Profession</label>
                <input
                  type="text"
                  value={editingProfile.profession}
                  onChange={(e) => setEditingProfile({ ...editingProfile, profession: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-neutral-400">Annual Income</label>
                <input
                  type="text"
                  value={editingProfile.annualIncome}
                  onChange={(e) => setEditingProfile({ ...editingProfile, annualIncome: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-neutral-400">Caste / Community</label>
                <input
                  type="text"
                  value={editingProfile.caste}
                  onChange={(e) => setEditingProfile({ ...editingProfile, caste: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400">About & Bio</label>
              <textarea
                rows={3}
                value={editingProfile.about}
                onChange={(e) => setEditingProfile({ ...editingProfile, about: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setEditingProfile(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: ADD NEW PROFILE */}
      {isAddingProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateProfile}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 space-y-4 text-xs text-neutral-200"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-base font-bold text-white">Create New Matrimonial Biodata</h2>
              <button
                type="button"
                onClick={() => setIsAddingProfile(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-neutral-400">Full Name</label>
                <input
                  type="text"
                  value={newProfileForm.name}
                  onChange={(e) => setNewProfileForm({ ...newProfileForm, name: e.target.value })}
                  placeholder="e.g. Radhika Sen"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-neutral-400">Gender</label>
                <select
                  value={newProfileForm.gender}
                  onChange={(e) => setNewProfileForm({ ...newProfileForm, gender: e.target.value as Gender })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <div className="space-y-1">
                <label className="text-neutral-400">Age</label>
                <input
                  type="number"
                  value={newProfileForm.age}
                  onChange={(e) => setNewProfileForm({ ...newProfileForm, age: Number(e.target.value) })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white min-h-[40px]"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-neutral-400">City</label>
                <input
                  type="text"
                  value={newProfileForm.city}
                  onChange={(e) => setNewProfileForm({ ...newProfileForm, city: e.target.value })}
                  placeholder="e.g. Mumbai"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white min-h-[40px]"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-neutral-400">Religion</label>
                <input
                  type="text"
                  value={newProfileForm.religion}
                  onChange={(e) => setNewProfileForm({ ...newProfileForm, religion: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white min-h-[40px]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-neutral-400">Profession</label>
                <input
                  type="text"
                  value={newProfileForm.profession}
                  onChange={(e) => setNewProfileForm({ ...newProfileForm, profession: e.target.value })}
                  placeholder="e.g. Chartered Accountant"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-neutral-400">Annual Income</label>
                <input
                  type="text"
                  value={newProfileForm.annualIncome}
                  onChange={(e) => setNewProfileForm({ ...newProfileForm, annualIncome: e.target.value })}
                  placeholder="e.g. ₹20 - 25 LPA"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400">About & Bio</label>
              <textarea
                rows={2}
                value={newProfileForm.about}
                onChange={(e) => setNewProfileForm({ ...newProfileForm, about: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setIsAddingProfile(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg"
              >
                Create Biodata
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
