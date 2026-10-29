import React from 'react';
import { Heart, ShieldCheck, Sparkles, Compass, CheckCircle2, Award, Quote } from 'lucide-react';

export const FOUNDER_IMAGE = '/assets/images/founder_bablu_rajput_1792828142206.jpg';

interface AboutFounderProps {
  onExploreMatches?: () => void;
}

export const AboutFounder: React.FC<AboutFounderProps> = ({ onExploreMatches }) => {
  return (
    <section id="about-founder" className="py-12 sm:py-20 bg-gradient-to-b from-white via-neutral-50/70 to-white border-t border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-rose-600 mb-2">
            The Vision Behind husbandwife.com
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900 font-serif">
            A Letter from our Founder
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 sm:mt-2">
            Bridging timeless cultural traditions with modern intelligence and authentic human empathy.
          </p>
        </div>

        {/* Editorial Letter Container */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Founder Profile & Vision Card */}
            <div className="lg:col-span-5 bg-neutral-950 text-white p-5 sm:p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-5 sm:space-y-6 relative z-10">
                <div className="relative aspect-[3/4] w-full max-w-[220px] sm:max-w-xs mx-auto rounded-2xl overflow-hidden border-2 border-neutral-800 shadow-2xl bg-neutral-900">
                  <img
                    src={FOUNDER_IMAGE}
                    alt="Bablu-Rajput, Founder & CEO of husbandwife.com"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/images/founder_bablu_rajput_1792828142206.jpg';
                    }}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-50" />
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Leadership & Vision</span>
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-white">
                    Bablu-Rajput
                  </h3>
                  <p className="text-xs text-neutral-400 font-medium">
                    Founder & Chief Executive Officer, husbandwife.com
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2 text-xs text-neutral-300">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold">
                    <Award className="w-4 h-4 shrink-0" />
                    <span>Unconditional Value Guarantee</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    &ldquo;Our promise is simple: We will always give you unmatched trust, verified integrity, and genuine support on your journey to find the one.&rdquo;
                  </p>
                </div>
              </div>

              {/* Founder Stats Mini-strip */}
              <div className="mt-8 pt-6 border-t border-neutral-800 grid grid-cols-2 gap-4 text-center sm:text-left relative z-10">
                <div>
                  <p className="text-xl font-bold font-mono text-white">4.8M+</p>
                  <p className="text-[11px] text-neutral-400">Verified Singles</p>
                </div>
                <div>
                  <p className="text-xl font-bold font-mono text-rose-400">720K+</p>
                  <p className="text-[11px] text-neutral-400">Lifelong Unions</p>
                </div>
              </div>

            </div>

            {/* Right Column: Founder's Full Letter with 3 Mandates */}
            <div className="lg:col-span-7 p-5 sm:p-10 lg:p-12 space-y-5 sm:space-y-6 flex flex-col justify-between">
              <div className="space-y-4 sm:space-y-5 text-neutral-700 text-xs sm:text-sm leading-relaxed">
                
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <span className="text-xs font-serif italic text-neutral-400">
                    A personal message from the Founder
                  </span>
                  <Quote className="w-6 h-6 text-rose-300 opacity-60" />
                </div>

                <p className="text-base font-semibold text-neutral-900 font-serif">
                  Dear,
                </p>

                <p>
                  Weddings are not just a day in our lives, they are the beautiful milestone that marks the beginning of a new journey. But before that day comes, there’s an equally important chapter: finding the person you want to share that journey with.
                </p>

                <p>
                  It’s one of life’s most meaningful decisions, and at <strong className="text-neutral-900 font-semibold">husbandwife.com</strong>, since 1997 we’ve understood how significant and life-changing this phase is. That’s why we’ve dedicated ourselves to making this journey easier, more meaningful, and without any limitations. We are committed to helping people find their soulmates no matter where in the world they are.
                </p>

                <p>
                  Over the years, millions have trusted <strong className="text-neutral-900 font-semibold">husbandwife.com</strong>, not just because of the technology we’ve built but because of the heart behind it. Today, we are at the perfect intersection of cutting-edge AI and human understanding. While our technology ensures smarter matches, greater privacy, and seamless experiences, our people ensure empathy, guidance, and the human touch that makes all the difference when it comes to matters of the heart.
                </p>

                {/* The Three Core Mandates */}
                <div className="pt-2 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider text-rose-700">
                    At the core of Team husbandwife.com are three clear mandates:
                  </h4>

                  <div className="space-y-3 pt-1">
                    <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                        01
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-neutral-900">Understanding you deeply</h5>
                        <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                          Through research and insights, we keep learning about the needs, dreams, and concerns of singles everywhere.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                        02
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-neutral-900">Creating a safe and superior experience</h5>
                        <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                          We zealously protect your privacy while ensuring your matchmaking journey feels fulfilling and respectful.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                        03
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-neutral-900">Empowering your choices</h5>
                        <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                          With easy-to-use features and tools, you stay in complete control as you connect with potential partners.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="pt-2">
                  These principles guide our vision — to make finding a life partner a trusted and joyful experience for everyone. They define our mission — to be the world’s most meaningful and effective matchmaking platform. And they fuel our confidence in offering an unconditional guarantee — a promise that we will always give you unmatched value and support on your journey.
                </p>

                <p className="italic text-neutral-900 font-medium">
                  &ldquo;As you take the first steps toward one of the most important decisions of your life, I hope husbandwife.com helps you not just find a match, but find the one.&rdquo;
                </p>
              </div>

              {/* Sign-off Block */}
              <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-serif text-neutral-500">With warm regards & blessings,</p>
                  <p className="text-lg font-bold font-serif text-neutral-950 mt-0.5">
                    Bablu-Rajput
                  </p>
                  <p className="text-[11px] text-rose-700 font-semibold">Founder, husbandwife.com</p>
                </div>

                {onExploreMatches && (
                  <button
                    onClick={onExploreMatches}
                    className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center justify-center"
                  >
                    Start Your Search on husbandwife.com
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
