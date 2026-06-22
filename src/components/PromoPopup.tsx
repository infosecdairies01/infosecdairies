import { useEffect, useState } from "react";
import { X, Copy, Check, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "promo_popup_seen";
const PROMO_CODE = "INFOSEC10";
const DELAY_MS = 2000;

const PromoPopup = () => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(PROMO_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const claim = () => {
    dismiss();
    navigate("/courses");
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={dismiss}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "hsl(220 40% 6%)",
          border: "1px solid hsl(186 100% 42% / 0.5)",
          boxShadow:
            "0 0 40px hsl(186 100% 42% / 0.2), 0 0 80px hsl(186 100% 42% / 0.08), 0 25px 60px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hex bg pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yOCAwTDAgMjVWNzVMMjggMTAwTDU2IDc1VjI1WiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDBmZmM4IiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')",
            backgroundSize: "56px 100px",
          }}
        />

        {/* Animated scanline */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(transparent 50%, rgba(0,255,200,0.025) 50%)",
            backgroundSize: "100% 4px",
          }}
        />

        {/* Top glow bar */}
        <div
          className="h-1 w-full"
          style={{
            background:
              "linear-gradient(90deg, hsl(186 100% 42%), hsl(84 81% 44%), hsl(186 100% 42%))",
            backgroundSize: "200% auto",
            animation: "gradient-shift 3s linear infinite",
          }}
        />

        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative p-8 text-center space-y-6">
          {/* Icon + badge */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: "hsl(186 100% 42% / 0.15)",
                border: "1px solid hsl(186 100% 42% / 0.4)",
                boxShadow: "0 0 20px hsl(186 100% 42% / 0.2)",
              }}
            >
              <ShieldCheck
                className="w-7 h-7"
                style={{ color: "hsl(186 100% 42%)" }}
              />
            </div>

            <span
              className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
              style={{
                background: "hsl(84 81% 44% / 0.15)",
                border: "1px solid hsl(84 81% 44% / 0.4)",
                color: "hsl(84 81% 44%)",
              }}
            >
              Limited Time Offer
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">
              Exclusive Discount
            </p>
            <h2
              className="text-5xl font-extrabold gradient-text"
              style={{
                backgroundSize: "200% auto",
                animation: "gradient-shift 3s linear infinite",
              }}
            >
              50% OFF
            </h2>
            <p className="text-base text-foreground/80 leading-relaxed">
              Get 50% off on <span className="text-white font-semibold">any course</span> or the{" "}
              <span className="text-white font-semibold">All Courses Bundle</span>
            </p>
          </div>

          {/* Promo code pill */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Use code at checkout</p>
            <button
              onClick={copy}
              className="group w-full flex items-center justify-between px-5 py-3 rounded-xl transition-all duration-200"
              style={{
                background: "hsl(220 35% 10%)",
                border: "1px dashed hsl(186 100% 42% / 0.6)",
              }}
            >
              <span
                className="text-xl font-mono font-bold tracking-widest"
                style={{ color: "hsl(186 100% 42%)" }}
              >
                {PROMO_CODE}
              </span>
              <span
                className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                style={{
                  color: copied ? "hsl(84 81% 44%)" : "hsl(186 100% 42%)",
                }}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </span>
            </button>
          </div>

          {/* CTA */}
          <button
            onClick={claim}
            className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(135deg, hsl(186 100% 42%), hsl(84 81% 44%))",
              color: "hsl(220 40% 6%)",
              boxShadow: "0 4px 20px hsl(186 100% 42% / 0.35)",
            }}
          >
            Claim Discount → Explore Courses
          </button>

          <p className="text-xs text-muted-foreground">
            One-time use per account &nbsp;·&nbsp; All courses included
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;
