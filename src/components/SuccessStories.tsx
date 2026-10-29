import React from 'react';
import { Heart, Calendar, MapPin, Quote } from 'lucide-react';
import { SUCCESS_STORIES } from '../data/mockProfiles';

export const SuccessStories: React.FC = () => {
  return (
    <section className="bg-neutral-100/70 border-t border-b border-neutral-200 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-rose-600 mb-2">
            Real Couples · Eternal Bonds
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-serif">
            Over 720,000+ Happy Marriages Celebrated
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 sm:mt-2">
            Read heartwarming journeys of couples who found their soulmate through husbandwife.com&apos;s verified matchmaking.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
          {SUCCESS_STORIES.map((story) => (
            <article
              key={story.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.coupleNames}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold font-serif">{story.coupleNames}</h3>
                    <div className="flex items-center gap-3 text-xs text-neutral-300 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {story.weddingDate}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {story.city}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4">
                  <blockquote className="text-xs sm:text-sm text-neutral-700 italic leading-relaxed relative pl-3.5 sm:pl-4 border-l-2 border-rose-400">
                    &ldquo;{story.quote}&rdquo;
                  </blockquote>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {story.storySnippet}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-neutral-100">
                <div className="flex items-center justify-between text-xs text-rose-700 font-medium pt-3">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-current text-rose-500" />
                    <span>Verified husbandwife.com Match</span>
                  </span>
                  <span className="text-neutral-400">Ceremony Confirmed</span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
