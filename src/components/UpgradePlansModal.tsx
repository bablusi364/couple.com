import React, { useState } from 'react';
import { X, Check, Sparkles, ShieldCheck, Crown, Phone, MessageSquare, Award } from 'lucide-react';
import { MEMBERSHIP_PLANS } from '../data/mockProfiles';
import { MembershipPlan } from '../types/matrimony';

interface UpgradePlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: (plan: MembershipPlan) => void;
}

export const UpgradePlansModal: React.FC<UpgradePlansModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState('diamond');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setUpgraded(true);
      const plan = MEMBERSHIP_PLANS.find((p) => p.id === selectedPlanId) || MEMBERSHIP_PLANS[1];
      setTimeout(() => {
        onUpgradeSuccess(plan);
        onClose();
        setUpgraded(false);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 h-[92vh] sm:h-auto sm:max-h-[85vh] flex flex-col my-0 sm:my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-neutral-200 bg-gradient-to-r from-amber-50 to-rose-50 shrink-0">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 font-serif">
                husbandwife.com VIP Membership Plans
              </h3>
              <p className="text-[10px] sm:text-[11px] text-neutral-500 line-clamp-1">
                Unlock direct phone numbers, unlimited chats, and relationship manager assistance
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

        {upgraded ? (
          <div className="flex-1 overflow-y-auto p-8 sm:p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="text-2xl font-bold font-serif text-neutral-900">
              Welcome to husbandwife.com VIP!
            </h4>
            <p className="text-sm text-neutral-600 max-w-md mx-auto">
              Your VIP plan is active. All contact numbers, WhatsApp directs, and unlimited chats are now unlocked for your account.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
            
            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MEMBERSHIP_PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50/40 shadow-md ring-2 ring-rose-600/20'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                        Most Popular
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-neutral-900 font-serif">{plan.name}</h4>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-rose-600 bg-rose-600 text-white' : 'border-neutral-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="text-2xl font-extrabold font-mono tabular-nums text-neutral-900">
                          {plan.price}
                        </span>
                        <span className="text-xs text-neutral-500 font-medium ml-1.5">{plan.period}</span>
                      </div>

                      <div className="mt-4 pt-4 border-t border-neutral-200 space-y-2.5 text-xs text-neutral-700">
                        {plan.features.map((f, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-100 text-center">
                      <span className="text-[11px] font-mono tabular-nums font-semibold text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-md">
                        {plan.contactCredits} Contact Credits Included
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Money-Back Guarantee & Trust markers */}
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-semibold text-neutral-900">100% Privacy & Money-Back Assurance</p>
                  <p className="text-neutral-500 text-[11px]">
                    If you don&apos;t connect with at least 15 verified compatible matches in 30 days, get a full refund.
                  </p>
                </div>
              </div>

              <button
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="w-full sm:w-auto px-7 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isProcessing ? 'Activating VIP...' : 'Activate Selected Plan'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
