import React, { useState } from 'react';
import { X, Heart, ShieldCheck, Sparkles, Send, MessageSquare, Phone, Lock, CheckCircle2, ChevronRight, Share2 } from 'lucide-react';
import { Profile } from '../types/matrimony';

interface ProfileDetailModalProps {
  profile: Profile | null;
  onClose: () => void;
  onConnect: (profile: Profile) => void;
  onToggleShortlist: (profileId: string) => void;
  onOpenChat: (profile: Profile) => void;
  openUpgrade: () => void;
  isShortlisted: boolean;
  connectionStatus?: 'pending' | 'accepted' | 'declined';
  hasPremium: boolean;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  onClose,
  onConnect,
  onToggleShortlist,
  onOpenChat,
  openUpgrade,
  isShortlisted,
  connectionStatus,
  hasPremium,
}) => {
  const [activeTab, setActiveTab] = useState<'biodata' | 'kundli' | 'family' | 'expectations'>('biodata');
  const [showContact, setShowContact] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!profile) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 h-[92vh] sm:h-auto sm:max-h-[85vh] flex flex-col my-0 sm:my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-neutral-200 bg-neutral-50/90 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[11px] sm:text-xs font-mono text-neutral-500 uppercase tracking-wider">#{profile.id}</span>
            {profile.isVerified && (
              <span className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% ID Verified</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleShare}
              title="Share Profile"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 rounded-lg transition-colors text-xs gap-1 font-medium"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="max-h-[80vh] overflow-y-auto">
          {/* Hero Bio Banner */}
          <div className="p-6 bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 border-b border-neutral-200 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-neutral-100">
              <img
                src={profile.photos[0]}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-serif">
                  {profile.name}
                </h2>
                <span className="text-xs font-mono tabular-nums text-neutral-500">
                  {profile.lastActive}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-neutral-600">
                <span className="font-semibold text-neutral-900">{profile.age} yrs</span>
                <span aria-hidden="true">·</span>
                <span>{profile.height}</span>
                <span aria-hidden="true">·</span>
                <span>{profile.religion} ({profile.caste})</span>
                <span aria-hidden="true">·</span>
                <span>{profile.motherTongue}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-neutral-800">{profile.city}, {profile.state}</span>
              </div>

              <div className="pt-2 text-xs text-neutral-700 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="bg-white px-2.5 py-1 rounded-md border border-neutral-200 font-medium">
                  💼 {profile.profession}
                </span>
                <span className="bg-white px-2.5 py-1 rounded-md border border-neutral-200 font-medium">
                  🎓 {profile.education}
                </span>
                <span className="bg-white px-2.5 py-1 rounded-md border border-neutral-200 font-medium">
                  💰 {profile.annualIncome}
                </span>
              </div>

              {/* Match Score Strip */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-100/70 px-3 py-1 rounded-md">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  <span>{profile.compatibilityScore}% Overall Compatibility</span>
                </div>
                <div className="text-xs font-semibold text-neutral-700 bg-amber-100/70 px-3 py-1 rounded-md font-mono tabular-nums">
                  Astro Milan: {profile.kundli.gunaScore}/36 Gunas
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 border-b border-neutral-200 bg-white sticky top-0 z-10">
            <div className="flex space-x-6 text-xs font-medium text-neutral-600 overflow-x-auto">
              <button
                onClick={() => setActiveTab('biodata')}
                className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'biodata' ? 'border-rose-600 text-rose-600 font-bold' : 'border-transparent hover:text-neutral-900'
                }`}
              >
                Personal & Career
              </button>
              <button
                onClick={() => setActiveTab('kundli')}
                className={`py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1 ${
                  activeTab === 'kundli' ? 'border-rose-600 text-rose-600 font-bold' : 'border-transparent hover:text-neutral-900'
                }`}
              >
                <span>Astro & Kundli (36 Gunas)</span>
              </button>
              <button
                onClick={() => setActiveTab('family')}
                className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'family' ? 'border-rose-600 text-rose-600 font-bold' : 'border-transparent hover:text-neutral-900'
                }`}
              >
                Family Background
              </button>
              <button
                onClick={() => setActiveTab('expectations')}
                className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'expectations' ? 'border-rose-600 text-rose-600 font-bold' : 'border-transparent hover:text-neutral-900'
                }`}
              >
                Partner Preferences
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 space-y-6">
            
            {activeTab === 'biodata' && (
              <div className="space-y-6">
                {/* About Bio */}
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">About Her / Him</h4>
                  <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                    {profile.about}
                  </p>
                </div>

                {/* Verification Credentials */}
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">Verified Trust Checks</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {profile.verifiedDetails.map((v, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Career & Education</h4>
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-neutral-200/60">
                        <span className="text-neutral-500">Education</span>
                        <span className="font-semibold text-neutral-900">{profile.education}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-neutral-200/60">
                        <span className="text-neutral-500">Alma Mater</span>
                        <span className="font-semibold text-neutral-900">{profile.college}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-neutral-200/60">
                        <span className="text-neutral-500">Profession</span>
                        <span className="font-semibold text-neutral-900">{profile.profession}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-neutral-200/60">
                        <span className="text-neutral-500">Company Type</span>
                        <span className="font-semibold text-neutral-900">{profile.companyType}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-neutral-500">Annual Income</span>
                        <span className="font-mono tabular-nums font-bold text-emerald-700">{profile.annualIncome}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Lifestyle & Habits</h4>
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-neutral-200/60">
                        <span className="text-neutral-500">Diet</span>
                        <span className="font-semibold text-neutral-900">{profile.diet}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-neutral-200/60">
                        <span className="text-neutral-500">Drinking</span>
                        <span className="font-semibold text-neutral-900">{profile.drinking}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-neutral-200/60">
                        <span className="text-neutral-500">Smoking</span>
                        <span className="font-semibold text-neutral-900">{profile.smoking}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-neutral-500">Mother Tongue</span>
                        <span className="font-semibold text-neutral-900">{profile.motherTongue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hobbies & Interests */}
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">Interests & Passions</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, i) => (
                      <span key={i} className="text-xs font-medium text-neutral-700 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'kundli' && (
              <div className="space-y-6">
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-amber-950 font-serif">
                      Ashtakoot Guna Milan Compatibility: {profile.kundli.gunaScore} / 36
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      {profile.kundli.gunaScore >= 28
                        ? 'Uttam (Excellent) Match according to traditional Vedic astrological principles.'
                        : 'Madhyam (Good) Match with high emotional and intellectual compatibility.'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold font-mono tabular-nums text-amber-900">
                      {profile.kundli.gunaScore}/36
                    </span>
                    <p className="text-[10px] text-amber-700 uppercase font-semibold">Guna Score</p>
                  </div>
                </div>

                {/* Astro Details Summary */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-center">
                    <p className="text-[11px] text-neutral-500">Rashi (Moon Sign)</p>
                    <p className="text-xs font-bold text-neutral-900 mt-0.5">{profile.kundli.rashi}</p>
                  </div>
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-center">
                    <p className="text-[11px] text-neutral-500">Nakshatra</p>
                    <p className="text-xs font-bold text-neutral-900 mt-0.5">{profile.kundli.nakshatra}</p>
                  </div>
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-center">
                    <p className="text-[11px] text-neutral-500">Manglik Status</p>
                    <p className="text-xs font-bold text-rose-700 mt-0.5">{profile.kundli.manglik}</p>
                  </div>
                </div>

                {/* 8 Koot Guna Breakdown Table */}
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">Detailed Ashtakoot Milan Breakdown</h4>
                  <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-neutral-100 text-neutral-600 font-semibold border-b border-neutral-200">
                        <tr>
                          <th className="py-2.5 px-4">Koot Parameter</th>
                          <th className="py-2.5 px-4">Significance</th>
                          <th className="py-2.5 px-4 text-right">Max</th>
                          <th className="py-2.5 px-4 text-right">Matched</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        <tr>
                          <td className="py-2 px-4 font-semibold text-neutral-900">1. Varna</td>
                          <td className="py-2 px-4 text-neutral-500">Work, spiritual compatibility</td>
                          <td className="py-2 px-4 text-right font-mono tabular-nums text-neutral-500">1</td>
                          <td className="py-2 px-4 text-right font-mono tabular-nums font-bold text-emerald-600">{profile.kundli.breakdown.varna}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 font-semibold text-neutral-900">2. Vashya</td>
                          <td className="py-2 px-4 text-neutral-500">Dominance, mutual attraction</td>
                          <td className="py-2 px-4 text-right font-mono tabular-nums text-neutral-500">2</td>
                          <td className="py-2 px-4 text-right font-mono tabular-nums font-bold text-emerald-600">{profile.kundli.breakdown.vashya}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 font-semibold text-neutral-900">3. Tara</td>
                          <td className="py-2 px-4 text-neutral-500">Destiny, health and luck</td>
                          <td className="py-2 px-4 text-right font-mono tabular-nums text-neutral-500">3</td>
                          <td className="py-2 px-4 text-right font-mono tabular-nums font-bold text-emerald-600">{profile.kundli.breakdown.tara}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 font-semibold text-neutral-900">4. Yoni</td>
                          <td className="py-2 px-4 text-neutral-500">Biological and physical harmony</td>
                          <td className="py-2 px-4 text-right font-mono tabular-nums text-neutral-500">4</td>
                          <td className="py-2 px-4 text-right font-mono tabular-nums font-bold text-emerald-600">{profile.kundli.breakdown.yoni}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 font-semibold text-neutral-900">5. Graha Maitri</td>
                          <td className="py-2 px-4 text-neutral-500">Psychological and friendship rapport</td>
                          <td className="py-2 px-4 text-right font-mono tabular-nums text-neutral-500">5</td>
                          <td className="py-2 px-4 text-right font-mono tabular-nums font-bold text-emerald-600">{profile.kundli.breakdown.grahaMaitri}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 font-semibold text-neutral-900">6. Gana</td>
                          <td className="py-2 px-4 text-neutral-500">Temperament and behavioral sync</td>
                          <td className="py-2 px-4 text-right font-mono tabular-nums text-neutral-500">6</td>
                          <td className="py-2 px-4 text-right font-mono tabular-nums font-bold text-emerald-600">{profile.kundli.breakdown.gana}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 font-semibold text-neutral-900">7. Bhakoot</td>
                          <td className="py-2 px-4 text-neutral-500">Emotional bonding and family prosperity</td>
                          <td className="py-2 px-4 text-right font-mono tabular-nums text-neutral-500">7</td>
                          <td className="py-2 px-4 text-right font-mono tabular-nums font-bold text-emerald-600">{profile.kundli.breakdown.bhakoot}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 font-semibold text-neutral-900">8. Nadi</td>
                          <td className="py-2 px-4 text-neutral-500">Genetic compatibility and longevity</td>
                          <td className="py-2 px-4 text-right font-mono tabular-nums text-neutral-500">8</td>
                          <td className="py-2 px-4 text-right font-mono tabular-nums font-bold text-emerald-600">{profile.kundli.breakdown.nadi}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'family' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">Family Values & Heritage</h4>
                <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Family Status</span>
                    <span className="font-semibold text-neutral-900">{profile.family.familyStatus}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Family Type</span>
                    <span className="font-semibold text-neutral-900">{profile.family.familyType} Family</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Family Values</span>
                    <span className="font-semibold text-neutral-900">{profile.family.familyValues}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Father&apos;s Occupation</span>
                    <span className="font-semibold text-neutral-900">{profile.family.fatherOccupation}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Mother&apos;s Occupation</span>
                    <span className="font-semibold text-neutral-900">{profile.family.motherOccupation}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Brothers & Sisters</span>
                    <span className="font-semibold text-neutral-900">{profile.family.siblings}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-neutral-500">Native Ancestral Location</span>
                    <span className="font-semibold text-neutral-900">{profile.family.nativeLocation}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'expectations' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">What She / He is Looking For</h4>
                <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Preferred Age</span>
                    <span className="font-semibold text-neutral-900">{profile.expectations.ageRange}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Preferred Height</span>
                    <span className="font-semibold text-neutral-900">{profile.expectations.heightRange}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Marital Status</span>
                    <span className="font-semibold text-neutral-900">{profile.expectations.maritalStatus}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Community / Religion</span>
                    <span className="font-semibold text-neutral-900">{profile.expectations.religion} ({profile.expectations.motherTongue})</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Education Expectation</span>
                    <span className="font-semibold text-neutral-900">{profile.expectations.education}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Expected Annual Income</span>
                    <span className="font-semibold text-neutral-900">{profile.expectations.annualIncome}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-neutral-500">Diet</span>
                    <span className="font-semibold text-neutral-900">{profile.expectations.diet}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Direct Contact Reveal Card */}
            <div className="p-4 bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-amber-300">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Direct Contact Number & WhatsApp</span>
                </div>
                <p className="text-xs text-neutral-300">
                  {showContact
                    ? '+91 98112-XXXXX (Verified Mobile & Parent Contact)'
                    : 'Contact number is protected by couple.com privacy shield.'}
                </p>
              </div>

              {showContact ? (
                <div className="text-xs bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg">
                  +91 98112-45892 (Call / WhatsApp)
                </div>
              ) : hasPremium ? (
                <button
                  onClick={() => setShowContact(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  View Phone Number
                </button>
              ) : (
                <button
                  onClick={openUpgrade}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-neutral-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-md"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Upgrade to View Contact</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-3 sm:p-6 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between gap-2 sm:gap-4 shrink-0 safe-bottom">
          <button
            onClick={() => onToggleShortlist(profile.id)}
            className={`min-h-[44px] px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
              isShortlisted
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-current text-rose-600' : ''}`} />
            <span className="hidden sm:inline">{isShortlisted ? 'Shortlisted' : 'Shortlist Profile'}</span>
            <span className="sm:hidden">{isShortlisted ? 'Saved' : 'Save'}</span>
          </button>

          <div className="flex items-center gap-2">
            {connectionStatus === 'accepted' ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenChat(profile);
                }}
                className="min-h-[44px] px-4 sm:px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Chat</span>
              </button>
            ) : connectionStatus === 'pending' ? (
              <span className="min-h-[44px] px-4 sm:px-5 py-2 bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl flex items-center justify-center">
                Interest Sent
              </span>
            ) : (
              <button
                onClick={() => onConnect(profile)}
                className="min-h-[44px] px-4 sm:px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Connect</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
