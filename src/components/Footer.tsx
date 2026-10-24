import React from 'react';
import { ShieldCheck, Heart, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onSelectLanguage: (lang: string) => void;
  onSelectReligion: (rel: string) => void;
  onOpenUpgrade: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectLanguage,
  onSelectReligion,
  onOpenUpgrade,
}) => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-10 sm:py-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 pb-8 sm:pb-10 border-b border-neutral-800">
          
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-1.5 text-2xl font-bold tracking-tight text-white font-serif">
              <span>couple</span>
              <span className="text-rose-500">.com</span>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              India&apos;s leading matchmaking and matrimonial platform designed to bring families, heritage, and modern aspirations together with trust and complete authenticity.
            </p>
            <div className="pt-2 text-[11px] text-neutral-500 space-y-1">
              <p>24x7 Relationship Advisory: 1800-209-COUPLE (Toll-Free)</p>
              <p>Email: bablukumar9012123@gmail.com</p>
            </div>
          </div>

          {/* By Mother Tongue */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">By Mother Tongue</h4>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              {['Hindi', 'Punjabi', 'Marathi', 'Tamil', 'Telugu', 'Bengali', 'Gujarati', 'Urdu'].map((lang) => (
                <li key={lang}>
                  <button
                    onClick={() => onSelectLanguage(lang)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {lang} Matrimony
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* By Religion */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">By Religion</h4>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              {['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist'].map((rel) => (
                <li key={rel}>
                  <button
                    onClick={() => onSelectReligion(rel)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {rel} Matrimony
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Services */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Features & Trust</h4>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li>
                <button onClick={onOpenUpgrade} className="hover:text-amber-400 transition-colors text-left">
                  VIP Assisted couple.com
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('about-founder');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-rose-400 transition-colors text-left font-semibold text-rose-300"
                >
                  About Founder (Bablu-Rajput)
                </button>
              </li>
              <li><span>36 Guna Kundli Match</span></li>
              <li><span>Couple Live Speed Meet</span></li>
              <li><span>Aadhaar ID Verification</span></li>
              <li><span>Success Stories</span></li>
              <li><span>Privacy Safeguards</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} couple.com Matrimonial Services Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-neutral-400 transition-colors cursor-pointer">Terms of Use</span>
            <span>·</span>
            <span className="hover:text-neutral-400 transition-colors cursor-pointer">Safety Tips</span>
            <span>·</span>
            <span className="hover:text-neutral-400 transition-colors cursor-pointer">Fraud Alert</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
