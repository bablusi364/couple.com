import React, { useState } from 'react';
import { Search, ShieldCheck, Compass, Users } from 'lucide-react';
import { FilterState, Gender } from '../types/matrimony';
import { HERO_BANNER_IMG } from '../data/mockProfiles';

interface HeroSearchProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onSearch: () => void;
  openRegistration: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  filters,
  setFilters,
  onSearch,
  openRegistration,
}) => {
  const [lookingFor, setLookingFor] = useState<Gender>(filters.lookingFor);
  const [minAge, setMinAge] = useState<number>(filters.minAge);
  const [maxAge, setMaxAge] = useState<number>(filters.maxAge);
  const [religion, setReligion] = useState<string>(filters.religion);
  const [motherTongue, setMotherTongue] = useState<string>(filters.motherTongue);
  const [city, setCity] = useState<string>(filters.city);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      lookingFor,
      minAge,
      maxAge,
      religion,
      motherTongue,
      city,
      activeTab: 'all',
    }));
    onSearch();
  };

  return (
    <section className="relative overflow-hidden bg-neutral-900 border-b border-neutral-800">
      {/* Background Hero Image with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BANNER_IMG}
          alt="Happy newlywed couple celebrating their wedding"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-40 brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-3xl mb-8 sm:mb-10 text-center sm:text-left">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-rose-400 mb-2 sm:mb-3">
            Trusted Matrimonial & Matchmaking Network
          </p>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-serif text-balance leading-snug sm:leading-tight">
            Connecting Hearts, Heritage & Families.
          </h1>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
            Welcome to <span className="font-semibold text-white">couple.com</span>. Discover hand-verified biodatas, deep 36-Guna Kundli compatibility, and meaningful conversations built for lasting matrimony.
          </p>
        </div>

        {/* Shaadi.com iconic Interactive Quick-Search Bar */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-7 shadow-2xl border border-neutral-200">
          <form onSubmit={handleQuickSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              
              {/* Looking For */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-700">
                  I&apos;m looking for
                </label>
                <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-100 rounded-lg h-11 sm:h-9 items-center">
                  <button
                    type="button"
                    onClick={() => setLookingFor('female')}
                    className={`h-full text-xs font-medium rounded-md transition-all flex items-center justify-center ${
                      lookingFor === 'female'
                        ? 'bg-rose-600 text-white shadow-sm font-semibold'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Woman
                  </button>
                  <button
                    type="button"
                    onClick={() => setLookingFor('male')}
                    className={`h-full text-xs font-medium rounded-md transition-all flex items-center justify-center ${
                      lookingFor === 'male'
                        ? 'bg-rose-600 text-white shadow-sm font-semibold'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Man
                  </button>
                </div>
              </div>

              {/* Age Range */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-700">
                  Aged
                </label>
                <div className="flex items-center gap-1.5 h-11 sm:h-9">
                  <select
                    value={minAge}
                    onChange={(e) => setMinAge(Number(e.target.value))}
                    className="w-full h-full px-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium text-neutral-800"
                  >
                    {[20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((a) => (
                      <option key={a} value={a}>
                        {a} yrs
                      </option>
                    ))}
                  </select>
                  <span className="text-xs text-neutral-400 font-medium shrink-0">to</span>
                  <select
                    value={maxAge}
                    onChange={(e) => setMaxAge(Number(e.target.value))}
                    className="w-full h-full px-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium text-neutral-800"
                  >
                    {[25, 27, 29, 31, 33, 35, 38, 40, 45].map((a) => (
                      <option key={a} value={a}>
                        {a} yrs
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Religion */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-700">
                  Religion
                </label>
                <select
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  className="w-full h-11 sm:h-9 px-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium text-neutral-800"
                >
                  <option value="Any">Any Religion</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Christian">Christian</option>
                  <option value="Jain">Jain</option>
                  <option value="Buddhist">Buddhist</option>
                </select>
              </div>

              {/* Mother Tongue */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-700">
                  Mother Tongue
                </label>
                <select
                  value={motherTongue}
                  onChange={(e) => setMotherTongue(e.target.value)}
                  className="w-full h-11 sm:h-9 px-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium text-neutral-800"
                >
                  <option value="Any">Any Language</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Urdu">Urdu</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="English">English</option>
                </select>
              </div>

              {/* City / Location */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-700">
                  City / Location
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-11 sm:h-9 px-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium text-neutral-800"
                >
                  <option value="Any">All Cities</option>
                  <option value="New Delhi">Delhi NCR</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Pune">Pune</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Chandigarh">Chandigarh</option>
                </select>
              </div>

            </div>

            {/* Bottom action row inside search box */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-3 gap-3 border-t border-neutral-200">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-[11px] text-neutral-600">
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% ID Verified
                </span>
                <span aria-hidden="true" className="text-neutral-300">·</span>
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <Compass className="w-3.5 h-3.5 text-rose-600" />
                  36 Guna Kundli
                </span>
                <span aria-hidden="true" className="text-neutral-300">·</span>
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  Family Values
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Let&apos;s Begin</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Trust Badges Strip */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 text-white/90">
          <div className="p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-lg sm:text-2xl font-bold font-mono tabular-nums text-white">4.8M+</p>
            <p className="text-[10px] sm:text-xs text-neutral-400 mt-0.5">Verified Indian Profiles</p>
          </div>
          <div className="p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-lg sm:text-2xl font-bold font-mono tabular-nums text-rose-400">720K+</p>
            <p className="text-[10px] sm:text-xs text-neutral-400 mt-0.5">Successful Matches</p>
          </div>
          <div className="p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-lg sm:text-2xl font-bold font-mono tabular-nums text-white">100%</p>
            <p className="text-[10px] sm:text-xs text-neutral-400 mt-0.5">Aadhaar / ID Checked</p>
          </div>
          <div className="p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-lg sm:text-2xl font-bold font-mono tabular-nums text-amber-400">36 / 36</p>
            <p className="text-[10px] sm:text-xs text-neutral-400 mt-0.5">Vedic Guna Milan</p>
          </div>
        </div>

      </div>
    </section>
  );
};
