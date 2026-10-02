/**
 * Original top-down sports car, pointing right (nose at x≈444).
 * Drawn as inline SVG so it stays crisp at any size and ships no image asset.
 */
export default function CarTopView({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 460 200"
      className={className}
      overflow="visible"
      role="img"
      aria-label="Sports car seen from above"
    >
      <defs>
        <linearGradient id="car-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9cac4" />
          <stop offset="0.22" stopColor="#f1f1ed" />
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="0.78" stopColor="#f1f1ed" />
          <stop offset="1" stopColor="#c9cac4" />
        </linearGradient>
        <linearGradient id="car-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1b1e22" />
          <stop offset="0.6" stopColor="#2a3037" />
          <stop offset="1" stopColor="#3a434d" />
        </linearGradient>
        <linearGradient id="car-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dcddd8" />
          <stop offset="0.5" stopColor="#fbfbf9" />
          <stop offset="1" stopColor="#dcddd8" />
        </linearGradient>
        <filter id="car-shadow" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <clipPath id="car-clip">
          <path d="M40 40C40 28 52 22 70 22L150 24C175 25 190 34 215 36L300 36C320 36 330 24 360 24L380 25C420 30 440 60 444 100C440 140 420 170 380 175L360 176C330 176 320 164 300 164L215 164C190 166 175 175 150 176L70 178C52 178 40 172 40 160C30 130 30 70 40 40Z" />
        </clipPath>
      </defs>

      {/* Soft ground shadow */}
      <rect x="34" y="26" width="414" height="160" rx="70" fill="#000" opacity="0.55" filter="url(#car-shadow)" />

      {/* Tyres peeking out from under the body */}
      <g fill="#0b0b0b">
        <rect x="74" y="14" width="64" height="22" rx="8" />
        <rect x="74" y="164" width="64" height="22" rx="8" />
        <rect x="326" y="16" width="62" height="20" rx="8" />
        <rect x="326" y="164" width="62" height="20" rx="8" />
      </g>

      {/* Body */}
      <path
        d="M40 40C40 28 52 22 70 22L150 24C175 25 190 34 215 36L300 36C320 36 330 24 360 24L380 25C420 30 440 60 444 100C440 140 420 170 380 175L360 176C330 176 320 164 300 164L215 164C190 166 175 175 150 176L70 178C52 178 40 172 40 160C30 130 30 70 40 40Z"
        fill="url(#car-body)"
      />

      <g clipPath="url(#car-clip)">
        {/* Racing stripes in the brand green */}
        <rect x="20" y="89" width="440" height="7" fill="#45db7d" />
        <rect x="20" y="104" width="440" height="7" fill="#45db7d" />

        {/* Rear diffuser */}
        <rect x="30" y="52" width="16" height="96" rx="6" fill="#26282b" />

        {/* Side intakes */}
        <path d="M222 42 L268 40 L262 48 L226 49Z" fill="#26282b" />
        <path d="M222 158 L268 160 L262 152 L226 151Z" fill="#26282b" />

        {/* Hood creases */}
        <path d="M330 52 C370 58 405 72 428 92" stroke="#c6c7c1" strokeWidth="2" fill="none" />
        <path d="M330 148 C370 142 405 128 428 108" stroke="#c6c7c1" strokeWidth="2" fill="none" />
      </g>

      {/* Glasshouse: rear window, side windows and windshield */}
      <path
        d="M158 70 C160 56 176 50 196 49 L282 49 C300 50 312 58 320 70 L326 100 L320 130 C312 142 300 150 282 151 L196 151 C176 150 160 144 158 130 Z"
        fill="url(#car-glass)"
      />
      {/* Roof panel */}
      <rect x="172" y="57" width="106" height="86" rx="20" fill="url(#car-roof)" />
      <rect x="172" y="89" width="106" height="7" fill="#45db7d" />
      <rect x="172" y="104" width="106" height="7" fill="#45db7d" />
      {/* Windshield reflection */}
      <path d="M298 62 L312 66 L316 92 L304 90Z" fill="#fff" opacity="0.12" />

      {/* Mirrors */}
      <ellipse cx="300" cy="40" rx="11" ry="7" fill="#e6e6e1" stroke="#26282b" strokeWidth="2" />
      <ellipse cx="300" cy="160" rx="11" ry="7" fill="#e6e6e1" stroke="#26282b" strokeWidth="2" />

      {/* Headlights */}
      <path d="M404 40 L426 56 L432 70 L414 62Z" fill="#e8f6ff" />
      <path d="M404 160 L426 144 L432 130 L414 138Z" fill="#e8f6ff" />

      {/* Tail lights */}
      <rect x="38" y="36" width="8" height="34" rx="4" fill="#ff3b3b" />
      <rect x="38" y="130" width="8" height="34" rx="4" fill="#ff3b3b" />
    </svg>
  );
}
