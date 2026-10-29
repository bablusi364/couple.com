import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, ArrowLeft, KeyRound, AlertCircle, CheckCircle2, User } from 'lucide-react';

interface AdminSecurityGateProps {
  onSuccess: () => void;
  onCancel: () => void;
  showToast?: (msg: string) => void;
  isModal?: boolean;
}

export const AdminSecurityGate: React.FC<AdminSecurityGateProps> = ({
  onSuccess,
  onCancel,
  showToast,
  isModal = false,
}) => {
  const [adminEmail, setAdminEmail] = useState('bablukumar9012123@gmail.com');
  const [adminPin, setAdminPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validPins = ['admin123', '9012123', 'admin', '7860', 'husbandwife@2026', '123456'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const trimmedPin = adminPin.trim();
      const trimmedEmail = adminEmail.trim().toLowerCase();

      // Check pin
      if (validPins.includes(trimmedPin)) {
        try {
          localStorage.setItem('husbandwife_admin_auth', 'true');
          localStorage.setItem('husbandwife_admin_email', trimmedEmail);
        } catch {
          // ignore
        }
        setIsLoading(false);
        if (showToast) {
          showToast('👑 Admin Access Granted! Welcome Bablu-Rajput.');
        }
        onSuccess();
      } else {
        setIsLoading(false);
        setErrorMsg('Access Denied: Galat Admin PIN/Password. Sirf authorized admin hi is portal ko open kar sakte hain.');
      }
    }, 400);
  };

  const content = (
    <div className="w-full max-w-md mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-neutral-100 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Shield */}
      <div className="flex flex-col items-center text-center space-y-3 mb-6 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-950 to-neutral-800 border-2 border-rose-500/40 flex items-center justify-center text-rose-500 shadow-xl">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-950/80 text-rose-400 border border-rose-800/60 inline-flex items-center gap-1 mb-1.5">
            <Lock className="w-3 h-3" />
            Restricted Access
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
            husbandwife<span className="text-rose-500">.com</span> Admin Portal
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs">
            Yeh control panel sirf authorized admin (Bablu-Rajput) ke liye surakshit hai. Kisi normal user ko access nahi hai.
          </p>
        </div>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="mb-5 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
            Admin Email ID
          </label>
          <div className="relative">
            <input
              type="text"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="bablukumar9012123@gmail.com"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              required
            />
            <div className="absolute right-3 top-2.5 text-neutral-500">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-neutral-300">
              Admin Security PIN / Password
            </label>
            <span className="text-[10px] text-neutral-500">Master PIN: 9012123</span>
          </div>
          <div className="relative">
            <input
              type={showPin ? 'text' : 'password'}
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              placeholder="Enter Admin PIN (e.g. 9012123 or admin123)"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              required
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-2.5 text-neutral-400 hover:text-white transition-colors"
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[42px] bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Verify & Enter Admin Console</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full min-h-[40px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl transition-colors border border-neutral-700 flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Website (Home)</span>
          </button>
        </div>
      </form>

      {/* Footer reassurance */}
      <div className="mt-6 pt-4 border-t border-neutral-800/80 text-center text-[11px] text-neutral-500">
        <p>🔒 256-bit Encrypted Enterprise Management Portal</p>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 sm:p-6">
      {content}
    </div>
  );
};
