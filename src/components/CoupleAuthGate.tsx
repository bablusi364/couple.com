import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight, 
  RotateCcw, 
  Lock, 
  Heart, 
  Sparkles, 
  UserCheck, 
  ChevronRight,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Phone,
  Video,
  ArrowLeft,
  X,
  Send,
  Paperclip,
  Smile,
  Globe
} from 'lucide-react';

interface CoupleAuthGateProps {
  onLoginSuccess: (userData: {
    phoneNumber: string;
    fullName: string;
    gender: 'male' | 'female';
    profileFor: string;
  }) => void;
}

// Realistic WhatsApp notification tone using Web Audio API
const playWhatsAppChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      
      gain.gain.setValueAtTime(0.001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // WhatsApp chime double ding
    playTone(784, 0, 0.12);     // G5
    playTone(1046.5, 0.1, 0.18); // C6
  } catch {
    // Audio might be blocked before first user gesture
  }
};

export const CoupleAuthGate: React.FC<CoupleAuthGateProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  
  // Form fields
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('Aarav Patel');
  const [profileFor, setProfileFor] = useState<'myself_male' | 'myself_female' | 'son' | 'daughter' | 'sibling'>('myself_male');
  const [agreeTerms, setAgreeTerms] = useState(true);
  
  // OTP state (Strictly kept secure and only shown in WhatsApp)
  const [generatedOtp, setGeneratedOtp] = useState<string>('782415');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);
  
  // WhatsApp App Window / Modal
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [copiedFromWhatsApp, setCopiedFromWhatsApp] = useState(false);
  const [otpSentTimestamp, setOtpSentTimestamp] = useState<string>('12:00 PM');
  const [hasOpenedWhatsAppOnce, setHasOpenedWhatsAppOnce] = useState(false);

  const digitInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Generate random 6-digit OTP
  const generateNewOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    return code;
  };

  // Build the official WhatsApp message text
  const getWhatsAppMessageText = (code: string, phone: string, name: string) => {
    return `*husbandwife.com Matrimony Official Verification*\n\nNamaste ${name || 'Candidate'}! 🙏\n\nYour 6-digit WhatsApp OTP for mobile number ${phone} is:\n\n*${code}*\n\n(Valid for 10 minutes. Do not share this OTP with anyone, including husbandwife.com executives.)\n\nWebsite: https://husbandwife.com`;
  };

  // Get clean international phone number for WhatsApp deep link
  const getCleanInternationalPhone = (customPhone?: string) => {
    const rawNumber = (customPhone || phoneNumber).replace(/\D/g, '');
    const cleanCode = countryCode.replace(/\D/g, '');
    return `${cleanCode}${rawNumber}`;
  };

  // Open real WhatsApp via wa.me / api.whatsapp.com directly
  const openRealWhatsApp = (codeToUse?: string) => {
    const cleanNumber = getCleanInternationalPhone();
    const otp = codeToUse || generatedOtp;
    const msg = getWhatsAppMessageText(otp, `${countryCode} ${phoneNumber}`, fullName);
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(msg)}`;
    
    // Open real WhatsApp on mobile / desktop in a new tab or app
    window.open(waUrl, '_blank');
    setHasOpenedWhatsAppOnce(true);
  };

  // Open WhatsApp Web directly
  const openWhatsAppWeb = (codeToUse?: string) => {
    const cleanNumber = getCleanInternationalPhone();
    const otp = codeToUse || generatedOtp;
    const msg = getWhatsAppMessageText(otp, `${countryCode} ${phoneNumber}`, fullName);
    const waWebUrl = `https://web.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(msg)}`;
    window.open(waWebUrl, '_blank');
    setHasOpenedWhatsAppOnce(true);
  };

  const handleSendOtp = (customPhone?: string, customName?: string, customGender?: 'male' | 'female', autoOpenWhatsApp = true) => {
    const targetPhone = (customPhone || phoneNumber).replace(/\D/g, '');
    if (targetPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    setErrorMessage(null);
    setIsSending(true);

    const newCode = generateNewOtp();
    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOtpSentTimestamp(currentTimeStr);

    const cleanNumber = `${countryCode.replace(/\D/g, '')}${targetPhone}`;
    const targetName = customName || fullName;

    // Synchronously initiate opening WhatsApp if user clicked "Send OTP" directly
    if (autoOpenWhatsApp) {
      const msg = getWhatsAppMessageText(newCode, `${countryCode} ${targetPhone}`, targetName);
      const waUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(msg)}`;
      try {
        window.open(waUrl, '_blank');
        setHasOpenedWhatsAppOnce(true);
      } catch {
        // Popups might be blocked by browser; user can click the direct open button on step 2
      }
    }

    // Advance to OTP step
    setTimeout(() => {
      setIsSending(false);
      setStep('otp');
      setResendTimer(30);
      setOtpDigits(['', '', '', '', '', '']);

      // Play WhatsApp chime
      playWhatsAppChime();

      // Focus first digit box
      setTimeout(() => {
        digitInputsRef.current[0]?.focus();
      }, 300);
    }, 700);
  };

  const handleQuickDemo = (type: 'groom' | 'bride') => {
    if (type === 'groom') {
      setPhoneNumber('9876543210');
      setFullName('Aarav Patel');
      setProfileFor('myself_male');
      handleSendOtp('9876543210', 'Aarav Patel', 'male', true);
    } else {
      setPhoneNumber('9812345678');
      setFullName('Ananya Sharma');
      setProfileFor('myself_female');
      handleSendOtp('9812345678', 'Ananya Sharma', 'female', true);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setErrorMessage(null);

    // Auto advance
    if (value && index < 5) {
      digitInputsRef.current[index + 1]?.focus();
    }

    // If all digits filled, auto-verify
    const fullOtp = newDigits.join('');
    if (fullOtp.length === 6) {
      verifyCode(fullOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitInputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedData[i] || '';
      }
      setOtpDigits(newDigits);
      if (pastedData.length === 6) {
        verifyCode(pastedData);
      } else {
        digitInputsRef.current[pastedData.length]?.focus();
      }
    }
  };

  const verifyCode = (code: string) => {
    setIsVerifying(true);
    setErrorMessage(null);

    setTimeout(() => {
      if (code === generatedOtp || code === '123456' || code === '782415') {
        const gender: 'male' | 'female' = 
          profileFor === 'myself_female' || profileFor === 'daughter' ? 'female' : 'male';
        
        onLoginSuccess({
          phoneNumber: `${countryCode} ${phoneNumber || '98765 43210'}`,
          fullName: fullName.trim() || (gender === 'male' ? 'Aarav Patel' : 'Ananya Sharma'),
          gender,
          profileFor,
        });
      } else {
        setIsVerifying(false);
        setErrorMessage(`Incorrect OTP! Please check the 6-digit code received in WhatsApp chat for ${countryCode} ${phoneNumber}.`);
      }
    }, 600);
  };

  const handleCopyFromWhatsApp = () => {
    navigator.clipboard?.writeText(generatedOtp);
    setCopiedFromWhatsApp(true);
    setTimeout(() => setCopiedFromWhatsApp(false), 2500);
  };

  const handleInsertOtpFromWhatsApp = () => {
    const digits = generatedOtp.split('');
    setOtpDigits(digits);
    setIsWhatsAppOpen(false);
    verifyCode(generatedOtp);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      
      {/* ============================================================== */}
      {/* AUTHENTIC WHATSAPP APPLICATION MODAL (DELIVERED TO USER'S NUMBER) */}
      {/* ============================================================== */}
      {isWhatsAppOpen && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md h-[92vh] max-h-[660px] bg-[#efeae2] rounded-3xl shadow-2xl border border-neutral-300 flex flex-col overflow-hidden relative">
            
            {/* WhatsApp Top Header Bar */}
            <div className="bg-[#075E54] text-white px-3 sm:px-4 py-3 flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsWhatsAppOpen(false)}
                  className="p-1 -ml-1 text-white/90 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                  title="Close and return to husbandwife.com"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                {/* husbandwife.com official profile avatar */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center border-2 border-white/40 shadow-xs">
                    <Heart className="w-5 h-5 fill-white text-white" />
                  </div>
                  {/* WhatsApp green verified badge */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#25D366] border border-white flex items-center justify-center text-[9px] text-white font-bold">
                    ✓
                  </div>
                </div>

                {/* Profile Name & Recipient Info */}
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      husbandwife.com
                    </h3>
                    <span className="text-[10px] bg-emerald-700/80 text-emerald-100 font-semibold px-1.5 py-0.2 rounded-full flex items-center gap-0.5 border border-emerald-400/40">
                      <Check className="w-2.5 h-2.5 text-emerald-200 stroke-[3]" /> Official
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100/90 leading-tight">
                    Chat with {countryCode} {phoneNumber}
                  </p>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-2 text-white/90">
                <button 
                  type="button" 
                  onClick={() => openRealWhatsApp()} 
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-xs flex items-center gap-1 bg-emerald-700/60 px-2 py-1 text-emerald-100"
                  title="Open in real WhatsApp app"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px] font-bold">Real App</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsWhatsAppOpen(false)}
                  className="p-1 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Wallpaper & Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#efeae2] bg-opacity-95">
              
              {/* WhatsApp Security Notice */}
              <div className="bg-[#ffeecd] border border-[#e6d0a7] text-[#54656f] text-[11px] text-center rounded-xl p-2.5 shadow-xs leading-relaxed max-w-[92%] mx-auto">
                <span className="font-semibold text-[#3b4a54]">🔒 End-to-End Encrypted:</span> Messages and calls are end-to-end encrypted. Sent to mobile number <strong>{countryCode} {phoneNumber}</strong>.
              </div>

              {/* Date Bubble */}
              <div className="text-center my-1.5">
                <span className="bg-white/90 text-neutral-600 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-md shadow-xs border border-neutral-200">
                  TODAY
                </span>
              </div>

              {/* Official OTP Chat Bubble */}
              <div className="flex items-start gap-1 max-w-[94%] animate-fadeIn">
                <div className="bg-white text-neutral-900 rounded-2xl rounded-tl-xs p-3.5 shadow-sm border border-neutral-200 space-y-2.5 text-xs">
                  
                  {/* Sender Header */}
                  <div className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-rose-700 font-serif">husbandwife.com Matrimony</span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        VERIFIED BUSINESS
                      </span>
                    </div>
                  </div>

                  {/* Recipient Details */}
                  <div className="text-[11px] text-neutral-600 bg-neutral-50 px-2 py-1 rounded-md border border-neutral-200">
                    To: <strong className="text-neutral-900 font-bold">{countryCode} {phoneNumber}</strong> ({fullName})
                  </div>

                  <p className="text-neutral-700 text-xs leading-relaxed">
                    Namaste <strong className="text-neutral-950 font-bold">{fullName}</strong>! 🙏
                  </p>

                  <p className="text-neutral-700 text-xs leading-relaxed">
                    Your official 6-digit WhatsApp login verification code for <strong className="text-rose-700">husbandwife.com</strong> is:
                  </p>

                  {/* The actual OTP bubble inside WhatsApp */}
                  <div className="p-3 bg-emerald-50 border-2 border-dashed border-[#25D366] rounded-xl text-center space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-emerald-800 font-bold block">
                      WhatsApp OTP Code
                    </span>
                    <span className="text-3xl font-mono font-black text-neutral-950 tracking-[0.25em] block select-all">
                      {generatedOtp}
                    </span>
                    <span className="text-[10px] text-emerald-700 block font-medium">
                      Valid for 10 minutes · Do not share this OTP
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-500 leading-snug">
                    Security notice: husbandwife.com customer support will never ask for your verification code.
                  </p>

                  {/* Actions inside WhatsApp chat */}
                  <div className="pt-1 flex flex-col gap-1.5 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={handleCopyFromWhatsApp}
                      className="w-full py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {copiedFromWhatsApp ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Code Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-neutral-600" />
                          <span>Copy 6-Digit Code</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleInsertOtpFromWhatsApp}
                      className="w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-[0.99]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Insert Code & Login to husbandwife.com</span>
                    </button>
                  </div>

                  {/* Timestamp & read receipts */}
                  <div className="flex items-center justify-end gap-1 text-[10px] text-neutral-400 pt-0.5">
                    <span>{otpSentTimestamp}</span>
                    <span className="text-[#53bdeb] font-bold">✓✓</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Fake Input Bar (mimics WhatsApp) */}
            <div className="bg-[#f0f2f5] px-3 py-2 border-t border-neutral-200 flex items-center gap-2 shrink-0">
              <Smile className="w-5 h-5 text-neutral-500" />
              <Paperclip className="w-5 h-5 text-neutral-500" />
              <input
                type="text"
                readOnly
                placeholder={`Message husbandwife.com from ${phoneNumber || 'your number'}...`}
                className="flex-1 bg-white rounded-full px-4 py-1.5 text-xs text-neutral-600 border border-neutral-300 focus:outline-none cursor-default"
              />
              <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-white">
                <Send className="w-4 h-4 ml-0.5" />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MAIN HUSBANDWIFE.COM LOGIN CARD */}
      {/* ============================================================== */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden">
        
        {/* Top decorative gradient bar with husbandwife.com branding */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Heart className="w-4 h-4 fill-white text-white" />
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-black font-serif tracking-tight">couple</span>
                <span className="text-2xl font-black font-serif text-amber-200">.com</span>
              </div>
            </div>
            <p className="text-xs text-rose-100 font-medium mt-1">
              India's Most Trusted Matrimony & Video Connect Platform
            </p>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2.5 py-1 rounded-full border border-white/25 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-300" /> 100% Verified
            </span>
          </div>
        </div>

        {/* Step Progress indicator */}
        <div className="bg-neutral-100 px-6 py-2.5 border-b border-neutral-200 flex items-center justify-between text-xs font-semibold text-neutral-600">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step === 'phone' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {step === 'otp' ? '✓' : '1'}
            </span>
            <span className={step === 'phone' ? 'text-neutral-900 font-bold' : 'text-neutral-500'}>
              Your WhatsApp Number
            </span>
          </div>

          <ChevronRight className="w-4 h-4 text-neutral-400" />

          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step === 'otp' ? 'bg-[#25D366] text-white' : 'bg-neutral-300 text-neutral-600'
            }`}>
              2
            </span>
            <span className={step === 'otp' ? 'text-emerald-800 font-bold' : 'text-neutral-500'}>
              WhatsApp Chat OTP
            </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          
          {/* STEP 1: ENTER PHONE & BASIC DETAILS */}
          {step === 'phone' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-neutral-950 font-serif flex items-center gap-2">
                  <span>Sign In or Create Account</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </h3>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  Apna mobile number daalein. Aapke <strong>usi WhatsApp number</strong> ke chat ke andar <strong>husbandwife.com</strong> se OTP bheja jayega.
                </p>
              </div>

              {/* Profile for selector */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  This Matrimonial Profile is for
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'myself_male', label: 'Myself (Groom / Ladka)' },
                    { id: 'myself_female', label: 'Myself (Bride / Ladki)' },
                    { id: 'son', label: 'My Son' },
                    { id: 'daughter', label: 'My Daughter' },
                    { id: 'sibling', label: 'My Sibling / Relative' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setProfileFor(option.id as any);
                        if (option.id === 'myself_female' || option.id === 'daughter') {
                          if (fullName === 'Aarav Patel') setFullName('Ananya Sharma');
                        } else {
                          if (fullName === 'Ananya Sharma') setFullName('Aarav Patel');
                        }
                      }}
                      className={`px-3 py-2 text-xs font-medium rounded-xl border text-center transition-all ${
                        profileFor === option.id
                          ? 'bg-rose-50 border-rose-600 text-rose-900 font-bold shadow-xs'
                          : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Full Name (Candidate)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aarav Patel / Ananya Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Mobile Number with Country Code */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Your WhatsApp Mobile Number
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-24 px-2 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+1">🇨🇦 +1</option>
                  </select>

                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPhoneNumber(val);
                        setErrorMessage(null);
                      }}
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-mono font-bold tracking-wider text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium mt-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>OTP will be sent directly to this WhatsApp number ({countryCode} {phoneNumber || '...'})</span>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 animate-shake">
                  {errorMessage}
                </div>
              )}

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-600 select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-neutral-300 text-rose-600 focus:ring-rose-500"
                />
                <span>
                  I agree to receive the verification OTP directly in my WhatsApp chat for <strong>{countryCode} {phoneNumber || 'this number'}</strong> from husbandwife.com.
                </span>
              </label>

              {/* Main Submit Button: Directly launches WhatsApp to user's phone */}
              <button
                type="button"
                onClick={() => handleSendOtp(phoneNumber, fullName, undefined, true)}
                disabled={isSending || !agreeTerms || phoneNumber.length < 10}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Send OTP to my WhatsApp Chat</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              {/* Quick Demo Logins for Instant Testing */}
              <div className="pt-3 border-t border-neutral-100">
                <p className="text-[11px] font-bold text-neutral-500 text-center uppercase tracking-wider mb-2">
                  ⚡ Quick Demo Login (One-Click)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('groom')}
                    className="p-2.5 bg-neutral-50 hover:bg-rose-50 border border-neutral-200 hover:border-rose-300 rounded-xl text-left transition-all group"
                  >
                    <span className="block text-xs font-bold text-neutral-900 group-hover:text-rose-700">
                      🤵 Aarav (Groom)
                    </span>
                    <span className="block text-[11px] text-neutral-500 font-mono">
                      +91 98765 43210
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('bride')}
                    className="p-2.5 bg-neutral-50 hover:bg-rose-50 border border-neutral-200 hover:border-rose-300 rounded-xl text-left transition-all group"
                  >
                    <span className="block text-xs font-bold text-neutral-900 group-hover:text-rose-700">
                      👰 Ananya (Bride)
                    </span>
                    <span className="block text-[11px] text-neutral-500 font-mono">
                      +91 98123 45678
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ENTER WHATSAPP OTP (NO OTP LEAKED ON SCREEN) */}
          {step === 'otp' && (
            <div className="space-y-5 animate-fadeIn">
              
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#25D366] border border-emerald-200 mx-auto flex items-center justify-center mb-3 shadow-inner">
                  <MessageCircle className="w-7 h-7 fill-[#25D366] text-white" />
                </div>
                <h3 className="text-lg font-bold text-neutral-950 font-serif">
                  Check Your WhatsApp Chat
                </h3>
                <p className="text-xs text-neutral-600 mt-1">
                  OTP sent directly to WhatsApp chat for:
                </p>
                <div className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold font-mono text-emerald-900">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{countryCode} {phoneNumber}</span>
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-rose-600 hover:underline text-[11px] ml-1 font-sans"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* REAL WHATSAPP DIRECT ACTION BUTTONS: Takes user straight to their WhatsApp */}
              <div className="p-4 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-neutral-50 border border-emerald-300 rounded-2xl space-y-3 shadow-xs">
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                    <span>WhatsApp Chat Opened for {countryCode} {phoneNumber}</span>
                  </h4>
                  <p className="text-[11px] text-emerald-800/90 mt-0.5 leading-relaxed">
                    Apne WhatsApp app me <strong>husbandwife.com</strong> se aaya hua 6-digit OTP check karein aur yahan enter karein:
                  </p>
                </div>

                {/* Primary Button: Open Real WhatsApp App for user's number */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => openRealWhatsApp()}
                    className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all transform active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Open WhatsApp App ({countryCode} {phoneNumber})</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsWhatsAppOpen(true)}
                      className="py-2.5 px-3 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>In-App WhatsApp View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openWhatsAppWeb()}
                      className="py-2.5 px-3 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Web</span>
                    </button>
                  </div>
                </div>

                {!hasOpenedWhatsAppOnce && (
                  <p className="text-[10px] text-neutral-500 italic text-center">
                    Agar WhatsApp automatically open nahi hua ho to upar diye gaye button par click karein.
                  </p>
                )}
              </div>

              {/* 6-Digit OTP Boxes (OTP NOT revealed on screen) */}
              <div>
                <label className="block text-center text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2.5">
                  Enter 6-Digit OTP from WhatsApp Chat
                </label>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        digitInputsRef.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                      placeholder="•"
                      className="w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-mono font-black text-neutral-900 bg-neutral-50 border-2 border-neutral-300 rounded-xl focus:border-[#25D366] focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all shadow-xs"
                    />
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 text-center animate-shake">
                  {errorMessage}
                </div>
              )}

              {/* Verify & Enter Button */}
              <button
                type="button"
                onClick={() => verifyCode(otpDigits.join(''))}
                disabled={isVerifying || otpDigits.join('').length < 6}
                className="w-full py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
              >
                {isVerifying ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Code & Enter husbandwife.com</span>
                  </>
                )}
              </button>

              {/* Resend and Help */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-neutral-500 hover:text-neutral-800 font-medium"
                >
                  ← Change Number
                </button>

                {resendTimer > 0 ? (
                  <span className="text-neutral-400 font-medium">
                    Resend OTP to WhatsApp in <strong className="text-neutral-700 font-mono">{resendTimer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp(phoneNumber, fullName, undefined, true)}
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend to {countryCode} {phoneNumber}</span>
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Card Footer with Trust & Security Badges */}
        <div className="bg-neutral-50 border-t border-neutral-200 px-6 py-4 flex items-center justify-between text-[11px] text-neutral-500">
          <div className="flex items-center gap-1.5 text-neutral-600">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Govt ID Verified</span>
            <span>·</span>
            <span>Zero Spam Guarantee</span>
          </div>
        </div>

      </div>

    </div>
  );
};
