import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Heart, ShieldCheck, Sparkles, User, BookOpen, Briefcase, Home } from 'lucide-react';
import { Gender, Profile } from '../types/matrimony';

interface RegistrationWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (newProfile: Partial<Profile>) => void;
}

export const RegistrationWizardModal: React.FC<RegistrationWizardModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
}) => {
  const [step, setStep] = useState(1);
  const [profileFor, setProfileFor] = useState<'Myself' | 'Son' | 'Daughter' | 'Sibling' | 'Friend'>('Myself');
  const [gender, setGender] = useState<Gender>('male');
  const [name, setName] = useState('');
  const [age, setAge] = useState(28);
  const [religion, setReligion] = useState('Hindu');
  const [caste, setCaste] = useState('');
  const [motherTongue, setMotherTongue] = useState('Hindi');
  const [city, setCity] = useState('New Delhi');
  const [education, setEducation] = useState('B.Tech / Engineering');
  const [college, setCollege] = useState('');
  const [profession, setProfession] = useState('Software Engineer');
  const [annualIncome, setAnnualIncome] = useState('₹20 - 25 LPA');
  const [diet, setDiet] = useState<'Vegetarian' | 'Non-Vegetarian' | 'Jain' | 'Eggetarian' | 'Vegan'>('Vegetarian');
  const [about, setAbout] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    // Complete registration
    const newProfile: Partial<Profile> = {
      name: name || 'Aarav Patel',
      gender,
      age: Number(age) || 28,
      religion,
      caste: caste || 'General',
      motherTongue,
      city,
      state: 'State',
      country: 'India',
      education,
      college: college || 'Premier Institute',
      profession,
      companyType: 'Leading Firm',
      annualIncome,
      diet,
      drinking: 'Never',
      smoking: 'No',
      about: about || 'Ambitious, grounded professional looking for a life partner with shared moral values and aspirations.',
      isVerified: true,
      verifiedDetails: ['Govt ID (Aadhaar) Verified', 'Education Verified', 'Mobile Verified'],
      compatibilityScore: 98,
      kundli: {
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
      family: {
        familyType: 'Nuclear',
        familyValues: 'Moderate',
        fatherOccupation: 'Executive in Public Sector',
        motherOccupation: 'Homemaker',
        siblings: '1 Sibling',
        nativeLocation: city,
        familyStatus: 'Upper Middle Class',
      },
      expectations: {
        ageRange: '24 - 30 yrs',
        heightRange: "5' 2\" to 5' 9\"",
        maritalStatus: 'Never Married',
        religion,
        motherTongue,
        education: 'Postgraduate / Professional degree',
        annualIncome: '₹12 LPA+',
        diet: 'Vegetarian or Eggetarian',
      },
      interests: ['Reading', 'Travel', 'Music', 'Fitness'],
    };

    onRegisterSuccess(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 h-[92vh] sm:h-auto sm:max-h-[85vh] flex flex-col my-0 sm:my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-neutral-200 bg-neutral-50 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-rose-600 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step {step} of 4 · Free Profile</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-serif">
              Join husbandwife.com
            </h3>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-100 h-1.5 shrink-0">
          <div
            className="bg-rose-600 h-1.5 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  This profile is being created for
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['Myself', 'Son', 'Daughter', 'Sibling', 'Friend'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setProfileFor(opt);
                        if (opt === 'Son') setGender('male');
                        if (opt === 'Daughter') setGender('female');
                      }}
                      className={`py-2 text-xs font-medium rounded-lg border text-center transition-all ${
                        profileFor === opt
                          ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold'
                          : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Gender
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-2 text-xs font-medium rounded-lg border text-center ${
                        gender === 'male' ? 'bg-rose-600 text-white font-bold' : 'border-neutral-200 text-neutral-700'
                      }`}
                    >
                      Male (Groom)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`py-2 text-xs font-medium rounded-lg border text-center ${
                        gender === 'female' ? 'bg-rose-600 text-white font-bold' : 'border-neutral-200 text-neutral-700'
                      }`}
                    >
                      Female (Bride)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={65}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Current Living City
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Delhi, Mumbai, Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-neutral-900"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <option value="Christian">Christian</option>
                    <option value="Jain">Jain</option>
                    <option value="Buddhist">Buddhist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Mother Tongue
                  </label>
                  <select
                    value={motherTongue}
                    onChange={(e) => setMotherTongue(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-800"
                  >
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
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Caste / Community (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Brahmin, Agarwal, Khatri, Maratha, Nair"
                  value={caste}
                  onChange={(e) => setCaste(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900"
                />
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600">
                🔒 We respect caste boundaries or inter-community preferences as configured in your profile. You can change this anytime.
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Highest Education Degree
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech, MBA, MD, CA, MS"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IIT, IIM, Delhi University"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Profession / Occupation
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Software Engineer"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
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
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
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
                      className={`py-2 text-xs font-medium rounded-lg border text-center ${
                        diet === d ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold' : 'border-neutral-200 text-neutral-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-neutral-700">
                    Apna Bio Likhein (About You & Partner Expectations) *
                  </label>
                  <span className="text-[10px] text-neutral-400 font-mono">{about.length} chars</span>
                </div>
                <textarea
                  rows={3}
                  required
                  placeholder="Apne baare me, apni hobbies, family values, aur aap kaisa jeevansathi chahte hain yaha detail me likhein..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full text-xs p-3 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setAbout('A balanced blend of modern progressive thinking and deep cultural roots. Enjoy quiet evenings with music, reading, and family dinners. Looking for a kind-hearted, educated partner.')}
                    className="text-[10px] px-2 py-1 bg-neutral-100 hover:bg-rose-50 hover:text-rose-700 text-neutral-600 rounded-md border border-neutral-200 transition-colors"
                  >
                    💡 Modern & Traditional
                  </button>
                  <button
                    type="button"
                    onClick={() => setAbout('Ambitious tech professional balancing high-growth career with family priorities. Passionate about fitness, traveling, and good conversations. Seeking an equally driven life companion.')}
                    className="text-[10px] px-2 py-1 bg-neutral-100 hover:bg-rose-50 hover:text-rose-700 text-neutral-600 rounded-md border border-neutral-200 transition-colors"
                  >
                    💡 Career & Family Focused
                  </button>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Free profile gets 100% Government ID verification and access to daily matches.</span>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <span />}

            <button
              type="submit"
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg shadow-md transition-colors flex items-center gap-2"
            >
              <span>{step === 4 ? 'Complete Registration & Browse' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
