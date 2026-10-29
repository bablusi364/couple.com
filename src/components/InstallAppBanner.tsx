import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';

interface InstallAppBannerProps {
  onOpenApkGuide?: () => void;
}

export const InstallAppBanner: React.FC<InstallAppBannerProps> = ({ onOpenApkGuide }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already running in standalone/installed app mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user dismissed it recently
      const dismissed = sessionStorage.getItem('couple_install_banner_dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Show banner after 4 seconds on mobile if not already dismissed
    const timer = setTimeout(() => {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const dismissed = sessionStorage.getItem('couple_install_banner_dismissed');
      if (isMobile && !dismissed && !isInstalled) {
        setIsVisible(true);
      }
    }, 3500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, [isInstalled]);

  const [showHelp, setShowHelp] = useState(false);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsVisible(false);
        setDeferredPrompt(null);
      }
    } else if (onOpenApkGuide) {
      onOpenApkGuide();
    } else {
      setShowHelp(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('couple_install_banner_dismissed', 'true');
  };

  if (isInstalled || !isVisible) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-neutral-900/95 backdrop-blur-xl border border-rose-500/40 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl animate-fadeIn">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white shrink-0 shadow-md">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold font-serif text-white">husbandwife.com Mobile App</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                Play Store Ready
              </span>
            </div>
            <p className="text-[11px] text-neutral-300 mt-0.5">
              Install app for faster video calling, instant WhatsApp notifications & offline access.
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-neutral-400 hover:text-white p-1 rounded-lg"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {showHelp && (
        <div className="mt-3 p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-[11px] text-neutral-300 space-y-1 animate-fadeIn">
          <p className="font-semibold text-rose-300">Android Chrome me install karne ke aasan steps:</p>
          <p>1. Chrome browser me upar right side 3 dots (⋮) par tap karein</p>
          <p>2. "Install app" ya "Add to Home screen" par click karein</p>
          <p>3. App aapke home screen par add ho jayega!</p>
        </div>
      )}

      <div className="mt-3 flex items-center gap-2 pt-2 border-t border-white/10">
        <button
          onClick={handleInstallClick}
          className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950 transition-all active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install husbandwife.com App</span>
        </button>
        {onOpenApkGuide && (
          <button
            onClick={onOpenApkGuide}
            className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
          >
            APK & Share
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 text-xs font-medium"
        >
          Later
        </button>
      </div>
    </div>
  );
};
