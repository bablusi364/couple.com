export type Gender = 'male' | 'female';

export interface KundliDetails {
  rashi: string;
  nakshatra: string;
  manglik: 'Non-Manglik' | 'Manglik' | 'Anshik Manglik';
  gunaScore: number; // out of 36
  breakdown: {
    varna: number; // max 1
    vashya: number; // max 2
    tara: number; // max 3
    yoni: number; // max 4
    grahaMaitri: number; // max 5
    gana: number; // max 6
    bhakoot: number; // max 7
    nadi: number; // max 8
  };
}

export interface FamilyDetails {
  familyType: 'Nuclear' | 'Joint';
  familyValues: 'Traditional' | 'Moderate' | 'Liberal';
  fatherOccupation: string;
  motherOccupation: string;
  siblings: string;
  nativeLocation: string;
  familyStatus: 'Middle Class' | 'Upper Middle Class' | 'Affluent';
}

export interface PartnerExpectations {
  ageRange: string;
  heightRange: string;
  maritalStatus: string;
  religion: string;
  motherTongue: string;
  education: string;
  annualIncome: string;
  diet: string;
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  height: string; // e.g. "5' 6\" (168 cm)"
  religion: string;
  caste: string;
  motherTongue: string;
  city: string;
  state: string;
  country: string;
  education: string;
  college: string;
  profession: string;
  companyType: string; // e.g. "Top Tech MNC", "Private Firm", "Government", "Own Venture"
  annualIncome: string;
  diet: 'Vegetarian' | 'Non-Vegetarian' | 'Jain' | 'Eggetarian' | 'Vegan';
  drinking: 'Never' | 'Occasionally' | 'Yes';
  smoking: 'No' | 'Occasionally' | 'Yes';
  about: string;
  photos: string[];
  isVerified: boolean;
  verifiedDetails: string[]; // ['Govt ID Verified', 'Education Verified', 'Mobile Verified']
  lastActive: string;
  compatibilityScore: number; // 0-100%
  kundli: KundliDetails;
  family: FamilyDetails;
  expectations: PartnerExpectations;
  interests: string[];
  isPremium?: boolean;
}

export interface FilterState {
  lookingFor: Gender;
  minAge: number;
  maxAge: number;
  religion: string;
  motherTongue: string;
  city: string;
  education: string;
  profession: string;
  diet: string;
  manglik: string;
  minIncome: string;
  verifiedOnly: boolean;
  activeTab: 'all' | 'recommended' | 'nearMe' | 'verified' | 'astro';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
}

export interface Connection {
  profileId: string;
  status: 'pending' | 'accepted' | 'declined';
  sentAt: string;
  messages: ChatMessage[];
  contactRevealed?: boolean;
}

export interface LiveSession {
  id: string;
  title: string;
  category: string;
  startTime: string;
  participantsCount: number;
  status: 'live' | 'upcoming';
  description: string;
  host: string;
}

export interface SuccessStory {
  id: string;
  coupleNames: string;
  weddingDate: string;
  city: string;
  image: string;
  quote: string;
  storySnippet: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  popular?: boolean;
  features: string[];
  contactCredits: number;
  badgeColor: string;
}
