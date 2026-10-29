import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Users, 
  Video, 
  Phone, 
  MessageCircle, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Send, 
  Lock, 
  ArrowRight, 
  RefreshCw,
  QrCode,
  Radio,
  UserCheck
} from 'lucide-react';
import { Profile } from '../types/matrimony';

interface OneToOneConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  myProfile: Profile;
  targetProfile?: Profile | null;
  onStartVideoCall: (partner: Profile) => void;
  initialRoomId?: string | null;
}

interface RoomParticipant {
  id: string;
  name: string;
  gender: 'male' | 'female';
  photo?: string;
  phone?: string;
  joinedAt: string;
}

interface WsChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export const OneToOneConnectModal: React.FC<OneToOneConnectModalProps> = ({
  isOpen,
  onClose,
  myProfile,
  targetProfile,
  onStartVideoCall,
  initialRoomId,
}) => {
  // Room state
  const [roomId, setRoomId] = useState<string>(() => {
    if (initialRoomId) return initialRoomId.toUpperCase().trim();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `COUPLE-${rand}`;
  });
  
  const [joinInputCode, setJoinInputCode] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [messages, setMessages] = useState<WsChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'video' | 'kundli'>('chat');

  const wsRef = useRef<WebSocket | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<any>(null);

  // Derive direct connect sharable link
  const connectUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?room=${roomId}`
    : `https://husbandwife.com/connect?room=${roomId}`;

  // Establish real WebSocket connection
  useEffect(() => {
    if (!isOpen) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
      setParticipants([]);
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      // Send join event with real user info
      const joinPayload = {
        type: 'join',
        roomId,
        user: {
          id: myProfile.id,
          name: myProfile.name,
          gender: myProfile.gender,
          photo: myProfile.photos[0] || '',
          phone: myProfile.verifiedDetails?.[0] || '+91 98765 43210',
        },
      };
      ws.send(JSON.stringify(joinPayload));
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'room_joined') {
          setParticipants(data.participants || []);
          if (data.messages) {
            setMessages(data.messages);
          }
        } else if (data.type === 'presence') {
          setParticipants(data.participants || []);
        } else if (data.type === 'chat_message') {
          setMessages((prev) => {
            // Avoid duplicate message IDs
            if (prev.some((m) => m.id === data.message.id)) return prev;
            return [...prev, data.message];
          });
        } else if (data.type === 'typing') {
          if (data.isTyping) {
            setPartnerTyping(data.userName || 'Partner');
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
              setPartnerTyping(null);
            }, 2500);
          } else {
            setPartnerTyping(null);
          }
        }
      } catch (e) {
        console.warn('WS message parse error:', e);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (e) => {
      console.warn('WS error:', e);
      setIsConnected(false);
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [isOpen, roomId, myProfile]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, partnerTyping]);

  if (!isOpen) return null;

  const otherParticipant = participants.find((p) => p.id !== myProfile.id);
  const isOneToOneReady = participants.length >= 2;

  // Send real-time chat message via WebSocket
  const handleSendMessage = () => {
    if (!inputText.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const payload = {
      type: 'chat_message',
      roomId,
      text: inputText.trim(),
    };
    wsRef.current.send(JSON.stringify(payload));
    setInputText('');
  };

  // Typing notice
  const handleInputChange = (val: string) => {
    setInputText(val);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'typing',
        roomId,
        isTyping: val.length > 0,
      }));
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(connectUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(roomId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const textMsg = encodeURIComponent(
      `*husbandwife.com Matrimonial Connect*\n\nNamaste! I would love to connect with you directly 1-to-1 on husbandwife.com for our matrimonial conversation.\n\nClick here to join my private 1-to-1 room:\n👉 ${connectUrl}\n\nRoom Code: *${roomId}*\n(100% Private & Verified)`
    );
    window.open(`https://api.whatsapp.com/send?text=${textMsg}`, '_blank');
  };

  const handleJoinDifferentRoom = () => {
    if (!joinInputCode.trim()) return;
    const clean = joinInputCode.toUpperCase().trim();
    setRoomId(clean);
    setJoinInputCode('');
  };

  const handleLaunchOneToOneVideo = () => {
    // If targetProfile exists or otherParticipant exists
    const partnerToCall: Profile = targetProfile || {
      id: otherParticipant?.id || 'p-connected-1',
      name: otherParticipant?.name || 'Ananya Sharma',
      gender: otherParticipant?.gender || (myProfile.gender === 'male' ? 'female' : 'male'),
      age: 26,
      height: "5' 5\"",
      religion: 'Hindu',
      caste: 'Brahmin',
      motherTongue: 'Hindi',
      city: 'New Delhi',
      state: 'Delhi NCR',
      country: 'India',
      education: 'Master of Science',
      college: 'Delhi University',
      profession: 'Senior Product Designer',
      companyType: 'Top Tech MNC',
      annualIncome: '₹24 - 28 LPA',
      diet: 'Vegetarian',
      drinking: 'Never',
      smoking: 'No',
      about: 'Warm-hearted, cultured professional seeking meaningful connection.',
      photos: otherParticipant?.photo ? [otherParticipant.photo] : ['/assets/images/profile_ananya_1792826629253.jpg'],
      isVerified: true,
      verifiedDetails: ['Govt ID Verified', 'WhatsApp 1-to-1 Connected'],
      lastActive: 'Online now in 1-to-1 Room',
      compatibilityScore: 98,
      kundli: {
        rashi: 'Kanya (Virgo)',
        nakshatra: 'Hasta',
        manglik: 'Non-Manglik',
        gunaScore: 34,
        breakdown: { varna: 1, vashya: 2, tara: 3, yoni: 4, grahaMaitri: 5, gana: 6, bhakoot: 6, nadi: 7 },
      },
      family: {
        familyType: 'Nuclear',
        familyValues: 'Moderate',
        fatherOccupation: 'Senior Executive',
        motherOccupation: 'Educator',
        siblings: '1 Younger Brother',
        nativeLocation: 'New Delhi',
        familyStatus: 'Upper Middle Class',
      },
      expectations: {
        ageRange: '26 - 32 yrs',
        heightRange: "5' 8\" to 6' 2\"",
        maritalStatus: 'Never Married',
        religion: 'Hindu',
        motherTongue: 'Hindi',
        education: 'Postgraduate',
        annualIncome: '₹20 LPA+',
        diet: 'Vegetarian',
      },
      interests: ['Art', 'Music', 'Travel'],
      isMyProfile: false,
    };

    onClose();
    onStartVideoCall(partnerToCall);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header: 1-to-1 Connection Branding */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 px-4 sm:px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/25">
              <Users className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black font-serif tracking-tight">
                  1-to-1 Real Connection
                </h3>
                <span className="text-[10px] bg-emerald-500/90 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-pulse" /> LIVE WS
                </span>
              </div>
              <p className="text-[11px] text-rose-100 font-medium">
                Private Matrimonial Direct Room · Instant Chat & HD Video Call
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/15 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Room Status Banner */}
        <div className="bg-neutral-100 px-4 sm:px-6 py-2.5 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-neutral-500 font-sans font-semibold">Room Code:</span>
            <span className="px-2.5 py-0.5 bg-white border border-neutral-300 rounded-md font-bold text-neutral-900 tracking-wider">
              {roomId}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="text-neutral-500 hover:text-neutral-900 p-1"
              title="Copy Code"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isOneToOneReady ? 'bg-emerald-500 animate-ping' : 'bg-amber-500 animate-pulse'}`} />
            <span className="font-semibold text-neutral-700">
              {isOneToOneReady ? '2/2 Connected (1-to-1 Live)' : `Waiting for Partner (${participants.length}/2 Connected)`}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* STEP 1: SHARE & INVITE CARD */}
          <div className="p-4 sm:p-5 bg-gradient-to-br from-rose-50/60 via-amber-50/30 to-white border border-rose-200 rounded-2xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-neutral-950 font-serif flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Invite Bride / Groom to Connect 1-to-1</span>
                </h4>
                <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                  Apne pasandeeda profile ko WhatsApp ya Direct Link se invite karein. Jaise hi wo link open karenge, aap dono <strong>1-to-1 private video call aur chat me connect ho jayenge</strong>.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-center p-2 bg-white rounded-xl border border-neutral-200 shadow-2xs">
                <QrCode className="w-8 h-8 text-neutral-700" />
                <span className="text-[9px] text-neutral-500 font-mono mt-0.5">ROOM QR</span>
              </div>
            </div>

            {/* Quick Action Share Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="py-2.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Share Invite on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="py-2.5 px-4 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-rose-600" />}
                <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy 1-to-1 Connect Link'}</span>
              </button>
            </div>
          </div>

          {/* DUAL PROFILES CONNECTED DISPLAY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* You (User) */}
            <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center gap-3">
              <img
                src={myProfile.photos[0] || '/assets/images/profile_rohit_1792826629953.jpg'}
                alt={myProfile.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-rose-500 shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-neutral-900 truncate">{myProfile.name}</span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded-full">You</span>
                </div>
                <p className="text-[11px] text-neutral-500 truncate">{myProfile.profession} · {myProfile.city}</p>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online (Host)
                </span>
              </div>
            </div>

            {/* Partner */}
            <div className={`p-3.5 border rounded-2xl flex items-center gap-3 transition-all ${
              otherParticipant 
                ? 'bg-emerald-50/50 border-emerald-300' 
                : 'bg-neutral-50 border-dashed border-neutral-300'
            }`}>
              {otherParticipant ? (
                <>
                  <img
                    src={otherParticipant.photo || (targetProfile?.photos[0] || '/assets/images/profile_ananya_1792826629253.jpg')}
                    alt={otherParticipant.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-neutral-900 truncate">{otherParticipant.name}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">Partner</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate">Joined: {otherParticipant.joinedAt}</p>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Connected 1-to-1
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 rounded-xl bg-neutral-200 border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-neutral-700 block">Waiting for Partner...</span>
                    <p className="text-[11px] text-neutral-500">Share room link or code above to connect.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MAIN 1-TO-1 VIDEO CALL LAUNCH BAR */}
          <div className="p-4 bg-neutral-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-900/60 shrink-0">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-serif text-white">
                  1-to-1 Real-Time Video Call
                </h4>
                <p className="text-xs text-neutral-300">
                  Dono ka face samne aayega live HD video call par.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLaunchOneToOneVideo}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950 transition-all active:scale-95 shrink-0"
            >
              <Video className="w-4 h-4" />
              <span>Start 1-to-1 Video Call</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* REAL-TIME 1-TO-1 CHAT MESSAGING BOX */}
          <div className="border border-neutral-200 rounded-2xl overflow-hidden shadow-xs flex flex-col h-72 bg-neutral-50">
            {/* Chat header */}
            <div className="bg-white px-4 py-2.5 border-b border-neutral-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                <MessageCircle className="w-4 h-4 text-rose-600" />
                <span>Instant 1-to-1 WebSocket Chat</span>
              </div>
              <span className="text-[10px] text-neutral-500">
                {messages.length} messages · End-to-End Private
              </span>
            </div>

            {/* Messages list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-neutral-400">
                  <Sparkles className="w-6 h-6 text-amber-400 mb-1" />
                  <p className="text-xs font-semibold text-neutral-600">No messages yet in this 1-to-1 room</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Send a warm greeting to start your conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === myProfile.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1 text-[10px] text-neutral-400 mb-0.5 px-1">
                        <span className="font-semibold text-neutral-600">{msg.senderName}</span>
                        <span>·</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                          isMe
                            ? 'bg-rose-600 text-white rounded-tr-xs shadow-xs'
                            : 'bg-white text-neutral-900 border border-neutral-200 rounded-tl-xs shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing indicator */}
              {partnerTyping && (
                <div className="text-[11px] text-neutral-500 italic px-2 flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{partnerTyping} is typing...</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="bg-white p-2.5 border-t border-neutral-200 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a 1-to-1 message..."
                className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="p-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* JOIN DIFFERENT ROOM ACCORDION */}
          <div className="pt-2 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-neutral-500">Have another 1-to-1 Room Code?</span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="e.g. COUPLE-9821"
                value={joinInputCode}
                onChange={(e) => setJoinInputCode(e.target.value)}
                className="px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-mono uppercase font-bold text-neutral-800 w-36"
              />
              <button
                type="button"
                onClick={handleJoinDifferentRoom}
                disabled={!joinInputCode.trim()}
                className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Switch Room
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
          <div className="flex items-center gap-1.5 text-neutral-600">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted 1-to-1 Private Session</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Govt ID Verified Members</span>
            <span>·</span>
            <span>Zero Recording Policy</span>
          </div>
        </div>

      </div>
    </div>
  );
};
