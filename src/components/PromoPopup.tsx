import { useState, useEffect } from "react";
import { X, Sparkles, Percent, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const PROMO_CODE = "UGADI2026";
const DISCOUNT_PERCENT = 50;

const PromoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if user has already closed the popup
    const hasSeenPopup = localStorage.getItem("promo_ugadi2026_seen");
    if (!hasSeenPopup) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("promo_ugadi2026_seen", "true");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(PROMO_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-gradient-to-br from-cyan-600 via-cyan-700 to-blue-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2">
            Ugadi Special Offer!
          </h2>

          {/* Discount Badge */}
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold text-lg mb-4">
            <Percent className="w-5 h-5" />
            {DISCOUNT_PERCENT}% OFF
          </div>

          {/* Description */}
          <p className="text-white/90 mb-6">
            Get <span className="font-bold text-yellow-300">50% off</span> on all courses! 
            Use the promo code below at checkout.
          </p>

          {/* Promo Code Box */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
            <p className="text-white/70 text-sm mb-2">Promo Code</p>
            <div className="flex items-center justify-center gap-3">
              <code className="text-2xl font-mono font-bold text-white tracking-wider">
                {PROMO_CODE}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyCode}
                className="text-white hover:bg-white/20"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleClose}
            className="w-full bg-white text-cyan-700 hover:bg-white/90 font-semibold py-3"
          >
            Start Learning
          </Button>

          {/* Expiry note */}
          <p className="text-white/60 text-xs mt-4">
            Limited time offer. Valid until April 30, 2026.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;
