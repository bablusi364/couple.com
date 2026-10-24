import React, { useState, useEffect } from 'react';
import { X, Video, Users, Clock, Heart, SkipForward, Mic, MicOff, VideoOff, Sparkles, AlertCircle } from 'lucide-react';
import { LIVE_SESSIONS } from '../data/mockProfiles';
import { LiveSession, Profile } from '../types/matrimony';

interface CoupleLiveModalProps {
  onClose: () => void;
  onConnect: (profile: Profile) => void;
  availableProfiles: Profile[];
}

export const CoupleLiveModal: React.FC<CoupleLiveModalProps> = ({
  onClose,
  onConnect,
  availableProfiles,
}) => {
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(LIVE_SESSIONS[0]);
  const [inActiveCall, setInActiveCall] = useState(false);
  const [callTimer, setCallTimer] = useState(300); // 5 minutes (300s)
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [connectedMutual, setConnectedMutual] = useState(false);

  const currentMatch = availableProfiles[currentMatchIndex % availableProfiles.length];

  // Timer countdown simulation
  useEffect(() => {
    let timer: any;
    if (inActiveCall && callTimer > 0) {
      timer = setInterval(() => {
        setCallTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [inActiveCall, callTimer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleNextMatch = () => {
    setCurrentMatchIndex((prev) => prev + 1);
    setCallTimer(300);
    setConnectedMutual(false);
  };

  const handleMutualConnect = () => {
    if (currentMatch) {
      onConnect(currentMatch);
      setConnectedMutual(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-neutral-900 text-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden border border-neutral-700 h-[92vh] sm:h-auto sm:max-h-[85vh] flex flex-col my-0 sm:my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-neutral-800 bg-neutral-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-sm sm:text-base font-bold text-white font-serif tracking-tight">
              Couple Live · Speed Meetrooms
            </h3>
            <span className="hidden sm:inline text-[11px] font-medium text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-md">
              Powered by couple.com
            </span>
          </div>

          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body */}
        {!inActiveCall ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
              <h4 className="text-base sm:text-lg font-bold font-serif text-white">Join a Curated Matrimonial Mixer</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Meet verified eligible partners in rapid 5-minute 1-on-1 video conversations. Exchange instant mutual interest if the sparks fly!
              </p>
            </div>

            {/* Sessions List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LIVE_SESSIONS.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedSession?.id === session.id
                      ? 'border-rose-500 bg-rose-950/20'
                      : 'border-neutral-800 bg-neutral-850 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                      {session.category}
                    </span>
                    {session.status === 'live' ? (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800">
                        ● LIVE NOW
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.startTime}
                      </span>
                    )}
                  </div>

                  <h5 className="text-sm font-bold text-white mt-2">{session.title}</h5>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{session.description}</p>

                  <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                    <span className="flex items-center gap-1 font-mono tabular-nums">
                      <Users className="w-3.5 h-3.5 text-neutral-500" />
                      {session.participantsCount} Verified Singles Joined
                    </span>
                    <span className="text-[11px] text-neutral-500">{session.host}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Safety & Etiquette box */}
            <div className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700/60 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-300 space-y-1">
                <p className="font-semibold text-white">Safe & Respectful Matrimonial Speed Meet Environment</p>
                <p>
                  All participants in Couple Live are 100% government ID verified. Zero tolerance for abusive language or recording. Report option available 24/7.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setInActiveCall(true);
                  setCallTimer(300);
                }}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg shadow-lg flex items-center gap-2 transition-colors"
              >
                <Video className="w-4 h-4" />
                <span>Enter Live Speed Mixer Room</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-white">5-Minute Speed Round</span>
                <span className="text-neutral-500 hidden sm:inline">·</span>
                <span className="text-neutral-400 hidden sm:inline">Match #{currentMatchIndex + 1} of 10</span>
              </div>

              <div className="flex items-center gap-1 font-mono text-sm sm:text-base font-bold text-amber-400 bg-neutral-900 px-3 py-1 rounded-md border border-neutral-800">
                <Clock className="w-4 h-4" />
                <span>{formatTimer(callTimer)}</span>
              </div>
            </div>

            {/* Video Screens Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Remote Match Screen */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                <img
                  src={currentMatch?.photos[0]}
                  alt={currentMatch?.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-baseline justify-between">
                    <h5 className="font-bold text-sm sm:text-base font-serif">{currentMatch?.name}</h5>
                    <span className="text-xs text-neutral-300">{currentMatch?.age} yrs</span>
                  </div>
                  <p className="text-xs text-neutral-300 truncate">
                    {currentMatch?.profession} · {currentMatch?.city}
                  </p>
                  <p className="text-[11px] text-amber-300 font-mono mt-0.5">
                    {currentMatch?.kundli.gunaScore}/36 Gunas ({currentMatch?.kundli.manglik})
                  </p>
                </div>
              </div>

              {/* Self Camera Simulation */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700 flex flex-col justify-between p-3.5 sm:p-4">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-semibold text-white">You (Aarav Patel, 28)</span>
                  <span className="bg-neutral-900/80 px-2 py-0.5 rounded text-[10px] text-emerald-400">HD Ready</span>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-xs text-neutral-300 font-medium">Your Camera Preview</p>
                  <p className="text-[11px] text-neutral-500">
                    {isVideoOff ? 'Video Muted' : 'Looking sharp & camera framed well!'}
                  </p>
                </div>

                {/* Suggested Icebreaker Prompts */}
                <div className="bg-neutral-900/90 p-2.5 sm:p-3 rounded-lg border border-neutral-700 text-xs">
                  <p className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Conversation Icebreaker
                  </p>
                  <p className="text-neutral-200 mt-1 italic text-[11px] sm:text-xs line-clamp-2">
                    &ldquo;What is your favorite travel memory or family weekend tradition?&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* In-Call Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`min-h-[44px] min-w-[44px] flex items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-colors ${
                    isMuted ? 'bg-red-900/60 border-red-700 text-red-200' : 'bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700'
                  }`}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`min-h-[44px] min-w-[44px] flex items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-colors ${
                    isVideoOff ? 'bg-red-900/60 border-red-700 text-red-200' : 'bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700'
                  }`}
                >
                  {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                </button>
              </div>

              {/* Express Interest / Pass */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handleNextMatch}
                  className="min-h-[44px] px-3.5 sm:px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>Next</span>
                </button>

                {connectedMutual ? (
                  <span className="min-h-[44px] px-4 sm:px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-current" />
                    <span>Sent!</span>
                  </span>
                ) : (
                  <button
                    onClick={handleMutualConnect}
                    className="min-h-[44px] px-4 sm:px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <Heart className="w-4 h-4" />
                    <span>Send Connect</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setInActiveCall(false)}
                className="min-h-[44px] px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-400 hover:text-white rounded-xl border border-neutral-700 flex items-center justify-center"
              >
                Exit
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
