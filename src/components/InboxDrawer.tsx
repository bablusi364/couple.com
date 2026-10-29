import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Phone,
  Video,
  ShieldCheck,
  Heart,
  Sparkles,
  Smile,
  Paperclip,
  Mic,
  MicOff,
  Play,
  Pause,
  Search,
  ArrowLeft,
  UserCheck,
  Image as ImageIcon,
  Check,
  CheckCheck,
  Plus,
  FileText,
  User,
  Clock,
  MessageCircle,
} from 'lucide-react';
import { Profile, ChatMessage, Connection, CallType } from '../types/matrimony';

interface InboxDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  connections: Record<string, Connection>;
  profiles: Profile[];
  onAcceptInterest: (profileId: string) => void;
  onDeclineInterest: (profileId: string) => void;
  onSendMessage: (
    profileId: string,
    text: string,
    extra?: {
      mediaUrl?: string;
      mediaType?: 'image' | 'audio';
      audioDuration?: string;
      caption?: string;
    }
  ) => void;
  activeChatProfileId: string | null;
  setActiveChatProfileId: (id: string | null) => void;
  onStartCall?: (profile: Profile, type: CallType) => void;
  onViewProfileDetails?: (profile: Profile) => void;
}

export const InboxDrawer: React.FC<InboxDrawerProps> = ({
  isOpen,
  onClose,
  connections,
  profiles,
  onAcceptInterest,
  onDeclineInterest,
  onSendMessage,
  activeChatProfileId,
  setActiveChatProfileId,
  onStartCall,
  onViewProfileDetails,
}) => {
  // Tabs: 'chats' = active chats, 'contacts' = all boys & girls (anyone can chat), 'requests' = pending interests
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts' | 'requests'>('chats');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  // Voice note recording simulation
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio playback state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Typing indicator simulation state for active chat
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  // Auto-scroll to bottom of messages
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeChatProfileId) {
      scrollToBottom();
    }
  }, [activeChatProfileId, connections]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  // When a user sends a message, simulate realistic "typing..." state from the match
  const handlePartnerTypingSimulation = () => {
    setTimeout(() => {
      setIsPartnerTyping(true);
      setTimeout(() => {
        setIsPartnerTyping(false);
      }, 2000);
    }, 800);
  };

  if (!isOpen) return null;

  const getProfile = (id: string) => profiles.find((p) => p.id === id);
  const activeProfile = activeChatProfileId ? getProfile(activeChatProfileId) : null;
  const activeConnection = activeChatProfileId ? connections[activeChatProfileId] : null;

  // Pre-made matrimonial icebreakers (Hindi/English mix)
  const icebreakers = [
    'Namaste! Aapka bio dekha aur bohot achha laga 🙏',
    'Hello! We share similar cultural values and interests. Would love to connect!',
    'Aapka biodata padha, kya hum family call arrange kar sakte hain?',
    'Astro kundli match mein guna score 32/36 aaya hai! 🌟',
    'What do you enjoy doing during your free weekends?',
  ];

  const quickEmojis = ['❤️', '🙏', '😊', '👍', '🌹', '💍', '✨', '☕', '🎉', '💐'];

  // Handle play simulated voice note with Web Audio synth
  const handlePlayVoiceNote = (messageId: string) => {
    if (playingAudioId === messageId) {
      setPlayingAudioId(null);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      setPlayingAudioId(messageId);

      // Play a pleasant warm vocal chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);

      setTimeout(() => {
        setPlayingAudioId(null);
      }, 2500);
    } catch {
      setPlayingAudioId(null);
    }
  };

  const handleSendTextMessage = (textToSend?: string) => {
    const text = textToSend || messageInput;
    if (!text.trim() || !activeChatProfileId) return;

    onSendMessage(activeChatProfileId, text.trim());
    if (!textToSend) setMessageInput('');
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);
    handlePartnerTypingSimulation();
  };

  const handleSendVoiceNote = () => {
    if (!activeChatProfileId) return;
    const durationStr = `0:${recordingSeconds < 10 ? '0' : ''}${Math.max(1, recordingSeconds)}`;
    setIsRecording(false);
    setRecordingSeconds(0);

    onSendMessage(activeChatProfileId, '🎙️ Voice note', {
      mediaType: 'audio',
      audioDuration: durationStr,
    });
    handlePartnerTypingSimulation();
  };

  const handleSendPhotoAttachment = (type: 'biodata' | 'kundli' | 'photo') => {
    if (!activeChatProfileId || !activeProfile) return;
    setShowAttachmentMenu(false);

    let mediaUrl = activeProfile.photos[0];
    let caption = 'Shared photo attachment';

    if (type === 'biodata') {
      mediaUrl = '/assets/images/hero_couple_wedding_1792826628037.jpg';
      caption = '📄 Verified Matrimonial Biodata Summary & Family Background';
    } else if (type === 'kundli') {
      mediaUrl = '/assets/images/success_priya_rahul_1792826628513.jpg';
      caption = `🌟 Vedic Kundli Milan Score: ${activeProfile.kundli.gunaScore}/36 Gunas (${activeProfile.kundli.manglik})`;
    } else {
      mediaUrl = activeProfile.photos[0];
      caption = '📷 Verified Profile Photo';
    }

    onSendMessage(activeChatProfileId, caption, {
      mediaUrl,
      mediaType: 'image',
      caption,
    });
    handlePartnerTypingSimulation();
  };

  // Switch to chat with ANY profile immediately
  const handleStartChatWithProfile = (profile: Profile) => {
    setActiveChatProfileId(profile.id);
    setActiveTab('chats');
    setSearchQuery('');
  };

  // Filter profiles for "Contacts / All Boys & Girls"
  const directoryProfiles = profiles.filter((p) => {
    if (genderFilter === 'female' && p.gender !== 'female') return false;
    if (genderFilter === 'male' && p.gender !== 'male') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCity = p.city.toLowerCase().includes(q);
      const matchProf = p.profession.toLowerCase().includes(q);
      const matchCaste = p.caste.toLowerCase().includes(q);
      return matchName || matchCity || matchProf || matchCaste;
    }
    return true;
  });

  // Accepted active conversations
  const chatList = Object.entries(connections).filter(
    ([_, c]) => c.status === 'accepted' || c.messages.length > 0
  );

  const pendingRequests = Object.entries(connections).filter(
    ([_, c]) => c.status === 'pending'
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-neutral-300">
        
        {/* WhatsApp Top Header Bar */}
        <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md select-none shrink-0">
          {activeProfile && activeConnection ? (
            /* Active Chat Top Bar */
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={() => setActiveChatProfileId(null)}
                className="p-1 -ml-1 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                title="Back to all chats"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div
                onClick={() => onViewProfileDetails && onViewProfileDetails(activeProfile)}
                className="relative cursor-pointer group flex items-center gap-2.5 flex-1 min-w-0"
              >
                <div className="relative">
                  <img
                    src={activeProfile.photos[0]}
                    alt={activeProfile.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/60"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#075E54]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {activeProfile.name}
                    </h3>
                    {activeProfile.isVerified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-white/80 truncate">
                    {isPartnerTyping ? (
                      <span className="text-emerald-200 font-medium italic animate-pulse">
                        typing...
                      </span>
                    ) : (
                      <span>
                        online · {activeProfile.profession} ({activeProfile.city})
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Chat Actions: Audio Call & Video Call */}
              <div className="flex items-center gap-1">
                {onStartCall && (
                  <>
                    <button
                      onClick={() => onStartCall(activeProfile, 'audio')}
                      title="Voice Call"
                      className="p-2 text-white/90 hover:text-white hover:bg-white/15 rounded-full transition-all"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onStartCall(activeProfile, 'video')}
                      title="Video Call"
                      className="p-2 text-white/90 hover:text-white hover:bg-white/15 rounded-full transition-all"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                  </>
                )}
                {onViewProfileDetails && (
                  <button
                    onClick={() => onViewProfileDetails(activeProfile)}
                    title="View Full Biodata"
                    className="p-2 text-white/90 hover:text-white hover:bg-white/15 rounded-full transition-all"
                  >
                    <User className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  title="Close Chat"
                  className="p-2 text-white/90 hover:text-white hover:bg-white/15 rounded-full transition-all ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            /* WhatsApp Main Inbox Header */
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide font-serif">
                    WhatsApp Matrimony Chat
                  </h3>
                  <p className="text-[11px] text-emerald-200">
                    Direct chatting between boys &amp; girls
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('contacts');
                  }}
                  title="Start New Chat (All Boys & Girls)"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Chat</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* If no active chat is selected: show Tab Switcher and Search */}
        {!activeProfile && (
          <div className="bg-[#008069] text-white px-4 border-b border-[#056150] shrink-0">
            <div className="flex gap-6 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('chats')}
                className={`py-2.5 border-b-2 uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                  activeTab === 'chats'
                    ? 'border-white text-white'
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                <span>CHATS</span>
                {chatList.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white text-[#008069] text-[10px] font-bold flex items-center justify-center">
                    {chatList.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('contacts')}
                className={`py-2.5 border-b-2 uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                  activeTab === 'contacts'
                    ? 'border-white text-white'
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                <span>ALL MATCHES (BOYS & GIRLS)</span>
                <span className="w-4 h-4 rounded-full bg-emerald-400 text-neutral-900 text-[10px] font-bold flex items-center justify-center">
                  {profiles.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('requests')}
                className={`py-2.5 border-b-2 uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                  activeTab === 'requests'
                    ? 'border-white text-white'
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                <span>REQUESTS</span>
                {pendingRequests.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-300 text-neutral-900 text-[10px] font-bold flex items-center justify-center">
                    {pendingRequests.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto flex flex-col bg-[#F0F2F5]">
          {activeProfile && activeConnection ? (
            /* Active WhatsApp Conversation View */
            <div className="h-full flex flex-col">
              
              {/* WhatsApp Chat Wallpaper Pattern Container */}
              <div
                className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-[#EFEAE2] relative"
                style={{
                  backgroundImage: `radial-gradient(#d1c7b7 0.75px, transparent 0.75px), radial-gradient(#d1c7b7 0.75px, #EFEAE2 0.75px)`,
                  backgroundSize: `30px 30px`,
                  backgroundPosition: `0 0, 15px 15px`,
                }}
              >
                {/* Yellow WhatsApp End-to-End Encryption Banner */}
                <div className="flex justify-center my-2">
                  <div className="max-w-md bg-[#FFEECD] text-[#54656F] text-[11px] leading-relaxed px-3 py-1.5 rounded-lg shadow-xs text-center border border-[#F5D899]/60">
                    🔒 Messages and calls are end-to-end encrypted. No one outside of this chat, not even this platform, can read or listen to them.
                  </div>
                </div>

                {/* Date separator */}
                <div className="flex justify-center my-1">
                  <span className="bg-white/80 backdrop-blur-xs text-[#54656F] text-[10px] font-semibold px-2.5 py-0.5 rounded-md shadow-2xs uppercase">
                    Today
                  </span>
                </div>

                {/* Messages stream */}
                {activeConnection.messages.length === 0 ? (
                  <div className="text-center py-6 space-y-3">
                    <p className="text-xs text-[#54656F] font-medium">
                      Start your conversation with {activeProfile.name}!
                    </p>
                    <div className="space-y-2 max-w-sm mx-auto">
                      <p className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
                        Quick Matrimonial Greetings:
                      </p>
                      {icebreakers.map((ib, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendTextMessage(ib)}
                          className="w-full text-left p-2.5 bg-white hover:bg-emerald-50/70 border border-neutral-300 hover:border-emerald-500 rounded-xl text-xs text-neutral-800 transition-colors shadow-xs"
                        >
                          💬 &ldquo;{ib}&rdquo;
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  activeConnection.messages.map((m) => {
                    // Call info bubble
                    if (m.callInfo) {
                      return (
                        <div key={m.id} className="flex justify-center my-2">
                          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-neutral-700 text-xs shadow-xs border border-neutral-200">
                            {m.callInfo.type === 'video' ? (
                              <Video className="w-3.5 h-3.5 text-rose-600" />
                            ) : (
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                            <span className="font-semibold">
                              {m.callInfo.type === 'video' ? 'Video Call' : 'Voice Call'}
                            </span>
                            <span className="text-neutral-400">· {m.callInfo.duration}</span>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              ({m.timestamp})
                            </span>
                          </div>
                        </div>
                      );
                    }

                    // Voice note bubble
                    if (m.mediaType === 'audio') {
                      return (
                        <div
                          key={m.id}
                          className={`flex ${m.isSelf ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-[70%] rounded-xl p-2.5 text-xs shadow-xs ${
                              m.isSelf
                                ? 'bg-[#D9FDD3] text-neutral-900 rounded-tr-none'
                                : 'bg-white text-neutral-900 rounded-tl-none'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handlePlayVoiceNote(m.id)}
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                                  playingAudioId === m.id
                                    ? 'bg-emerald-700 text-white animate-pulse'
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                }`}
                              >
                                {playingAudioId === m.id ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4 ml-0.5" />
                                )}
                              </button>

                              <div className="flex-1 min-w-[140px]">
                                {/* Animated or static audio waveform bars */}
                                <div className="flex items-center gap-1 h-6">
                                  {[4, 12, 18, 10, 22, 14, 20, 8, 16, 12, 18, 6, 14, 10, 16, 8].map(
                                    (h, idx) => (
                                      <span
                                        key={idx}
                                        style={{ height: `${h}px` }}
                                        className={`w-1 rounded-full transition-all ${
                                          playingAudioId === m.id
                                            ? 'bg-emerald-600 animate-pulse'
                                            : 'bg-neutral-400'
                                        }`}
                                      />
                                    )
                                  )}
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono mt-0.5">
                                  <span>{m.audioDuration || '0:05'}</span>
                                  <span>Voice message</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-neutral-500">
                              <span>{m.timestamp}</span>
                              {m.isSelf && (
                                <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Image / Media attachment bubble
                    if (m.mediaType === 'image' && m.mediaUrl) {
                      return (
                        <div
                          key={m.id}
                          className={`flex ${m.isSelf ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-[70%] rounded-xl p-1.5 text-xs shadow-xs ${
                              m.isSelf
                                ? 'bg-[#D9FDD3] text-neutral-900 rounded-tr-none'
                                : 'bg-white text-neutral-900 rounded-tl-none'
                            }`}
                          >
                            <img
                              src={m.mediaUrl}
                              alt="Attachment"
                              className="w-full max-h-56 object-cover rounded-lg border border-black/10"
                            />
                            {m.caption && (
                              <p className="px-1.5 py-1 text-xs text-neutral-800 leading-snug">
                                {m.caption}
                              </p>
                            )}
                            <div className="flex items-center justify-end gap-1 px-1 text-[10px] text-neutral-500">
                              <span>{m.timestamp}</span>
                              {m.isSelf && (
                                <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Standard text message bubble
                    return (
                      <div
                        key={m.id}
                        className={`flex ${m.isSelf ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-xs relative ${
                            m.isSelf
                              ? 'bg-[#D9FDD3] text-neutral-900 rounded-tr-none'
                              : 'bg-white text-neutral-900 rounded-tl-none'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{m.text}</p>
                          <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-neutral-500 font-sans">
                            <span>{m.timestamp}</span>
                            {m.isSelf && (
                              m.status === 'sent' ? (
                                <Check className="w-3.5 h-3.5 text-neutral-400" />
                              ) : (
                                <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Partner typing visual bubble */}
                {isPartnerTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-none px-3 py-2 shadow-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Emojis & Icebreakers Drawer */}
              {showEmojiPicker && (
                <div className="p-2.5 bg-white border-t border-neutral-200 space-y-2 animate-fadeIn shadow-inner">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500 px-1">
                    <span>Quick Reactions &amp; Matrimonial Emojis</span>
                    <button
                      onClick={() => setShowEmojiPicker(false)}
                      className="text-neutral-400 hover:text-neutral-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 px-1">
                    {quickEmojis.map((emoji, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendTextMessage(emoji)}
                        className="text-lg p-1.5 hover:bg-neutral-100 rounded-lg transition-transform hover:scale-125"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <div className="pt-1 border-t border-neutral-100 flex flex-wrap gap-1.5">
                    {icebreakers.slice(0, 3).map((ib, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendTextMessage(ib)}
                        className="text-[11px] bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-800 text-neutral-700 px-2 py-1 rounded-md transition-colors"
                      >
                        💬 {ib.length > 36 ? ib.slice(0, 36) + '...' : ib}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachment Picker */}
              {showAttachmentMenu && (
                <div className="p-3 bg-white border-t border-neutral-200 animate-fadeIn shadow-inner grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleSendPhotoAttachment('photo')}
                    className="flex flex-col items-center justify-center p-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl border border-purple-200 text-xs font-semibold gap-1 transition-colors"
                  >
                    <ImageIcon className="w-5 h-5 text-purple-600" />
                    <span>Profile Photo</span>
                  </button>

                  <button
                    onClick={() => handleSendPhotoAttachment('biodata')}
                    className="flex flex-col items-center justify-center p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 text-xs font-semibold gap-1 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <span>Biodata Card</span>
                  </button>

                  <button
                    onClick={() => handleSendPhotoAttachment('kundli')}
                    className="flex flex-col items-center justify-center p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl border border-amber-200 text-xs font-semibold gap-1 transition-colors"
                  >
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <span>Astro Kundli</span>
                  </button>
                </div>
              )}

              {/* WhatsApp Chat Input Footer */}
              <div className="p-2 sm:p-3 bg-[#F0F2F5] border-t border-neutral-300 shrink-0 safe-bottom">
                {isRecording ? (
                  /* Active Recording Bar */
                  <div className="flex items-center justify-between gap-3 bg-white rounded-2xl px-3 py-2 shadow-xs border border-rose-300">
                    <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold">
                      <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                      <span>Recording Voice Note... 0:{recordingSeconds < 10 ? '0' : ''}{recordingSeconds}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsRecording(false);
                          setRecordingSeconds(0);
                        }}
                        className="px-3 py-1 text-xs text-neutral-500 hover:text-neutral-800 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSendVoiceNote}
                        className="px-3 py-1.5 bg-[#008069] hover:bg-[#075E54] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard WhatsApp Input Bar */
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setShowEmojiPicker(!showEmojiPicker);
                        setShowAttachmentMenu(false);
                      }}
                      title="Emojis & Icebreakers"
                      className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                      <Smile className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => {
                        setShowAttachmentMenu(!showAttachmentMenu);
                        setShowEmojiPicker(false);
                      }}
                      title="Attach Photo or Biodata"
                      className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                      <Paperclip className="w-5 h-5 rotate-45" />
                    </button>

                    <input
                      type="text"
                      placeholder={`Message ${activeProfile.name.split(' ')[0]}...`}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendTextMessage()}
                      className="flex-1 min-h-[44px] text-xs px-3.5 py-2.5 bg-white border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#008069] text-neutral-900 placeholder:text-neutral-400"
                    />

                    {messageInput.trim() ? (
                      <button
                        onClick={() => handleSendTextMessage()}
                        title="Send Message"
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2.5 bg-[#008069] hover:bg-[#075E54] text-white rounded-full transition-transform active:scale-95 shadow-sm"
                      >
                        <Send className="w-4 h-4 ml-0.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsRecording(true)}
                        title="Record Voice Note"
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2.5 bg-[#008069] hover:bg-[#075E54] text-white rounded-full transition-transform active:scale-95 shadow-sm"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'chats' ? (
            /* TAB 1: WhatsApp Active Conversations */
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="bg-white rounded-xl p-3 border border-neutral-200 mb-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">
                      Koi bhi ladka ladki se chat karein
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      Tap on any match below or explore all profiles to start messaging directly!
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('contacts')}
                    className="px-3 py-1.5 bg-[#008069] hover:bg-[#075E54] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
                  >
                    All Matches
                  </button>
                </div>
              </div>

              {chatList.length > 0 ? (
                chatList.map(([id, conn]) => {
                  const p = getProfile(id);
                  if (!p) return null;
                  const lastMsg = conn.messages[conn.messages.length - 1];
                  return (
                    <div
                      key={id}
                      onClick={() => handleStartChatWithProfile(p)}
                      className="flex items-center gap-3 p-3 bg-white hover:bg-neutral-100 rounded-xl border border-neutral-200 cursor-pointer transition-colors shadow-2xs"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={p.photos[0]}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover border border-neutral-200"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between">
                          <h4 className="text-xs font-bold text-neutral-900 truncate flex items-center gap-1">
                            <span>{p.name}</span>
                            {p.isVerified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                            )}
                          </h4>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {lastMsg ? lastMsg.timestamp : 'Online'}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {lastMsg ? (
                            lastMsg.isSelf ? (
                              <span className="text-neutral-700">You: {lastMsg.text}</span>
                            ) : (
                              lastMsg.text
                            )
                          ) : (
                            `${p.profession} · ${p.city}`
                          )}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5 text-[#008069]">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#E8F8F5] text-[#008069] flex items-center justify-center mx-auto">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-800">
                      No WhatsApp conversations yet
                    </h5>
                    <p className="text-[11px] text-neutral-500 max-w-xs mx-auto mt-1">
                      Start chatting with any boy or girl directly from our verified matrimony directory!
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('contacts')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#008069] hover:bg-[#075E54] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Browse All Boys &amp; Girls</span>
                  </button>
                </div>
              )}
            </div>
          ) : activeTab === 'contacts' ? (
            /* TAB 2: Directory of All Boys & Girls ("Koi bhi Ladka Ladki Chat kar sake") */
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              
              {/* Search and Filters */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by name, city, profession, religion..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008069] text-neutral-900"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filter chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <button
                    onClick={() => setGenderFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      genderFilter === 'all'
                        ? 'bg-[#008069] text-white font-semibold'
                        : 'bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    All ({profiles.length})
                  </button>

                  <button
                    onClick={() => setGenderFilter('female')}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      genderFilter === 'female'
                        ? 'bg-rose-600 text-white font-semibold'
                        : 'bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    👩 Ladkiyan / Brides ({profiles.filter((p) => p.gender === 'female').length})
                  </button>

                  <button
                    onClick={() => setGenderFilter('male')}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      genderFilter === 'male'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    👨 Ladke / Grooms ({profiles.filter((p) => p.gender === 'male').length})
                  </button>
                </div>
              </div>

              {/* Contacts List */}
              <div className="space-y-2">
                {directoryProfiles.length > 0 ? (
                  directoryProfiles.map((p) => {
                    const existingConn = connections[p.id];
                    const hasMessages = existingConn && existingConn.messages.length > 0;

                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-neutral-200 hover:border-emerald-400 hover:shadow-xs transition-all"
                      >
                        <div
                          onClick={() => handleStartChatWithProfile(p)}
                          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                        >
                          <div className="relative shrink-0">
                            <img
                              src={p.photos[0]}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-full object-cover border border-neutral-200"
                            />
                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-white" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-neutral-900 truncate">
                                {p.name}
                              </h4>
                              {p.isVerified && (
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              )}
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-neutral-100 text-neutral-600">
                                {p.age} yrs
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                              {p.profession} · {p.city}
                            </p>
                            <p className="text-[10px] text-amber-700 font-mono">
                              ⭐ {p.kundli.gunaScore}/36 Gunas · {p.kundli.manglik}
                            </p>
                          </div>
                        </div>

                        {/* Action: WhatsApp Chat Button */}
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <button
                            onClick={() => handleStartChatWithProfile(p)}
                            className="flex items-center gap-1 px-3 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
                            title={`Start WhatsApp chat with ${p.name}`}
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{hasMessages ? 'Continue Chat' : 'Chat Now'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-xs text-neutral-500">
                    No matching profiles found. Try a different search query!
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* TAB 3: Requests & Connects Sent */
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {pendingRequests.length > 0 ? (
                pendingRequests.map(([id, conn]) => {
                  const p = getProfile(id);
                  if (!p) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-neutral-200"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.photos[0]}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-neutral-900">{p.name}</h4>
                          <p className="text-[11px] text-neutral-500">
                            {p.age} yrs · {p.profession} · {p.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStartChatWithProfile(p)}
                          className="px-3 py-1.5 bg-[#008069] hover:bg-[#075E54] text-white text-xs font-semibold rounded-lg shadow-xs"
                        >
                          Chat on WhatsApp
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-16 text-center space-y-2">
                  <Heart className="w-8 h-8 text-neutral-300 mx-auto" />
                  <p className="text-xs font-semibold text-neutral-700 font-serif">
                    No Pending Requests
                  </p>
                  <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">
                    You can start a chat directly with any boy or girl using the &ldquo;All Matches&rdquo; tab!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
