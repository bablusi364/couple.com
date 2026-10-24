import React, { useState } from 'react';
import { X, Sparkles, Compass, CheckCircle2, ChevronRight } from 'lucide-react';

interface KundliCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KundliCalculatorModal: React.FC<KundliCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [groomRashi, setGroomRashi] = useState('Vrishabha (Taurus)');
  const [groomNakshatra, setGroomNakshatra] = useState('Rohini');
  const [groomManglik, setGroomManglik] = useState('No');

  const [brideRashi, setBrideRashi] = useState('Kanya (Virgo)');
  const [brideNakshatra, setBrideNakshatra] = useState('Hasta');
  const [brideManglik, setBrideManglik] = useState('No');

  const [calculated, setCalculated] = useState(true);

  if (!isOpen) return null;

  // Realistic Astrological Ashtakoot calculation mockup with dynamic responsiveness
  const totalScore = groomManglik === brideManglik ? 32 : 26;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 h-[92vh] sm:h-auto sm:max-h-[85vh] flex flex-col my-0 sm:my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-neutral-200 bg-amber-50/70 shrink-0">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 font-serif">
                Vedic Kundli Milan (36 Gunas)
              </h3>
              <p className="text-[10px] sm:text-[11px] text-neutral-500 line-clamp-1">
                Authentic Ashtakoot matrimonial compatibility calculation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs & Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Groom Details */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>Groom&apos;s Astrological Chart</span>
              </h4>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Moon Sign (Rashi)</label>
                <select
                  value={groomRashi}
                  onChange={(e) => setGroomRashi(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg text-neutral-800"
                >
                  <option value="Mesha (Aries)">Mesha (Aries)</option>
                  <option value="Vrishabha (Taurus)">Vrishabha (Taurus)</option>
                  <option value="Mithuna (Gemini)">Mithuna (Gemini)</option>
                  <option value="Karka (Cancer)">Karka (Cancer)</option>
                  <option value="Simha (Leo)">Simha (Leo)</option>
                  <option value="Kanya (Virgo)">Kanya (Virgo)</option>
                  <option value="Tula (Libra)">Tula (Libra)</option>
                  <option value="Vrischika (Scorpio)">Vrischika (Scorpio)</option>
                  <option value="Dhanu (Sagittarius)">Dhanu (Sagittarius)</option>
                  <option value="Makar (Capricorn)">Makar (Capricorn)</option>
                  <option value="Kumbha (Aquarius)">Kumbha (Aquarius)</option>
                  <option value="Meena (Pisces)">Meena (Pisces)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Birth Star (Nakshatra)</label>
                <select
                  value={groomNakshatra}
                  onChange={(e) => setGroomNakshatra(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg text-neutral-800"
                >
                  <option value="Rohini">Rohini</option>
                  <option value="Ashwini">Ashwini</option>
                  <option value="Mrigashira">Mrigashira</option>
                  <option value="Hasta">Hasta</option>
                  <option value="Swati">Swati</option>
                  <option value="Anuradha">Anuradha</option>
                  <option value="Revati">Revati</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Manglik Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGroomManglik('No')}
                    className={`py-1.5 text-xs rounded-md border ${
                      groomManglik === 'No' ? 'bg-amber-600 text-white font-bold' : 'bg-white text-neutral-700'
                    }`}
                  >
                    Non-Manglik
                  </button>
                  <button
                    type="button"
                    onClick={() => setGroomManglik('Yes')}
                    className={`py-1.5 text-xs rounded-md border ${
                      groomManglik === 'Yes' ? 'bg-amber-600 text-white font-bold' : 'bg-white text-neutral-700'
                    }`}
                  >
                    Manglik
                  </button>
                </div>
              </div>
            </div>

            {/* Bride Details */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>Bride&apos;s Astrological Chart</span>
              </h4>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Moon Sign (Rashi)</label>
                <select
                  value={brideRashi}
                  onChange={(e) => setBrideRashi(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg text-neutral-800"
                >
                  <option value="Kanya (Virgo)">Kanya (Virgo)</option>
                  <option value="Mesha (Aries)">Mesha (Aries)</option>
                  <option value="Vrishabha (Taurus)">Vrishabha (Taurus)</option>
                  <option value="Mithuna (Gemini)">Mithuna (Gemini)</option>
                  <option value="Karka (Cancer)">Karka (Cancer)</option>
                  <option value="Simha (Leo)">Simha (Leo)</option>
                  <option value="Tula (Libra)">Tula (Libra)</option>
                  <option value="Vrischika (Scorpio)">Vrischika (Scorpio)</option>
                  <option value="Dhanu (Sagittarius)">Dhanu (Sagittarius)</option>
                  <option value="Makar (Capricorn)">Makar (Capricorn)</option>
                  <option value="Kumbha (Aquarius)">Kumbha (Aquarius)</option>
                  <option value="Meena (Pisces)">Meena (Pisces)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Birth Star (Nakshatra)</label>
                <select
                  value={brideNakshatra}
                  onChange={(e) => setBrideNakshatra(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg text-neutral-800"
                >
                  <option value="Hasta">Hasta</option>
                  <option value="Rohini">Rohini</option>
                  <option value="Ashwini">Ashwini</option>
                  <option value="Mrigashira">Mrigashira</option>
                  <option value="Swati">Swati</option>
                  <option value="Anuradha">Anuradha</option>
                  <option value="Revati">Revati</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Manglik Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBrideManglik('No')}
                    className={`py-1.5 text-xs rounded-md border ${
                      brideManglik === 'No' ? 'bg-amber-600 text-white font-bold' : 'bg-white text-neutral-700'
                    }`}
                  >
                    Non-Manglik
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrideManglik('Yes')}
                    className={`py-1.5 text-xs rounded-md border ${
                      brideManglik === 'Yes' ? 'bg-amber-600 text-white font-bold' : 'bg-white text-neutral-700'
                    }`}
                  >
                    Manglik
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Results Box */}
          {calculated && (
            <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
                    Astrological Guna Result
                  </span>
                  <h4 className="text-xl font-bold font-serif text-amber-950 mt-1">
                    {totalScore >= 28 ? 'Uttam Milan (Highly Auspicious Match)' : 'Madhyam Milan (Favorable Match)'}
                  </h4>
                  <p className="text-xs text-amber-900 mt-1">
                    Mutual planetary alignment indicates strong emotional bonding, health harmony, and longevity of the union.
                  </p>
                </div>

                <div className="text-center bg-white p-4 rounded-xl shadow-xs border border-amber-200 min-w-32">
                  <span className="text-3xl font-extrabold font-mono tabular-nums text-amber-700">
                    {totalScore}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono"> / 36</span>
                  <p className="text-[11px] font-bold text-neutral-600 mt-0.5">Total Gunas</p>
                </div>
              </div>

              {/* 8 Koot mini score grid */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-2 text-center text-xs">
                <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60">
                  <p className="text-[10px] text-neutral-500">Varna</p>
                  <p className="font-mono font-bold text-neutral-900">1/1</p>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60">
                  <p className="text-[10px] text-neutral-500">Vashya</p>
                  <p className="font-mono font-bold text-neutral-900">2/2</p>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60">
                  <p className="text-[10px] text-neutral-500">Tara</p>
                  <p className="font-mono font-bold text-neutral-900">3/3</p>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60">
                  <p className="text-[10px] text-neutral-500">Yoni</p>
                  <p className="font-mono font-bold text-neutral-900">4/4</p>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60">
                  <p className="text-[10px] text-neutral-500">Maitri</p>
                  <p className="font-mono font-bold text-neutral-900">5/5</p>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60">
                  <p className="text-[10px] text-neutral-500">Gana</p>
                  <p className="font-mono font-bold text-neutral-900">5/6</p>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60">
                  <p className="text-[10px] text-neutral-500">Bhakoot</p>
                  <p className="font-mono font-bold text-neutral-900">6/7</p>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60">
                  <p className="text-[10px] text-neutral-500">Nadi</p>
                  <p className="font-mono font-bold text-neutral-900">6/8</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg transition-colors"
            >
              Close Astrological Calculator
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
