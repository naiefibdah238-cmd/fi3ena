"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Animate progress bar to 100% over 2 seconds
    const start = performance.now();
    const duration = 2000;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        // Start fade out
        setTimeout(() => setFading(true), 200);
        setTimeout(() => setHidden(true), 900);
      }
    };

    requestAnimationFrame(tick);
  }, []);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(160deg, #FDF6F0 0%, #F5E0D3 60%, #EBC9B5 100%)",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.7s ease-in-out",
      }}
    >
      {/* Logo */}
      <div
        className="flex flex-col items-center gap-6"
        style={{
          transform: fading ? "scale(0.95)" : "scale(1)",
          transition: "transform 0.7s ease-in-out",
        }}
      >
        {/* SVG Storefront Logo */}
        <svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer glow circle */}
          <circle cx="70" cy="70" r="66" fill="#C75B3C" fillOpacity="0.10" />
          <circle cx="70" cy="70" r="58" fill="#C75B3C" fillOpacity="0.08" />

          {/* Main circle background */}
          <circle cx="70" cy="70" r="52" fill="white" />
          <circle cx="70" cy="70" r="52" stroke="#C75B3C" strokeWidth="2.5" />

          {/* Storefront body */}
          <rect x="34" y="68" width="72" height="38" rx="4" fill="#F5E8E3" />
          <rect x="34" y="68" width="72" height="38" rx="4" stroke="#C75B3C" strokeWidth="1.5" />

          {/* Awning / roof */}
          <path
            d="M28 68 Q70 48 112 68"
            fill="#C75B3C"
          />
          <path
            d="M28 68 Q70 48 112 68"
            stroke="#A34A2F"
            strokeWidth="1"
          />

          {/* Awning scallop edge */}
          <path
            d="M28 68 Q33 73 38 68 Q43 73 48 68 Q53 73 58 68 Q63 73 68 68 Q73 73 78 68 Q83 73 88 68 Q93 73 98 68 Q103 73 108 68 Q112 73 112 68"
            stroke="#A34A2F"
            strokeWidth="1.2"
            fill="#C75B3C"
          />

          {/* Door */}
          <rect x="60" y="82" width="20" height="24" rx="10" fill="white" stroke="#C75B3C" strokeWidth="1.5" />
          <circle cx="76" cy="95" r="1.5" fill="#C75B3C" />

          {/* Left window */}
          <rect x="38" y="76" width="16" height="12" rx="3" fill="white" stroke="#C75B3C" strokeWidth="1.2" />
          <line x1="46" y1="76" x2="46" y2="88" stroke="#C75B3C" strokeWidth="0.8" />
          <line x1="38" y1="82" x2="54" y2="82" stroke="#C75B3C" strokeWidth="0.8" />

          {/* Right window */}
          <rect x="86" y="76" width="16" height="12" rx="3" fill="white" stroke="#C75B3C" strokeWidth="1.2" />
          <line x1="94" y1="76" x2="94" y2="88" stroke="#C75B3C" strokeWidth="0.8" />
          <line x1="86" y1="82" x2="102" y2="82" stroke="#C75B3C" strokeWidth="0.8" />

          {/* Stars */}
          <text x="52" y="60" fontSize="9" textAnchor="middle" fill="#C75B3C">✦</text>
          <text x="88" y="58" fontSize="7" textAnchor="middle" fill="#C75B3C">✦</text>
          <text x="70" y="46" fontSize="6" textAnchor="middle" fill="#C75B3C">✦</text>
        </svg>

        {/* App name */}
        <div className="text-center">
          <h1
            className="text-5xl font-extrabold text-[#C75B3C]"
            style={{ letterSpacing: "0.02em", lineHeight: 1 }}
          >
            في عنا
          </h1>
          <p className="text-sm text-[#A34A2F] mt-5 font-medium">
            دليلك لمحلات البلد
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-48 mt-2">
          <div className="h-1.5 bg-[#EBC9B5] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C75B3C] rounded-full"
              style={{
                width: `${progress}%`,
                transition: "width 0.05s linear",
              }}
            />
          </div>
          <p className="text-center text-xs text-[#C75B3C] mt-2 font-semibold opacity-70">
            أم الفحم 🏘️
          </p>
        </div>
      </div>
    </div>
  );
}
