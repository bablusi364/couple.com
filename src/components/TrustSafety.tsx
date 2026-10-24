import React from 'react';
import { ShieldCheck, Lock, EyeOff, UserCheck, CheckCircle2 } from 'lucide-react';

export const TrustSafety: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-2">
            Safety & Verification Constitution
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-serif">
            100% Verified Members. Uncompromising Privacy.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 sm:mt-2">
            Your matrimonial journey deserves highest dignity, authenticity, and strict parental privacy controls.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 font-serif">Government ID Verified</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every profile is cross-verified via Aadhaar, Passport or Driving License before badges are granted.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 font-serif">Photo & Phone Privacy</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Choose who views your photos. Keep your contact numbers visible only to mutually accepted connects.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 font-serif">Education & Salary Checks</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Degrees from IIT, IIM, CA institutes and tax income brackets undergo automated and manual credential verification.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 font-serif">Secure Family Coordination</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Separate parent and candidate login credentials allow seamless family coordination without compromising candidate comfort.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
