import { useState, useEffect } from "react";
import { X, Sparkles, Percent, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import siteLogo from "@/assets/infosecdairies-logo.png";

const PROMO_CODE = "UGADI2026";
const DISCOUNT_PERCENT = 50;

const PromoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(PROMO_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/10 bg-slate-950/90"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500" />
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white/80" />
        </button>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative p-7 text-center">
          <img
            src={siteLogo}
            alt="InfosecDairies"
            className="mx-auto h-9 w-auto object-contain mb-4"
          />
          {/* Icon */}
          <div className="mx-auto w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-7 h-7 text-cyan-300" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2">
            Ugadi Special Offer!
          </h2>

          {/* Discount Badge */}
          <div className="inline-flex items-center gap-2 bg-cyan-400/15 text-cyan-200 px-4 py-2 rounded-full font-bold text-lg mb-4 border border-cyan-400/20">
            <Percent className="w-5 h-5" />
            {DISCOUNT_PERCENT}% OFF
          </div>

          {/* Description */}
          <p className="text-white/80 mb-6">
            Get <span className="font-bold text-white">50% off</span> on all courses!
            Use the promo code below at checkout.
          </p>

          {/* Promo Code Box */}
          <div className="bg-white/5 backdrop-blur rounded-xl p-4 mb-4 border border-white/10">
            <p className="text-white/60 text-sm mb-2">Promo Code</p>
            <div className="flex items-center justify-center gap-3">
              <code className="text-2xl font-mono font-bold text-white tracking-wider">
                {PROMO_CODE}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyCode}
                className="text-white/80 hover:bg-white/10"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleClose}
            className="w-full bg-cyan-500 hover:bg-cyan-500/90 text-slate-950 font-semibold py-3"
          >
            Start Learning
          </Button>

          {/* Expiry note */}
          <p className="text-white/50 text-xs mt-4">
            Limited time offer
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;
