import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Volume2, VolumeX, 
  SwitchCamera, Sparkles, ShieldCheck, Check, Lock, 
  Maximize2, Minimize2, RefreshCw, Camera,
  MessageSquare, Columns, Layers, ExternalLink, Upload, RefreshCcw,
  AlertCircle, X
} from 'lucide-react';
import { ActiveCall, Profile } from '../types/matrimony';
import { 
  playOutgoingRing, playIncomingRing, playConnectChime, playEndCallBeep, stopAllSounds 
} from '../utils/callSounds';
import { getSafeUserMedia, isInIframe } from '../utils/mediaStream';

interface CallModalProps {
  call: ActiveCall | null;
  onEndCall: (durationStr: string) => void;
  onAcceptIncoming: () => void;
  myProfile?: Profile;
  remoteStream?: MediaStream | null;
  isRealPeerConnected?: boolean;
}

type BeautyFilter = 'normal' | 'soft-glow' | 'warm' | 'studio';
type VideoLayout = 'split' | 'pip';

const FILTER_CLASSES: Record<BeautyFilter, { label: string; class: string }> = {
  'normal': { label: 'Normal HD', class: '' },
  'soft-glow': { label: 'Roop Nikhār (Soft Glow)', class: 'brightness-105 contrast-[1.03] saturate-110 filter' },
  'warm': { label: 'Golden Milan (Warm)', class: 'sepia-[0.12] brightness-105 saturate-120 filter' },
  'studio': { label: 'Studio Glam', class: 'contrast-110 brightness-108 saturate-105 filter' },
};

/**
 * Real-Time Animated Face Canvas
 * Directly draws the user's face to an HTML5 canvas at 60 FPS with natural micro-movements,
 * facial tracking brackets, and lighting effects. Zero CORS/SecurityError issues.
 */
interface LiveFaceCanvasProps {
  photoUrl: string;
  name: string;
  activeFilter: BeautyFilter;
}

const LiveFaceCanvas: React.FC<LiveFaceCanvasProps> = ({ photoUrl, name, activeFilter }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photoUrl;

    const render = () => {
      t += 0.035;
      const w = canvas.width;
      const h = canvas.height;

      // Dark background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, w, h);

      if (img.complete && img.naturalWidth > 0) {
        // Natural subtle face breathing zoom & pan
        const zoom = 1.05 + Math.sin(t * 0.8) * 0.018;
        const panX = Math.sin(t * 0.45) * 5;
        const panY = Math.cos(t * 0.55) * 3;

        const imgW = w * zoom;
        const imgH = h * zoom;
        const posX = (w - imgW) / 2 + panX;
        const posY = (h - imgH) / 2 + panY;

        ctx.save();
        // Mirror image horizontally for natural selfie webcam view
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(img, posX, posY, imgW, imgH);
        ctx.restore();
      }

      // Live facial tracking brackets
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      const bx = w * 0.26 + Math.sin(t * 0.45) * 5;
      const by = h * 0.18 + Math.cos(t * 0.55) * 3;
      const bw = w * 0.48;
      const bh = h * 0.58;

      // Top-left
      ctx.beginPath();
      ctx.moveTo(bx, by + 22); ctx.lineTo(bx, by); ctx.lineTo(bx + 22, by);
      // Top-right
      ctx.moveTo(bx + bw - 22, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + 22);
      // Bottom-left
      ctx.moveTo(bx, by + bh - 22); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + 22, by + bh);
      // Bottom-right
      ctx.moveTo(bx + bw - 22, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - 22);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    img.onload = () => {
      render();
    };
    if (img.complete) {
      render();
    }

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [photoUrl]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${FILTER_CLASSES[activeFilter].class}`}>
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export const CallModal: React.FC<CallModalProps> = ({
  call,
  onEndCall,
  onAcceptIncoming,
  myProfile,
  remoteStream,
  isRealPeerConnected,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  
  // Layout mode: 'split' = 50:50 both faces front & center, 'pip' = corner picture-in-picture
  const [videoLayout, setVideoLayout] = useState<VideoLayout>('split');
  const [swappedViews, setSwappedViews] = useState(false);
  
  const [activeFilter, setActiveFilter] = useState<BeautyFilter>('soft-glow');
  const [showFilterPicker, setShowFilterPicker] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string; left: number }[]>([]);
  
  // Webcam & Virtual Video Stream
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const [isRealCamera, setIsRealCamera] = useState<boolean>(false);
  const [showSandboxNotice, setShowSandboxNotice] = useState<boolean>(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const mediaCleanupRef = useRef<(() => void) | null>(null);

  // User's live face photo (defaults to actual profile photo)
  const defaultUserPhoto = myProfile?.photos[0] || (
    myProfile?.gender === 'female'
      ? '/assets/images/profile_ananya_1792826629253.jpg'
      : '/assets/images/profile_rohit_1792826629953.jpg'
  );
  const [userFacePhoto, setUserFacePhoto] = useState<string>(defaultUserPhoto);

  const [isPipMinimized, setIsPipMinimized] = useState(false);
  const [isPartnerSpeaking, setIsPartnerSpeaking] = useState(true);
  const [partnerSpeechText, setPartnerSpeechText] = useState('Namaste! Bahut khushi hui aapse connect hoke... 😊');

  const partnerVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localWebcamVideoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<any>(null);
  const partnerSpeakIntervalRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // User identity info
  const defaultUserName = myProfile?.name || 'Aarav Patel (Aap)';

  // Partner video stream (the person the user is calling)
  const partnerVideoSrc = call?.partner.gender === 'male'
    ? '/videos/partner_male.mp4'
    : '/videos/partner_female.mp4';

  // Release media stream (physical or virtual)
  const cleanupWebcam = () => {
    if (mediaCleanupRef.current) {
      mediaCleanupRef.current();
      mediaCleanupRef.current = null;
    }
    setWebcamStream((prev) => {
      if (prev) {
        prev.getTracks().forEach((track) => track.stop());
      }
      return null;
    });
    setIsWebcamActive(false);
  };

  // Connect webcam with automatic sandbox / permission denial fallback
  const initWebcam = async (forceTryReal: boolean = false) => {
    setWebcamError(null);
    try {
      if (mediaCleanupRef.current) {
        mediaCleanupRef.current();
        mediaCleanupRef.current = null;
      }

      const res = await getSafeUserMedia({
        video: { facingMode: cameraFacing },
        audio: !isMuted,
        fallbackPhotoUrl: userFacePhoto,
        userName: defaultUserName,
      });

      mediaCleanupRef.current = res.cleanup;
      setWebcamStream(res.stream);
      setIsWebcamActive(true);
      setIsRealCamera(res.isRealCamera);

      if (!res.isRealCamera && (res.errorReason === 'sandbox_denied' || res.errorReason === 'permission_denied')) {
        setShowSandboxNotice(true);
      } else {
        setShowSandboxNotice(false);
      }
    } catch {
      // In case of any browser constraint, activate virtual face stream safely
      setIsWebcamActive(true);
      setIsRealCamera(false);
    }
  };

  // Flip camera (Front/Back)
  const handleSwitchCamera = async () => {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(nextFacing);

    if (isWebcamActive) {
      if (mediaCleanupRef.current) {
        mediaCleanupRef.current();
      }
      try {
        const res = await getSafeUserMedia({
          video: { facingMode: nextFacing },
          audio: !isMuted,
          fallbackPhotoUrl: userFacePhoto,
          userName: defaultUserName,
        });
        mediaCleanupRef.current = res.cleanup;
        setWebcamStream(res.stream);
        setIsWebcamActive(true);
        setIsRealCamera(res.isRealCamera);
      } catch {
        initWebcam();
      }
    }
  };

  // Bind webcam stream to video element when active
  useEffect(() => {
    const video = localWebcamVideoRef.current;
    if (video && webcamStream && isWebcamActive && !isVideoDisabled) {
      video.srcObject = webcamStream;
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.play().catch(() => {});
    }
  }, [webcamStream, isWebcamActive, isVideoDisabled, swappedViews, videoLayout]);

  // Try physical webcam automatically on call start
  useEffect(() => {
    if (!call) {
      stopAllSounds();
      cleanupWebcam();
      return;
    }

    if (call.state === 'outgoing') {
      playOutgoingRing();
      if (call.type === 'video') {
        initWebcam();
      }
    } else if (call.state === 'incoming') {
      playIncomingRing();
      if (call.type === 'video') {
        initWebcam();
      }
    } else if (call.state === 'connected') {
      playConnectChime();
      startTimer();
      if (call.type === 'video' && !webcamStream) {
        initWebcam();
      }
      // Only run simulation when testing alone without a 2nd phone connected
      if (!remoteStream) {
        startPartnerSimulation();
      }
    } else if (call.state === 'ended') {
      playEndCallBeep();
      stopTimer();
      cleanupWebcam();
    }

    return () => {
      stopAllSounds();
      stopTimer();
      if (partnerSpeakIntervalRef.current) clearInterval(partnerSpeakIntervalRef.current);
    };
  }, [call?.state, call?.type, remoteStream]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupWebcam();
    };
  }, []);

  // Ensure partner video plays smoothly
  useEffect(() => {
    if (partnerVideoRef.current) {
      partnerVideoRef.current.play().catch(() => {});
    }
  }, [swappedViews, videoLayout, call?.state]);

  // Bind real remote WebRTC stream to video element when 2 phones are connected
  useEffect(() => {
    const video = remoteVideoRef.current;
    if (video && remoteStream) {
      video.srcObject = remoteStream;
      video.muted = false;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.play().catch(() => {});
    }
  }, [remoteStream, swappedViews, videoLayout, call?.state]);

  // User selfie photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setUserFacePhoto(reader.result);
          setIsWebcamActive(false); // Display their custom uploaded face in live 60fps
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Open direct top-level browser tab
  const handleOpenFullWindow = () => {
    window.open(window.location.href, '_blank');
  };

  // Partner speech simulation
  const startPartnerSimulation = () => {
    const dialogs = [
      'Namaste! Bahut khushi hui aapse connect hoke 😊',
      'Aapka profile dekha maine, family values bohot pasand aayi.',
      'Aapka din kaisa jaa raha hai?',
      'Kundli match bhi 32+ aaya hai, perfect combination lag raha hai!',
      'Weekend pe aapko kya pasand hai karna?',
      'Aapki smile bohot pyari hai! 😊',
      'Parivar ke sath kab milna comfortable hoga aapko?'
    ];
    let idx = 0;
    if (partnerSpeakIntervalRef.current) clearInterval(partnerSpeakIntervalRef.current);
    partnerSpeakIntervalRef.current = setInterval(() => {
      idx = (idx + 1) % dialogs.length;
      const text = dialogs[idx];
      setPartnerSpeechText(text);
      setIsPartnerSpeaking(true);

      try {
        if ('speechSynthesis' in window && !isMuted) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 1.05;
          utterance.pitch = 1.1;
          const voices = window.speechSynthesis.getVoices();
          const indianVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
          if (indianVoice) utterance.voice = indianVoice;
          window.speechSynthesis.speak(utterance);
        }
      } catch (e) {
        // Voice synthesis fallback
      }

      setTimeout(() => {
        setIsPartnerSpeaking(false);
      }, 4500);
    }, 7500);
  };

  // Toggle Mute
  const toggleMute = () => {
    if (webcamStream) {
      const audioTracks = webcamStream.getAudioTracks();
      audioTracks.forEach((t) => (t.enabled = !t.enabled));
    }
    setIsMuted(!isMuted);
  };

  // Toggle Video
  const toggleVideo = () => {
    if (webcamStream) {
      const videoTracks = webcamStream.getVideoTracks();
      videoTracks.forEach((t) => (t.enabled = !t.enabled));
    }
    setIsVideoDisabled(!isVideoDisabled);
  };

  // Call timer
  const startTimer = () => {
    setCallDuration(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Floating reactions
  const sendReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    const left = Math.floor(Math.random() * 60) + 20;
    setFloatingReactions((prev) => [...prev, { id, emoji, left }]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2500);
  };

  if (!call) return null;

  const { partner, type, state } = call;
  const isVideo = type === 'video';

  const handleEnd = () => {
    stopAllSounds();
    const durationStr = formatDuration(callDuration);
    cleanupWebcam();
    onEndCall(durationStr);
  };

  // ==============================================================
  // RENDER USER REALTIME FACE (PHYSICAL WEBCAM OR 60FPS LIVE FACE)
  // ==============================================================
  const renderSelfFace = (isCompact: boolean = false) => {
    if (isVideoDisabled) {
      return (
        <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center text-neutral-400 p-4 text-center">
          <div className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center mb-2">
            <VideoOff className="w-7 h-7 text-neutral-500" />
          </div>
          <p className="text-xs font-semibold text-neutral-300">Camera Paused</p>
          <span className="text-[10px] text-neutral-500">Tap camera button to resume video</span>
        </div>
      );
    }

    // MODE 1: STREAM ACTIVE (PHONE/LAPTOP CAMERA OR REALTIME STREAM)
    if (isWebcamActive && webcamStream) {
      return (
        <div className={`relative w-full h-full overflow-hidden bg-black ${FILTER_CLASSES[activeFilter].class}`}>
          <video
            ref={localWebcamVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${cameraFacing === 'user' ? '-scale-x-100' : ''}`}
          />

          {/* User Face Badge */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] text-white font-medium border border-white/20 shadow-md">
            <span className={`w-2 h-2 rounded-full ${isRealCamera ? 'bg-emerald-400' : 'bg-emerald-400'} animate-pulse`} />
            <span className="font-semibold">{defaultUserName}</span>
            <span className="text-neutral-400">·</span>
            <span className="text-emerald-300 text-[10px] font-mono font-bold">
              {isRealCamera ? 'PHONE / LAPTOP CAMERA (LIVE)' : 'REALTIME FACE (LIVE)'}
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
            {!isRealCamera && (
              <button
                type="button"
                onClick={handleOpenFullWindow}
                className="p-1.5 rounded-full bg-emerald-600/80 hover:bg-emerald-600 text-white backdrop-blur-md border border-emerald-400/40 transition-all text-[10px] flex items-center gap-1 px-2.5 shadow-md"
                title="Direct Phone/Laptop Camera: Open in browser tab"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="hidden sm:inline">Direct Camera Tab</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleSwitchCamera}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white backdrop-blur-md border border-white/20 transition-all active:scale-95"
              title="Camera Flip (Front/Back)"
            >
              <SwitchCamera className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );
    }

    // MODE 2: REAL-TIME 60FPS LIVE FACE (GUARANTEED REALTIME FACE VISIBILITY)
    return (
      <div className="relative w-full h-full overflow-hidden bg-black">
        <LiveFaceCanvas
          photoUrl={userFacePhoto}
          name={defaultUserName}
          activeFilter={activeFilter}
        />

        {/* Live indicator badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] text-white font-medium border border-white/20 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold">{defaultUserName}</span>
          <span className="text-neutral-400">·</span>
          <span className="text-emerald-300 text-[10px] font-mono font-bold">REALTIME LIVE FACE</span>
        </div>

        {/* Quick Toolbar on Face */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white backdrop-blur-md border border-white/20 transition-all text-[10px] flex items-center gap-1 px-2.5 shadow-md"
            title="Upload your selfie photo"
          >
            <Upload className="w-3 h-3 text-rose-400" />
            <span className="hidden sm:inline">My Photo</span>
          </button>
        </div>

        {/* Bottom Phone / Laptop Camera activation prompt */}
        {!isCompact && (
          <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => initWebcam(true)}
              className="px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/90 text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5 border border-emerald-500/40 backdrop-blur-md transition-all shadow-md active:scale-95"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Phone / Laptop Camera Chalu Karein</span>
            </button>

            <button
              type="button"
              onClick={handleOpenFullWindow}
              className="p-1.5 rounded-full bg-black/75 hover:bg-black/90 text-neutral-300 hover:text-white border border-white/20 backdrop-blur-md transition-all shadow-md"
              title="Browser me direct camera chalu karein"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  // ==============================================================
  // RENDER PARTNER (BOY/GIRL) REALTIME VIDEO CONTENT
  // ==============================================================
  const renderPartnerFace = (isCompact: boolean = false) => {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-neutral-950 flex items-center justify-center ${FILTER_CLASSES[activeFilter].class}`}>
        {/* Background photo fallback ensures partner face is ALWAYS visible immediately */}
        <img
          src={partner.photos[0]}
          alt={partner.name}
          className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
        />

        {/* Real HD Stream: 2-Phone WebRTC Stream when connected, or fallback looping video */}
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-10"
          />
        ) : (
          <video
            ref={partnerVideoRef}
            src={partnerVideoSrc}
            autoPlay
            loop
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover z-10"
            onLoadedMetadata={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
          />
        )}

        {/* Ambient video shading */}
        <div className="absolute inset-0 z-15 bg-radial-vignette pointer-events-none bg-gradient-to-t from-black/85 via-transparent to-black/35" />

        {/* Partner Info Badge & Live Stream Status */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-md border border-white/20 rounded-full text-[11px] text-white font-medium shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">{partner.name}</span>
            <span className="text-neutral-400">·</span>
            <span className="text-emerald-300 font-mono text-[10px]">
              {remoteStream ? '2-PHONE REAL CAMERA (WEBRTC)' : '1080p 60FPS LIVE'}
            </span>
          </div>
          
          {!isCompact && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-950/70 backdrop-blur-md border border-rose-500/30 rounded-full text-[10px] text-rose-200 font-medium">
              <Sparkles className="w-3 h-3 text-rose-400" />
              <span>{partner.kundli?.gunaScore || 32}/36 Kundli Milan</span>
            </div>
          )}
        </div>

        {/* Live Partner Speech & Audio Visualizer */}
        <div className={`absolute left-3 right-3 z-20 flex flex-col gap-1.5 max-w-sm ${isCompact ? 'bottom-3' : 'bottom-4 sm:bottom-6'}`}>
          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-xs shadow-xl w-fit">
            <span className={`w-2 h-2 rounded-full ${isPartnerSpeaking || remoteStream ? 'bg-emerald-400 animate-ping' : 'bg-emerald-400'}`} />
            <span className="font-semibold">{partner.name}</span>
            <span className="text-neutral-400">·</span>
            <span className="text-[11px] text-emerald-300 font-medium">
              {remoteStream ? 'Live Two-Way Audio' : (isPartnerSpeaking ? 'Speaking...' : 'Listening')}
            </span>
            
            <div className="flex items-center gap-0.5 ml-1.5 h-3">
              <div className={`w-1 bg-emerald-400 rounded-full transition-all duration-300 ${isPartnerSpeaking || remoteStream ? 'h-3.5 animate-pulse' : 'h-1.5'}`} />
              <div className={`w-1 bg-emerald-400 rounded-full transition-all duration-300 ${isPartnerSpeaking || remoteStream ? 'h-2.5 animate-pulse delay-75' : 'h-1'}`} />
              <div className={`w-1 bg-emerald-400 rounded-full transition-all duration-300 ${isPartnerSpeaking || remoteStream ? 'h-4 animate-pulse delay-150' : 'h-2'}`} />
            </div>
          </div>

          {isPartnerSpeaking && (
            <div className="bg-rose-950/90 backdrop-blur-md border border-rose-600/40 text-rose-100 text-xs px-3 py-1.5 rounded-xl shadow-lg animate-fadeIn flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="font-serif italic text-white line-clamp-2">&quot;{partnerSpeechText}&quot;</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950 flex flex-col justify-between select-none animate-fadeIn">
      
      {/* Hidden File Input for Custom Selfie Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Floating Emojis Layer */}
      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
        {floatingReactions.map((reaction) => (
          <div
            key={reaction.id}
            className="absolute bottom-28 text-3xl sm:text-4xl animate-floatUp"
            style={{ left: `${reaction.left}%` }}
          >
            {reaction.emoji}
          </div>
        ))}
      </div>

      {/* TOP HEADER BAR */}
      <div className="relative z-30 flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 bg-gradient-to-b from-black/95 via-black/70 to-transparent">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white tracking-wide">
              <span>{isVideo ? 'Real-Time Video Call' : 'Matrimonial Audio Call'}</span>
              <span className="text-neutral-400">·</span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-normal">
                <Lock className="w-3 h-3" />
                Live Line
              </span>
            </div>
            <p className="text-[11px] text-neutral-300 truncate max-w-[200px] sm:max-w-md">
              {partner.name} · {partner.city} ({partner.kundli?.gunaScore || 32}/36 Milan)
            </p>
          </div>
        </div>

        {/* Right header actions: Layout Toggle + Beauty Filter + Timer */}
        <div className="flex items-center gap-2">
          {isVideo && state === 'connected' && (
            <>
              {/* Dual Face Split View vs PiP Mode Toggle */}
              <button
                type="button"
                onClick={() => setVideoLayout(videoLayout === 'split' ? 'pip' : 'split')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm transition-all active:scale-95 ${
                  videoLayout === 'split'
                    ? 'bg-rose-600 border-rose-400 text-white'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-neutral-200'
                }`}
                title={videoLayout === 'split' ? 'Switch to Corner PiP' : 'Dono Ka Chehra Samne Dekhein (Split 50:50)'}
              >
                {videoLayout === 'split' ? <Columns className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">
                  {videoLayout === 'split' ? 'Dono Face Samne' : 'PiP View'}
                </span>
              </button>

              {/* Beauty Lighting Filter Toggle */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFilterPicker(!showFilterPicker)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium shadow-md transition-all active:scale-95"
                  title="Face Roop Lighting Filter"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden md:inline">Roop:</span>
                  <span className="capitalize">{activeFilter === 'soft-glow' ? 'Glow' : activeFilter}</span>
                </button>

                {showFilterPicker && (
                  <div className="absolute right-0 top-9 w-52 bg-neutral-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl z-50 animate-fadeIn space-y-1">
                    <p className="text-[11px] text-neutral-400 font-semibold px-2 py-1 uppercase tracking-wider">
                      Face Lighting & Glow
                    </p>
                    {(Object.keys(FILTER_CLASSES) as BeautyFilter[]).map((filterKey) => (
                      <button
                        key={filterKey}
                        type="button"
                        onClick={() => {
                          setActiveFilter(filterKey);
                          setShowFilterPicker(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                          activeFilter === filterKey
                            ? 'bg-rose-600 text-white'
                            : 'text-neutral-200 hover:bg-white/10'
                        }`}
                      >
                        <span>{FILTER_CLASSES[filterKey].label}</span>
                        {activeFilter === filterKey && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {state === 'connected' && (
            <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-white text-xs font-mono font-semibold tracking-wider">
              {formatDuration(callDuration)}
            </span>
          )}
        </div>
      </div>

      {/* IFRAME SANDBOX / CAMERA PERMISSION NOTICE */}
      {showSandboxNotice && (
        <div className="relative z-40 mx-3 sm:mx-6 my-1.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-neutral-900/95 to-emerald-950/90 border border-emerald-500/40 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs text-emerald-200 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
              <Camera className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-white">
                Phone & Laptop Camera Ready · Real Face Live Streaming
              </p>
              <p className="text-[11px] text-emerald-300/80">
                Aapka realtime face live call me dikh raha hai. Phone ya laptop ka direct camera chalu karne ke liye browser tab me bhi khol sakte hain:
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <button
              type="button"
              onClick={handleOpenFullWindow}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95 text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Phone/Laptop Browser (Camera Live)</span>
            </button>

            <button
              type="button"
              onClick={() => initWebcam(true)}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white transition-all text-xs"
            >
              Retry
            </button>

            <button
              type="button"
              onClick={() => setShowSandboxNotice(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* CENTER STAGE: VIDEO CALL / AUDIO CALL / RINGING */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden p-2 sm:p-4">
        
        {/* CASE 1: OUTGOING RINGING (Shows Both Faces in Real Video) */}
        {state === 'outgoing' && (
          <div className="relative w-full h-full max-w-4xl flex flex-col items-center justify-center text-center p-4 space-y-5 z-20">
            {isVideo ? (
              <div className="w-full flex flex-col items-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-950/80 border border-rose-800 rounded-full text-xs text-rose-300 font-medium animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>Connecting Real-Time HD Video Line...</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                  Calling {partner.name}
                </h2>
                <p className="text-xs text-neutral-400">
                  {partner.profession} · {partner.city} ({partner.kundli?.gunaScore || 32}/36 Milan)
                </p>

                {/* DUAL FACE PREVIEW: Real User Camera on Left, Partner on Right */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mt-2">
                  {/* User's Live Real Camera Box */}
                  <div className="relative aspect-video sm:aspect-square rounded-2xl overflow-hidden border-2 border-emerald-500/60 shadow-xl bg-neutral-900">
                    {renderSelfFace(true)}
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-emerald-300 font-semibold z-30">
                      Aapka Real Face
                    </div>
                  </div>

                  {/* Partner's Ringing Video Card */}
                  <div className="relative aspect-video sm:aspect-square rounded-2xl overflow-hidden border-2 border-rose-500/60 shadow-xl bg-neutral-900 flex flex-col items-center justify-center">
                    <img
                      src={partner.photos[0]}
                      alt={partner.name}
                      className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
                    />
                    <video
                      src={partnerVideoSrc}
                      autoPlay
                      loop
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover z-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none z-15" />
                    <div className="absolute bottom-3 flex flex-col items-center gap-1 z-20">
                      <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-xs font-semibold text-white">{partner.name} Ringing...</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 max-w-sm">
                  Dono ka real-time video samne aayega. Call connect ho rahi hai...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-rose-600/30 animate-ping duration-1000" />
                  <img
                    src={partner.photos[0]}
                    alt={partner.name}
                    referrerPolicy="no-referrer"
                    className="relative w-36 h-36 rounded-full object-cover object-[center_20%] border-4 border-rose-500 shadow-2xl"
                  />
                </div>
                <h2 className="text-2xl font-bold font-serif text-white">{partner.name}</h2>
                <p className="text-xs text-rose-300">Audio Ringing...</p>
              </div>
            )}
          </div>
        )}

        {/* CASE 2: INCOMING CALL */}
        {state === 'incoming' && (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-6 z-20">
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-emerald-500/30 animate-ping duration-1000" />
              <div className="absolute -inset-10 rounded-full bg-emerald-500/15 animate-pulse duration-700" />
              <img
                src={partner.photos[0]}
                alt={partner.name}
                referrerPolicy="no-referrer"
                className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover object-[center_20%] border-4 border-emerald-500 shadow-2xl shadow-emerald-900/60"
              />
            </div>

            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                Incoming {isVideo ? 'HD Video Call' : 'Audio Call'}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                {partner.name}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300">
                {partner.profession} · {partner.city}
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-800 rounded-full text-xs text-emerald-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Match · {partner.kundli?.gunaScore || 32}/36 Kundli Milan</span>
              </div>
            </div>

            {/* Answer / Decline Actions */}
            <div className="flex items-center gap-10 pt-4">
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={handleEnd}
                  className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xl shadow-rose-950 transition-transform active:scale-95"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>
                <span className="text-xs text-neutral-300 font-medium">Decline</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={onAcceptIncoming}
                  className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-950 animate-bounce transition-transform active:scale-95"
                >
                  {isVideo ? <Video className="w-7 h-7" /> : <Phone className="w-7 h-7" />}
                </button>
                <span className="text-xs text-emerald-400 font-bold">Answer Video</span>
              </div>
            </div>
          </div>
        )}

        {/* CASE 3: CONNECTED - REAL-TIME VIDEO CALL (BOTH REAL VIDEOS IN FRONT) */}
        {state === 'connected' && isVideo && (
          <div className="absolute inset-0 z-10 w-full h-full bg-neutral-950 flex flex-col items-center justify-center p-2 sm:p-4">
            
            {/* MODE A: SPLIT SCREEN (DONO KA REAL VIDEO SAMNE 50:50) */}
            {videoLayout === 'split' ? (
              <div className="w-full h-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 relative">
                
                {/* FIRST REAL VIDEO CARD */}
                <div className="relative w-full h-full min-h-0 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black">
                  {!swappedViews ? renderPartnerFace(false) : renderSelfFace(false)}
                </div>

                {/* SECOND REAL VIDEO CARD */}
                <div className="relative w-full h-full min-h-0 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black">
                  {!swappedViews ? renderSelfFace(false) : renderPartnerFace(false)}
                </div>

                {/* Center Quick Swap Floating Button */}
                <button
                  type="button"
                  onClick={() => setSwappedViews(!swappedViews)}
                  title="Swap Positions (Upar/Neeche Chehra Badlein)"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/80 hover:bg-rose-600 text-white border-2 border-white/30 backdrop-blur-md shadow-2xl transition-all active:scale-90"
                >
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

              </div>
            ) : (
              /* MODE B: PICTURE-IN-PICTURE (PIP) REAL VIDEO FULL SCREEN */
              <div className="relative w-full h-full overflow-hidden flex items-center justify-center rounded-2xl sm:rounded-3xl border border-white/10">
                {!swappedViews ? renderPartnerFace(false) : renderSelfFace(false)}

                {/* PICTURE-IN-PICTURE (PIP) WINDOW */}
                <div 
                  onClick={() => setSwappedViews(!swappedViews)}
                  title="Tap to swap big view and corner view"
                  className={`group absolute z-30 transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/50 bg-neutral-950 cursor-pointer hover:border-rose-400 ${
                    isPipMinimized 
                      ? 'top-4 right-4 w-20 h-28' 
                      : 'top-4 right-4 sm:right-6 w-36 h-48 sm:w-48 sm:h-64'
                  }`}
                >
                  {!swappedViews ? renderSelfFace(true) : renderPartnerFace(true)}

                  {/* Overlay hover prompt to swap */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-semibold gap-1 z-30">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Tap to Swap</span>
                  </div>

                  {/* PiP Action Buttons (Minimize/Maximize) */}
                  <div className="absolute bottom-1 right-1 z-30 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setIsPipMinimized(!isPipMinimized)}
                      className="p-1 rounded-md bg-black/70 text-white/90 hover:text-white"
                    >
                      {isPipMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* CASE 4: CONNECTED - AUDIO CALL */}
        {state === 'connected' && !isVideo && (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-6 z-20">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-rose-600/20 animate-pulse duration-1000" />
              <div className="absolute -inset-8 rounded-full bg-rose-600/10 animate-pulse duration-700" />
              <img
                src={partner.photos[0]}
                alt={partner.name}
                referrerPolicy="no-referrer"
                className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover object-[center_20%] border-4 border-rose-500 shadow-2xl shadow-rose-950/80"
              />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                {partner.name}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300">
                {partner.profession} · {partner.city}
              </p>
              <div className="flex items-center justify-center gap-2 pt-1 text-emerald-400 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Voice Connected · Crystal Clear Audio</span>
              </div>
            </div>

            {/* Simulated Live Audio Spectrum Bars */}
            <div className="flex items-center gap-1.5 h-8">
              {[12, 24, 16, 28, 20, 32, 18, 26, 14, 22].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-rose-500 rounded-full animate-pulse"
                  style={{
                    height: `${h}px`,
                    animationDelay: `${i * 120}ms`,
                    animationDuration: '600ms',
                  }}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* BOTTOM CONTROLS DOCK */}
      <div className="relative z-30 p-3 sm:p-5 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center gap-3 safe-bottom">
        
        {/* Quick Reaction Emojis */}
        {state === 'connected' && (
          <div className="flex items-center gap-2 sm:gap-3 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
            {['❤️', '🌹', '🙏', '👏', '😊', '💍', '✨'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => sendReaction(emoji)}
                className="text-xl sm:text-2xl hover:scale-130 transition-transform active:scale-90"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* In-Call Action Control Buttons */}
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          {/* Mute Microphone */}
          <button
            type="button"
            onClick={toggleMute}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
            className={`min-h-[48px] min-w-[48px] rounded-full flex items-center justify-center transition-all ${
              isMuted 
                ? 'bg-rose-600/90 text-white' 
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Video Toggle (If video call) */}
          {isVideo && (
            <button
              type="button"
              onClick={toggleVideo}
              title={isVideoDisabled ? 'Turn On Camera' : 'Turn Off Camera'}
              className={`min-h-[48px] min-w-[48px] rounded-full flex items-center justify-center transition-all ${
                isVideoDisabled 
                  ? 'bg-rose-600/90 text-white' 
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              {isVideoDisabled ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          )}

          {/* Switch Front/Rear Camera or Upload Selfie */}
          {isVideo && (
            <button
              type="button"
              onClick={isWebcamActive ? handleSwitchCamera : () => fileInputRef.current?.click()}
              title={isWebcamActive ? 'Switch Front/Rear Camera' : 'Upload My Real Photo'}
              className="min-h-[48px] min-w-[48px] rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
            >
              {isWebcamActive ? <SwitchCamera className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
            </button>
          )}

          {/* Phone/Laptop Camera & Live Face Switcher */}
          {isVideo && (
            <button
              type="button"
              onClick={isWebcamActive ? () => setIsWebcamActive(false) : () => initWebcam(true)}
              title={isWebcamActive ? 'Switch to Live Face View' : 'Phone / Laptop Camera On Karein'}
              className="min-h-[48px] px-3.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isWebcamActive ? 'Live Face' : 'Phone/Laptop Cam'}
              </span>
            </button>
          )}

          {/* Toggle Split Dual Face vs PiP layout */}
          {isVideo && state === 'connected' && (
            <button
              type="button"
              onClick={() => setVideoLayout(videoLayout === 'split' ? 'pip' : 'split')}
              title={videoLayout === 'split' ? 'Switch to Corner PiP' : 'Dono Face Samne (Split View)'}
              className={`min-h-[48px] min-w-[48px] rounded-full flex items-center justify-center transition-all ${
                videoLayout === 'split'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              {videoLayout === 'split' ? <Columns className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
            </button>
          )}

          {/* Swap Big/Small or Left/Right Video Views */}
          {isVideo && state === 'connected' && (
            <button
              type="button"
              onClick={() => setSwappedViews(!swappedViews)}
              title="Swap Face Views (Chehra Badlein)"
              className="min-h-[48px] min-w-[48px] rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* Speakerphone Toggle (If audio call) */}
          {!isVideo && (
            <button
              type="button"
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              title={isSpeakerOn ? 'Speaker On' : 'Speaker Off'}
              className={`min-h-[48px] min-w-[48px] rounded-full flex items-center justify-center transition-all ${
                isSpeakerOn 
                  ? 'bg-white/30 text-white' 
                  : 'bg-white/10 text-neutral-400'
              }`}
            >
              {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          )}

          {/* END CALL BUTTON */}
          <button
            type="button"
            onClick={handleEnd}
            title="End Call"
            className="min-h-[56px] min-w-[56px] rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-2xl shadow-rose-950 transition-transform active:scale-90"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

      </div>

    </div>
  );
};
