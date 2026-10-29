import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, RotateCcw, ShieldCheck, Sparkles, MapPin, Search } from 'lucide-react';
import { FilterState, Profile } from '../types/matrimony';
import { ProfileCard } from './ProfileCard';

interface MatchFeedProps {
  profiles: Profile[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onViewDetails: (profile: Profile) => void;
  onConnect: (profile: Profile) => void;
  onToggleShortlist: (profileId: string) => void;
  onOpenChat: (profile: Profile) => void;
  shortlistedIds: string[];
  connections: Record<string, { status: 'pending' | 'accepted' | 'declined' }>;
  viewTitle?: string;
  isShortlistOnly?: boolean;
  onStartCall?: (profile: Profile, type: 'audio' | 'video') => void;
  onOpenEditProfile?: () => void;
  onOpenOneToOne?: (profile: Profile) => void;
}

export const MatchFeed: React.FC<MatchFeedProps> = ({
  profiles,
  filters,
  setFilters,
  onViewDetails,
  onConnect,
  onToggleShortlist,
  onOpenChat,
  shortlistedIds,
  connections,
  viewTitle = 'Verified Matches for You',
  isShortlistOnly = false,
  onStartCall,
  onOpenEditProfile,
  onOpenOneToOne,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Memoized filtering logic for instantaneous 60fps search and filter transitions
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
    // If shortlist view
    if (isShortlistOnly && !shortlistedIds.includes(p.id)) {
      return false;
    }

    // Looking for gender
    if (filters.lookingFor !== 'all' && p.gender !== filters.lookingFor) {
      return false;
    }

    // Age
    if (p.age < filters.minAge || p.age > filters.maxAge) {
      return false;
    }

    // Religion
    if (filters.religion !== 'Any' && p.religion !== filters.religion) {
      return false;
    }

    // Mother Tongue
    if (filters.motherTongue !== 'Any' && p.motherTongue !== filters.motherTongue) {
      return false;
    }

    // City
    if (filters.city !== 'Any' && p.city !== filters.city) {
      return false;
    }

    // Diet
    if (filters.diet !== 'Any' && p.diet !== filters.diet) {
      return false;
    }

    // Manglik
    if (filters.manglik !== 'Any' && p.kundli.manglik !== filters.manglik) {
      return false;
    }

    // Verified only
    if (filters.verifiedOnly && !p.isVerified) {
      return false;
    }

    // Tab filters
    if (filters.activeTab === 'recommended' && p.compatibilityScore < 93) {
      return false;
    }
    if (filters.activeTab === 'nearMe' && !['New Delhi', 'Bengaluru', 'Mumbai'].includes(p.city)) {
      return false;
    }
    if (filters.activeTab === 'verified' && !p.isVerified) {
      return false;
    }
    if (filters.activeTab === 'astro' && p.kundli.gunaScore < 30) {
      return false;
    }

    // Search query (text search for profession, caste, college, city)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${p.name} ${p.profession} ${p.caste} ${p.city} ${p.education} ${p.college}`.toLowerCase();
      if (!matchText.includes(q)) {
        return false;
      }
    }

    return true;
    });
  }, [profiles, filters, isShortlistOnly, shortlistedIds, searchQuery]);

  const resetFilters = () => {
    setFilters({
      lookingFor: filters.lookingFor,
      minAge: 21,
      maxAge: 35,
      religion: 'Any',
      motherTongue: 'Any',
      city: 'Any',
      education: 'Any',
      profession: 'Any',
      diet: 'Any',
      manglik: 'Any',
      minIncome: 'Any',
      verifiedOnly: false,
      activeTab: 'all',
    });
    setSearchQuery('');
  };

  return (
    <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      {/* Header and Gender Target Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-neutral-200">
        <div>
          <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-serif">
            {viewTitle}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Displaying <span className="font-mono tabular-nums font-semibold text-neutral-900">{filteredProfiles.length}</span> curated profiles matching your life partner preferences.
          </p>
        </div>

        {/* Gender Seeker toggle button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-neutral-500 font-medium">Browse:</span>
          <div className="flex items-center p-1 bg-neutral-100 rounded-lg">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, lookingFor: 'female' }))}
              className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                filters.lookingFor === 'female'
                  ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Brides (दुल्हन)
            </button>
            <button
              onClick={() => setFilters((prev) => ({ ...prev, lookingFor: 'male' }))}
              className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                filters.lookingFor === 'male'
                  ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Grooms (दूल्हा)
            </button>
            <button
              onClick={() => setFilters((prev) => ({ ...prev, lookingFor: 'all' }))}
              className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                filters.lookingFor === 'all'
                  ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All (सभी)
            </button>
          </div>
        </div>
      </div>

      {/* Segmented Filter Bar & Search Tools */}
      <div className="mt-5 space-y-3">
        {/* Horizontal Scrolling Segmented Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl overflow-x-auto scroll-smooth whitespace-nowrap" style={{ WebkitOverflowScrolling: 'touch' }}>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, activeTab: 'all' }))}
            className={`min-h-[38px] px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 ${
              filters.activeTab === 'all'
                ? 'bg-white text-neutral-950 shadow-sm font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All Matches
          </button>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, activeTab: 'recommended' }))}
            className={`min-h-[38px] px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              filters.activeTab === 'recommended'
                ? 'bg-white text-rose-700 shadow-sm font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Daily Recommendations</span>
          </button>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, activeTab: 'astro' }))}
            className={`min-h-[38px] px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 ${
              filters.activeTab === 'astro'
                ? 'bg-white text-neutral-950 shadow-sm font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Kundli Milan (30+ Gunas)
          </button>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, activeTab: 'verified' }))}
            className={`min-h-[38px] px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              filters.activeTab === 'verified'
                ? 'bg-white text-emerald-800 shadow-sm font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Govt ID Verified</span>
          </button>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, activeTab: 'nearMe' }))}
            className={`min-h-[38px] px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              filters.activeTab === 'nearMe'
                ? 'bg-white text-neutral-950 shadow-sm font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <span>Metro Cities</span>
          </button>
        </div>

        {/* Search input and advanced toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search profession, college, caste, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[44px] pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-neutral-900 shadow-xs"
            />
          </div>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`min-h-[44px] px-3 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 shadow-xs ${
              showAdvancedFilters
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <button
            onClick={resetFilters}
            title="Reset Filters"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-xl border border-neutral-300 transition-colors shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Filter Tray */}
      {showAdvancedFilters && (
        <div className="mt-3 p-4 sm:p-5 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Diet Preference</label>
              <select
                value={filters.diet}
                onChange={(e) => setFilters((prev) => ({ ...prev, diet: e.target.value }))}
                className="w-full min-h-[42px] text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800"
              >
                <option value="Any">Any Diet</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Jain">Jain Vegetarian</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Manglik Status</label>
              <select
                value={filters.manglik}
                onChange={(e) => setFilters((prev) => ({ ...prev, manglik: e.target.value }))}
                className="w-full min-h-[42px] text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800"
              >
                <option value="Any">Doesn&apos;t Matter</option>
                <option value="Non-Manglik">Non-Manglik Only</option>
                <option value="Manglik">Manglik</option>
                <option value="Anshik Manglik">Anshik Manglik</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Religion</label>
              <select
                value={filters.religion}
                onChange={(e) => setFilters((prev) => ({ ...prev, religion: e.target.value }))}
                className="w-full min-h-[42px] text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800"
              >
                <option value="Any">Any Religion</option>
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Sikh">Sikh</option>
                <option value="Jain">Jain</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Mother Tongue</label>
              <select
                value={filters.motherTongue}
                onChange={(e) => setFilters((prev) => ({ ...prev, motherTongue: e.target.value }))}
                className="w-full min-h-[42px] text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800"
              >
                <option value="Any">Any Language</option>
                <option value="Hindi">Hindi</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Tamil">Tamil</option>
                <option value="Marathi">Marathi</option>
                <option value="Urdu">Urdu</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">City</label>
              <select
                value={filters.city}
                onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                className="w-full min-h-[42px] text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800"
              >
                <option value="Any">All Cities</option>
                <option value="New Delhi">New Delhi</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            <div className="flex items-center min-h-[44px]">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-700">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => setFilters((prev) => ({ ...prev, verifiedOnly: e.target.checked }))}
                  className="rounded border-neutral-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <span>Govt ID Verified Only</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Profile Cards Grid */}
      <div className="mt-6 sm:mt-8">
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onViewDetails={onViewDetails}
                onConnect={onConnect}
                onToggleShortlist={onToggleShortlist}
                onOpenChat={onOpenChat}
                isShortlisted={shortlistedIds.includes(profile.id)}
                connectionStatus={connections[profile.id]?.status}
                onStartCall={onStartCall}
                onOpenEditProfile={onOpenEditProfile}
                onOpenOneToOne={onOpenOneToOne}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 sm:py-16 text-center bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8">
            <p className="text-sm sm:text-base font-semibold text-neutral-900 font-serif">
              No profiles match your specific filter criteria
            </p>
            <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
              Try adjusting your age limit, religion, or language filters, or reset to discover all handpicked matches.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors min-h-[44px]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

    </section>
  );
};
