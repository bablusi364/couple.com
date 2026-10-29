import React from 'react';
import { Heart, ShieldCheck, Sparkles, Send, Eye, MessageSquare, Check, Phone, Video, Edit3, MessageCircle, Users } from 'lucide-react';
import { Profile } from '../types/matrimony';

interface ProfileCardProps {
  profile: Profile;
  onViewDetails: (profile: Profile) => void;
  onConnect: (profile: Profile) => void;
  onToggleShortlist: (profileId: string) => void;
  onOpenChat: (profile: Profile) => void;
  isShortlisted: boolean;
  connectionStatus?: 'pending' | 'accepted' | 'declined';
  onStartCall?: (profile: Profile, type: 'audio' | 'video') => void;
  onOpenEditProfile?: () => void;
  onOpenOneToOne?: (profile: Profile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = React.memo(({
  profile,
  onViewDetails,
  onConnect,
  onToggleShortlist,
  onOpenChat,
  isShortlisted,
  connectionStatus,
  onStartCall,
  onOpenEditProfile,
  onOpenOneToOne,
}) => {
  return (
    <article className={`profile-card-optimized group bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col justify-between ${
      profile.isMyProfile ? 'border-rose-400 ring-2 ring-rose-300/50 shadow-md' : 'border-neutral-200 hover:border-neutral-300'
    }`}>
      <div>
        {/* Profile Image with subtle overlay info & verified badge */}
        <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
          <img
            src={profile.photos[0]}
            alt={profile.name}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = profile.gender === 'female'
                ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
                : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80';
            }}
            className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />

          {/* Top action row inside photo */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5">
            {profile.isMyProfile ? (
              <span className="px-2.5 py-1 bg-rose-600 text-white rounded-md text-[11px] font-bold shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Your Profile</span>
              </span>
            ) : profile.isVerified ? (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-md text-[11px] font-semibold text-emerald-800 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Biodata</span>
              </div>
            ) : <span />}

            <div className="flex items-center gap-1.5">
              {!profile.isMyProfile && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenChat(profile);
                    }}
                    title="WhatsApp Chat"
                    className="p-2 rounded-full bg-[#25D366] text-white hover:bg-[#20ba59] hover:scale-105 transition-all shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>

                  {onStartCall && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartCall(profile, 'audio');
                        }}
                        title="Audio Call"
                        className="p-2 rounded-full bg-white/80 backdrop-blur-md text-emerald-700 hover:bg-white hover:scale-105 transition-all shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartCall(profile, 'video');
                        }}
                        title="Video Call"
                        className="p-2 rounded-full bg-white/80 backdrop-blur-md text-rose-600 hover:bg-white hover:scale-105 transition-all shadow-xs"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </>
              )}

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

          {profile.isMyProfile ? (
            <button
              onClick={onOpenEditProfile}
              className="w-full min-h-[44px] py-2 px-3 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs"
            >
              <Edit3 className="w-4 h-4 text-rose-600" />
              <span>Edit My Bio</span>
            </button>
          ) : (
            <div className="flex flex-col gap-1.5 w-full">
              {/* Primary 1-to-1 Real Connection Button */}
              {onOpenOneToOne && (
                <button
                  type="button"
                  onClick={() => onOpenOneToOne(profile)}
                  className="w-full min-h-[38px] py-2 px-3 text-xs font-bold text-white bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:from-rose-700 hover:to-amber-700 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
                  title="1-to-1 Real Connection Room (Direct Live Video & Chat)"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>1-to-1 Real Connect</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </button>
              )}

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenChat(profile)}
                  className="flex-1 min-h-[40px] py-1.5 px-2 text-xs font-semibold text-white bg-[#008069] hover:bg-[#075E54] rounded-xl transition-colors flex items-center justify-center gap-1 whitespace-nowrap shrink-0 shadow-xs"
                  title="Direct WhatsApp Chat"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Chat</span>
                </button>
                {onStartCall && (
                  <button
                    onClick={() => onStartCall(profile, 'video')}
                    className="min-h-[40px] px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-1 shrink-0 shadow-xs"
                    title="Direct Real-Time Video Call"
                  >
                    <Video className="w-4 h-4 text-rose-600" />
                  </button>
                )}
                {connectionStatus === 'pending' ? (
                  <div className="min-h-[40px] px-2.5 py-1.5 text-xs font-medium text-neutral-600 bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-center gap-1 shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sent</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onConnect(profile)}
                    className="min-h-[40px] px-2.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors flex items-center justify-center gap-1 shrink-0 shadow-xs"
                    title="Send Connect Request"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
});
