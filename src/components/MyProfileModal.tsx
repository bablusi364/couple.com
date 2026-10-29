import React, { useState, useRef } from 'react';
import { 
  X, User, Sparkles, ShieldCheck, Edit3, Camera, Save, Heart, 
  MapPin, Briefcase, GraduationCap, BookOpen, Check, RefreshCw, Upload, Eye
} from 'lucide-react';
import { Profile, Gender } from '../types/matrimony';

interface MyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  myProfile: Profile | null;
  onSaveProfile: (updatedProfile: Profile) => void;
  onOpenCreateNew: () => void;
}

const PRESET_MALE_PHOTOS = [
  '/assets/images/profile_rohit_1792826629953.jpg',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
];

const PRESET_FEMALE_PHOTOS = [
  '/assets/images/profile_ananya_1792826629253.jpg',
  '/assets/images/profile_meera_1792826629185.jpg',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
];

const BIO_TEMPLATES = [
  {
    title: 'Modern & Traditional Balance',
    text: 'A balanced blend of modern progressive thinking and deep cultural roots. I enjoy quiet evenings with classical music, reading, and weekend outdoor trips. Looking for a kind-hearted, educated partner who values family traditions and laughter.'
  },
  {
    title: 'Ambitious Career & Family Oriented',
    text: 'Working as an ambitious professional in a fast-paced environment while keeping family at the center of my life. Passionate about healthy living, traveling to new places, and good conversations over coffee. Seeking an equally driven life companion.'
  },
  {
    title: 'Creative & Warm-Hearted',
    text: 'Creative soul with an eye for design, culinary arts, and heartfelt relationships. Grounded, optimistic, and easygoing. I believe mutual respect, transparent communication, and shared dreams form the foundation of a joyful marriage.'
  }
];

export const MyProfileModal: React.FC<MyProfileModalProps> = ({
  isOpen,
  onClose,
  myProfile,
  onSaveProfile,
  onOpenCreateNew,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('edit');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states initialized with current profile or defaults
  const [name, setName] = useState(myProfile?.name || 'Aarav Patel');
  const [gender, setGender] = useState<Gender>(myProfile?.gender || 'male');
  const [age, setAge] = useState(myProfile?.age || 28);
  const [height, setHeight] = useState(myProfile?.height || "5' 10\" (178 cm)");
  const [religion, setReligion] = useState(myProfile?.religion || 'Hindu');
  const [caste, setCaste] = useState(myProfile?.caste || 'Brahmin');
  const [motherTongue, setMotherTongue] = useState(myProfile?.motherTongue || 'Hindi');
  const [city, setCity] = useState(myProfile?.city || 'New Delhi');
  const [state, setState] = useState(myProfile?.state || 'Delhi NCR');
  const [education, setEducation] = useState(myProfile?.education || 'B.Tech in Computer Science');
  const [college, setCollege] = useState(myProfile?.college || 'IIT Delhi');
  const [profession, setProfession] = useState(myProfile?.profession || 'Senior Software Engineer');
  const [annualIncome, setAnnualIncome] = useState(myProfile?.annualIncome || '₹28 - 32 LPA');
  const [diet, setDiet] = useState(myProfile?.diet || 'Vegetarian');
  const [about, setAbout] = useState(
    myProfile?.about || 
    'Namaste! I am a passionate, family-oriented individual who balances high-growth professional ambitions with deep cultural values. Looking for a genuine, understanding partner to share life\'s beautiful journey.'
  );
  const [photoUrl, setPhotoUrl] = useState(
    myProfile?.photos[0] || (gender === 'female' ? PRESET_FEMALE_PHOTOS[0] : PRESET_MALE_PHOTOS[0])
  );
  const [interestsInput, setInterestsInput] = useState(
    myProfile?.interests?.join(', ') || 'Reading, Traveling, Cooking, Fitness, Classical Music'
  );

  if (!isOpen) return null;

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Profile = {
      id: myProfile?.id || `user-profile-${Date.now()}`,
      name: name.trim() || 'Aarav Patel',
      gender,
      age: Number(age) || 28,
      height,
      religion,
      caste: caste || 'General',
      motherTongue,
      city: city || 'New Delhi',
      state: state || 'Delhi NCR',
      country: 'India',
      education: education || 'Graduate',
      college: college || 'University',
      profession: profession || 'Professional',
      companyType: myProfile?.companyType || 'Leading Organization',
      annualIncome: annualIncome || '₹15 - 20 LPA',
      diet,
      drinking: myProfile?.drinking || 'Never',
      smoking: myProfile?.smoking || 'No',
      about: about.trim(),
      photos: [photoUrl],
      isVerified: true,
      verifiedDetails: ['Govt ID (Aadhaar) Verified', 'Degree Verified', 'Mobile Verified'],
      lastActive: 'Active now',
      compatibilityScore: 98,
      kundli: myProfile?.kundli || {
        rashi: 'Simha (Leo)',
        nakshatra: 'Purva Phalguni',
        manglik: 'Non-Manglik',
        gunaScore: 33,
        breakdown: {
          varna: 1,
          vashya: 2,
          tara: 3,
          yoni: 4,
          grahaMaitri: 5,
          gana: 5,
          bhakoot: 6,
          nadi: 7,
        },
      },
      family: myProfile?.family || {
        familyType: 'Nuclear',
        familyValues: 'Moderate',
        fatherOccupation: 'Executive in Public Sector',
        motherOccupation: 'Homemaker',
        siblings: '1 Sibling',
        nativeLocation: city,
        familyStatus: 'Upper Middle Class',
      },
      expectations: myProfile?.expectations || {
        ageRange: '24 - 30 yrs',
        heightRange: "5' 2\" to 5' 9\"",
        maritalStatus: 'Never Married',
        religion,
        motherTongue,
        education: 'Graduate / Professional degree',
        annualIncome: '₹12 LPA+',
        diet: 'Vegetarian or Eggetarian',
      },
      interests: interestsInput.split(',').map((s) => s.trim()).filter(Boolean),
      isMyProfile: true,
      isUserCreated: true,
    };

    onSaveProfile(updated);
    setActiveTab('preview');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 h-[92vh] sm:h-auto sm:max-h-[90vh] flex flex-col my-0 sm:my-6">
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-serif">
                Mera Profile & Biodata Editor
              </h3>
              <p className="text-xs text-neutral-500">
                Apna bio likhein aur photos update karein
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab buttons */}
            <div className="flex bg-neutral-200/80 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
                  activeTab === 'edit' ? 'bg-white text-rose-600 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Bio</span>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
                  activeTab === 'preview' ? 'bg-white text-rose-600 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* TAB 1: EDIT BIO & PROFILE DETAILS */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Photo & Gender Selector Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative shrink-0">
                  <img
                    src={photoUrl}
                    alt={name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = gender === 'female'
                        ? PRESET_FEMALE_PHOTOS[0]
                        : PRESET_MALE_PHOTOS[0];
                    }}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white shadow-md bg-neutral-200"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload Custom Photo"
                    className="absolute -bottom-2 -right-2 p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg transition-transform active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex-1 space-y-3 text-center sm:text-left w-full">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Profile Photo</h4>
                    <p className="text-xs text-neutral-500">
                      Apni sundar photo upload karein ya niche diye presets me se select karein.
                    </p>
                  </div>

                  {/* Preset Photos Options */}
                  <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
                    <span className="text-[11px] font-medium text-neutral-500">Presets:</span>
                    {(gender === 'female' ? PRESET_FEMALE_PHOTOS : PRESET_MALE_PHOTOS).map((src, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPhotoUrl(src)}
                        className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all ${
                          photoUrl === src ? 'border-rose-600 scale-105' : 'border-neutral-300 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={src} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 bg-white border border-neutral-300 hover:border-rose-400 rounded-lg text-[11px] text-neutral-700 font-medium flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3 text-rose-600" />
                      <span>Upload from phone</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Gender (Boy / Girl) Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                  Profile Type / Gender (Ladka ya Ladki)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setGender('male');
                      if (photoUrl === PRESET_FEMALE_PHOTOS[0] || photoUrl === PRESET_FEMALE_PHOTOS[1]) {
                        setPhotoUrl(PRESET_MALE_PHOTOS[0]);
                      }
                    }}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-center gap-2 ${
                      gender === 'male'
                        ? 'bg-rose-600 border-rose-600 text-white shadow-md'
                        : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span>🤵 Ladka (Groom / Male Profile)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGender('female');
                      if (photoUrl === PRESET_MALE_PHOTOS[0] || photoUrl === PRESET_MALE_PHOTOS[1]) {
                        setPhotoUrl(PRESET_FEMALE_PHOTOS[0]);
                      }
                    }}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-center gap-2 ${
                      gender === 'female'
                        ? 'bg-rose-600 border-rose-600 text-white shadow-md'
                        : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span>👰 Ladki (Bride / Female Profile)</span>
                  </button>
                </div>
              </div>

              {/* Basic Details: Name, Age, Height */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Patel / Priya Sharma"
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Age (Years) *
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={70}
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Height
                  </label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 5' 6&quot; (168 cm)"
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900"
                  />
                </div>
              </div>

              {/* THE CORE BIO SECTION: "Apna Bio Likhe" */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Apna Bio Likhein (About You & Life Partner Dreams) *
                  </label>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {about.length} characters
                  </span>
                </div>

                <textarea
                  rows={4}
                  required
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Apne baare me, apni personality, hobbies, family values, aur aap kaisa jeevansathi chahte hain yaha detail me likhein..."
                  className="w-full text-xs p-3.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed shadow-xs"
                />

                {/* Instant Bio Helper Templates */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-semibold text-neutral-500 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    <span>Quick Bio Suggestions (Tap to paste):</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {BIO_TEMPLATES.map((tpl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAbout(tpl.text)}
                        className="text-left p-2.5 bg-neutral-50 hover:bg-rose-50/70 border border-neutral-200 hover:border-rose-300 rounded-xl transition-all"
                      >
                        <p className="text-[11px] font-bold text-neutral-900">{tpl.title}</p>
                        <p className="text-[10px] text-neutral-500 line-clamp-2 mt-0.5">{tpl.text}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Education & Profession */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Highest Education Degree
                  </label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="e.g. M.Tech, MBA, MD, B.Tech, CA"
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. IIT Delhi, IIM, Delhi University"
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Profession / Job
                  </label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Annual Income
                  </label>
                  <select
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-800"
                  >
                    <option value="₹7 - 10 LPA">₹7 - 10 LPA</option>
                    <option value="₹10 - 15 LPA">₹10 - 15 LPA</option>
                    <option value="₹15 - 20 LPA">₹15 - 20 LPA</option>
                    <option value="₹20 - 30 LPA">₹20 - 30 LPA</option>
                    <option value="₹30 - 50 LPA">₹30 - 50 LPA</option>
                    <option value="₹50 LPA+">₹50 LPA+</option>
                    <option value="$100k+">$100k+ (NRI)</option>
                  </select>
                </div>
              </div>

              {/* Religion, Caste, Mother Tongue, City */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Religion
                  </label>
                  <select
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-800"
                  >
                    <option value="Hindu">Hindu</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Jain">Jain</option>
                    <option value="Christian">Christian</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Parsi">Parsi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Caste / Community
                  </label>
                  <input
                    type="text"
                    value={caste}
                    onChange={(e) => setCaste(e.target.value)}
                    placeholder="e.g. Brahmin, Rajput, Agarwal"
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Mother Tongue
                  </label>
                  <input
                    type="text"
                    value={motherTongue}
                    onChange={(e) => setMotherTongue(e.target.value)}
                    placeholder="e.g. Hindi, Punjabi, Tamil"
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. New Delhi, Mumbai"
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900"
                  />
                </div>
              </div>

              {/* Dietary Preferences & Interests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Dietary Preference
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Vegetarian', 'Non-Vegetarian', 'Jain'] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDiet(d)}
                        className={`py-2 text-xs font-medium rounded-lg border text-center transition-all ${
                          diet === d ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold' : 'border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Hobbies & Interests (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={interestsInput}
                    onChange={(e) => setInterestsInput(e.target.value)}
                    placeholder="e.g. Yoga, Music, Reading, Traveling"
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={onOpenCreateNew}
                  className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Switch / Create New Profile</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Biodata & Bio</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 2: PREVIEW MODE (How other matches see this biodata) */}
          {activeTab === 'preview' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-gradient-to-br from-rose-50/70 via-white to-amber-50/40 p-5 sm:p-6 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-xs">
                <img
                  src={photoUrl}
                  alt={name}
                  referrerPolicy="no-referrer"
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover object-top border-2 border-white shadow-md bg-neutral-200 shrink-0"
                />

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-neutral-900">
                      {name}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] uppercase">
                      Your Live Profile
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      100% ID Verified
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 font-medium">
                    {age} yrs · {height} · {religion} ({caste}) · {motherTongue}
                  </p>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-neutral-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                      {profession} ({annualIncome})
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      {city}, India
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio Spotlight */}
              <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-2 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  About Me & Bio
                </h4>
                <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-sans">
                  {about}
                </p>
              </div>

              {/* Education & Career */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <p className="text-[11px] font-semibold text-neutral-500 uppercase">Education</p>
                  <p className="text-xs font-bold text-neutral-900">{education}</p>
                  <p className="text-xs text-neutral-600">{college}</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <p className="text-[11px] font-semibold text-neutral-500 uppercase">Lifestyle & Diet</p>
                  <p className="text-xs font-bold text-neutral-900">{diet} Diet</p>
                  <p className="text-xs text-neutral-600">Interests: {interestsInput}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className="px-5 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-rose-700"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit This Biodata</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
