import React from 'react';
import { Heart, ShieldCheck, Sparkles, Send, Eye, MessageSquare, Check } from 'lucide-react';
import { Profile } from '../types/matrimony';

interface ProfileCardProps {
  profile: Profile;
  onViewDetails: (profile: Profile) => void;
  onConnect: (profile: Profile) => void;
  onToggleShortlist: (profileId: string) => void;
  onOpenChat: (profile: Profile) => void;
  isShortlisted: boolean;
  connectionStatus?: 'pending' | 'accepted' | 'declined';
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onViewDetails,
  onConnect,
  onToggleShortlist,
  onOpenChat,
  isShortlisted,
  connectionStatus,
}) => {
  return (
    <article className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-neutral-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Profile Image with subtle overlay info & verified badge */}
        <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
          <img
            src={profile.photos[0]}
            alt={profile.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />

          {/* Top action row inside photo */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            {profile.isVerified ? (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-md text-[11px] font-semibold text-emerald-800 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Biodata</span>
              </div>
            ) : <span />}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleShortlist(profile.id);
              }}
              title={isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
              className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                isShortlisted
                  ? 'bg-rose-600 text-white'
                  : 'bg-white/80 text-neutral-700 hover:bg-white hover:text-rose-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Bottom info inside photo scrim */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-bold tracking-tight text-white font-serif">
                {profile.name}
              </h3>
              <span className="text-xs font-mono tabular-nums text-neutral-300">
                {profile.age} yrs · {profile.height.split(' ')[0]}
              </span>
            </div>
            <p className="text-xs text-neutral-300 mt-0.5">
              {profile.city}, {profile.state}
            </p>
          </div>
        </div>

        {/* Profile Attributes & Metadata (Zero-Pill discipline: unboxed text with typographic separators) */}
        <div className="p-4 sm:p-5 space-y-3.5">
          {/* Compatibility & Kundli score line */}
          <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-100">
            <span className="flex items-center gap-1.5 font-semibold text-rose-700">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>{profile.compatibilityScore}% Compatibility</span>
            </span>
            <span className="font-mono tabular-nums text-neutral-600 font-medium">
              {profile.kundli.gunaScore}/36 Gunas ({profile.kundli.manglik})
            </span>
          </div>

          {/* Professional and Cultural Bio summary */}
          <div className="space-y-1 text-xs text-neutral-600">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-semibold text-neutral-900">{profile.profession}</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className="truncate">{profile.companyType}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate text-neutral-500">
              <span className="truncate">{profile.education}</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className="font-mono tabular-nums text-neutral-800 font-medium">{profile.annualIncome}</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-500 pt-1">
              <span>{profile.religion}</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span>{profile.caste}</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span>{profile.motherTongue}</span>
            </div>
          </div>

          {/* Short About Snippet */}
          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
            {profile.about}
          </p>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-3.5 pt-0 sm:p-5 sm:pt-0">
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-100">
          <button
            onClick={() => onViewDetails(profile)}
            className="w-full min-h-[44px] py-2 px-3 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Eye className="w-4 h-4" />
            <span>Full Biodata</span>
          </button>

          {connectionStatus === 'accepted' ? (
            <button
              onClick={() => onOpenChat(profile)}
              className="w-full min-h-[44px] py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Message</span>
            </button>
          ) : connectionStatus === 'pending' ? (
            <div className="w-full min-h-[44px] py-2 px-3 text-xs font-medium text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Interest Sent</span>
            </div>
          ) : (
            <button
              onClick={() => onConnect(profile)}
              className="w-full min-h-[44px] py-2 px-3 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Connect</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
