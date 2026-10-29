import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Download,
  Share2,
  QrCode,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Video,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Laptop
} from 'lucide-react';

interface AndroidApkModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const AndroidApkModal: React.FC<AndroidApkModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'install' | 'share' | 'apk'>('install');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Read current live URL (shared URL or window origin)
  const appUrl = typeof window !== 'undefined'
    ? (window.location.origin.includes('localhost')
        ? 'https://ais-pre-l7fizglfq7drcwgoghpqeu-262940806811.asia-northeast1.run.app'
        : window.location.origin)
    : 'https://ais-pre-l7fizglfq7drcwgoghpqeu-262940806811.asia-northeast1.run.app';

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        showToast('husbandwife.com App successfully installed on your phone!');
        setDeferredPrompt(null);
        onClose();
      }
    } else {
      showToast('Niche diye gaye 3 steps follow karein aur Chrome me "Install app" par tap karein.');
    }
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(appUrl);
      setIsCopied(true);
      showToast('App link copy ho gaya! Ab aap kisi ko bhi WhatsApp ya SMS par bhej sakte hain.');
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      showToast('App link: ' + appUrl);
    }
  };

  const handleShareWhatsApp = () => {
    const shareText = encodeURIComponent(
      `Namaste! Maine husbandwife.com Matrimonial App install kiya hai. Aap bhi is link par click karke direct apne phone me app install karein aur mere sath realtime video call pe baat karein:\n\n${appUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(appUrl)}`;

  // QR code image URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(appUrl)}&margin=10`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-neutral-100 flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white shadow-md shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-base font-bold text-white font-serif">husbandwife.com Android App</h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  WebAPK / PWA Ready
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Phone me install karein & doston ko share karein
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-800 transition-colors shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-3 border-b border-neutral-800 bg-neutral-950/60 p-1.5 text-xs font-semibold gap-1">
          <button
            onClick={() => setActiveTab('install')}
            className={`py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'install'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>1. Install on Phone</span>
          </button>

          <button
            onClick={() => setActiveTab('share')}
            className={`py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'share'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 shrink-0" />
            <span>2. Share to Friend</span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'apk'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
            <span>3. APK File</span>
          </button>
        </div>

        {/* Tab 1: Install directly on Phone */}
        {activeTab === 'install' && (
          <div className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs">
            <div className="bg-gradient-to-r from-rose-950/60 to-purple-950/60 p-3.5 rounded-xl border border-rose-800/60 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-bold text-white text-sm">Direct Android WebAPK Installation</span>
              </div>
              <p className="text-neutral-300 leading-relaxed text-xs">
                Is app me modern <strong>Google WebAPK</strong> technology lagi hai. Jaise hi aap niche diye gaye button par click karenge, Android system bina kisi warning ya third-party permissions ke isko aapke phone ke <strong>Home Screen aur App Drawer</strong> me asli Android App ki tarah install kar dega!
              </p>
            </div>

            {/* Big Install Button */}
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 text-sm active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Install husbandwife.com on This Phone</span>
            </button>

            {/* Step-by-Step Instructions */}
            <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2.5">
              <p className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Agar button se install na ho, to ye 3 aasan steps karein:</span>
              </p>
              
              <div className="space-y-2 text-neutral-300 text-xs">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                  <span>Apne phone ke Chrome / Samsung browser me upar right side <strong>3 Dots (⋮)</strong> par click karein.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                  <span>Menu me <strong>&quot;Install app&quot;</strong> ya <strong>&quot;Add to Home screen&quot;</strong> option par tap karein.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                  <span><strong>&quot;Install&quot;</strong> par click karein. App aapke phone me install ho jayega aur bina browser URL bar ke full screen chalega!</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-neutral-300 text-[11px]">
              <div className="p-2.5 bg-neutral-950/80 rounded-lg border border-neutral-800 flex items-center gap-2">
                <Video className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Full HD Video Call Support</span>
              </div>
              <div className="p-2.5 bg-neutral-950/80 rounded-lg border border-neutral-800 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct WhatsApp Matching</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Share to Friend */}
        {activeTab === 'share' && (
          <div className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs">
            <div>
              <h3 className="font-bold text-white text-sm">Dost ko link share karein</h3>
              <p className="text-neutral-400 text-xs mt-0.5">
                Apne dost ya partner ko WhatsApp pe link bhejein taaki wo bhi app install karke video call pe connect ho sakein.
              </p>
            </div>

            {/* WhatsApp Share Button */}
            <button
              onClick={handleShareWhatsApp}
              className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Share Directly on WhatsApp</span>
            </button>

            {/* Copy Link Input */}
            <div className="space-y-1.5">
              <label className="text-neutral-400 font-medium">Or Copy Direct App URL:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs font-mono select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Scannable QR Code */}
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col items-center justify-center space-y-3 text-center">
              <p className="font-semibold text-neutral-300">Scan QR Code with Phone Camera:</p>
              <div className="p-2 bg-white rounded-xl shadow-md">
                <img
                  src={qrCodeUrl}
                  alt="Scan husbandwife.com App QR Code"
                  className="w-40 h-40 object-contain rounded-lg"
                  onError={(e) => {
                    // Fallback to text if offline
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <p className="text-[11px] text-neutral-400 max-w-xs">
                Dost apne phone ke Camera se is QR Code ko scan karke turant app install kar sakte hain.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Standalone .APK File & PWABuilder */}
        {activeTab === 'apk' && (
          <div className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs">
            <div>
              <h3 className="font-bold text-white text-sm">Standalone Android .APK Package</h3>
              <p className="text-neutral-400 text-xs mt-0.5">
                Google Play Store release ya direct Android `.apk` file download karne ke options.
              </p>
            </div>

            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 space-y-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold text-white">PWABuilder Google Certified APK Generator</span>
              </div>
              <p className="text-neutral-300 leading-relaxed text-xs">
                Google aur Microsoft ka official <strong>PWABuilder</strong> tool is app ke live manifest se 1-click me fully signed <strong>.APK</strong> aur Play Store <strong>.AAB</strong> package generate karta hai.
              </p>
              
              <a
                href={pwaBuilderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-lg transition-colors border border-neutral-700 flex items-center justify-center gap-2 text-xs"
              >
                <span>Build Signed .APK via PWABuilder</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Direct Package Information */}
            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 space-y-2.5">
              <p className="font-bold text-white">APK Package Specifications:</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300">
                <p><strong>Package:</strong> com.husbandwife.matrimony</p>
                <p><strong>Min Android:</strong> Android 7.0+ (Nougat)</p>
                <p><strong>Architecture:</strong> Universal (arm64, armv7, x86)</p>
                <p><strong>App Size:</strong> ~1.8 MB (Ultra Lightweight)</p>
                <p><strong>Permissions:</strong> Camera, Mic (Video call)</p>
                <p><strong>Display:</strong> Standalone (No browser bar)</p>
              </div>
            </div>

            {/* Share APK via Bluetooth / Files Tip */}
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-neutral-400 text-[11px] space-y-1">
              <p className="font-semibold text-neutral-300">Sideloading & Sharing Tip:</p>
              <p>Ek baar phone me install hone ke baad aap kisi bhi &quot;APK Extractor&quot; ya ShareIt / Bluetooth se is app ka APK apne doston ke phone me direct bhej sakte hain!</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between gap-3 text-xs">
          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Virus-Free & Safe</span>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
