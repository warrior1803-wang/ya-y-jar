export default function JarSVG() {
  // Jar body path (shared between fill, clip, and outline layers)
  const jarPath =
    "M 52,42 L 108,42 L 108,57 C 108,77 142,63 142,84 L 142,168 Q 142,183 130,185 L 30,185 Q 18,183 18,168 L 18,84 C 18,63 52,77 52,57 Z";

  return (
    <svg
      width="160"
      height="200"
      viewBox="0 0 160 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Glass shimmer: left highlight → transparent → right shadow */}
        <linearGradient
          id="jg-glass"
          x1="18"
          y1="0"
          x2="142"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="rgba(255,255,255,0.62)" />
          <stop offset="20%" stopColor="rgba(255,255,255,0.07)" />
          <stop offset="76%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="100%" stopColor="rgba(237,217,200,0.32)" />
        </linearGradient>

        {/* Lid cap: top bright → bottom warm yellow */}
        <linearGradient
          id="jg-lid"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor="#FFE766" />
          <stop offset="100%" stopColor="#FFD41D" />
        </linearGradient>

        {/* Screw band: warm yellow → deeper */}
        <linearGradient
          id="jg-band"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor="#FFD41D" />
          <stop offset="100%" stopColor="#C9A200" />
        </linearGradient>

        {/* Clip path — keeps interior elements inside jar */}
        <clipPath id="jg-clip">
          <path d={jarPath} />
        </clipPath>
      </defs>

      {/* ── Jar glass base fill ── */}
      <path d={jarPath} fill="#FFF9F4" />

      {/* ── Interior: paper slips + glass overlay (clipped to jar shape) ── */}
      <g clipPath="url(#jg-clip)">
        {/* Warm inner tint */}
        <rect
          x="18"
          y="42"
          width="124"
          height="143"
          fill="rgba(253,245,238,0.55)"
        />

        {/* Paper slip 1 — left, tilted −8° */}
        <g transform="rotate(-8, 46, 158)">
          <rect
            x="34"
            y="148"
            width="24"
            height="20"
            rx="2"
            fill="rgba(249,168,117,0.42)"
            stroke="rgba(237,217,200,0.95)"
            strokeWidth="1"
          />
          <line
            x1="34"
            y1="157"
            x2="58"
            y2="157"
            stroke="rgba(237,217,200,0.80)"
            strokeWidth="0.9"
          />
        </g>

        {/* Paper slip 2 — center, tilted +5° */}
        <g transform="rotate(5, 80, 162)">
          <rect
            x="67"
            y="152"
            width="26"
            height="21"
            rx="2"
            fill="rgba(249,168,117,0.36)"
            stroke="rgba(237,217,200,0.95)"
            strokeWidth="1"
          />
          <line
            x1="67"
            y1="162"
            x2="93"
            y2="162"
            stroke="rgba(237,217,200,0.80)"
            strokeWidth="0.9"
          />
        </g>

        {/* Paper slip 3 — right, tilted −3° */}
        <g transform="rotate(-3, 112, 152)">
          <rect
            x="101"
            y="143"
            width="22"
            height="18"
            rx="2"
            fill="rgba(249,168,117,0.30)"
            stroke="rgba(237,217,200,0.95)"
            strokeWidth="1"
          />
          <line
            x1="101"
            y1="152"
            x2="123"
            y2="152"
            stroke="rgba(237,217,200,0.80)"
            strokeWidth="0.9"
          />
        </g>

        {/* Glass gradient overlay */}
        <path d={jarPath} fill="url(#jg-glass)" />

        {/* Left highlight strip — thin teardrop of white */}
        <path
          d="M 27,90 Q 22,130 28,172 Q 34,172 32,130 Q 30,90 27,90 Z"
          fill="rgba(255,255,255,0.52)"
        />
      </g>

      {/* ── Jar outline (drawn on top for crisp edge) ── */}
      <path
        d={jarPath}
        fill="none"
        stroke="#EDD9C8"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Shoulder ledge ring — subtle horizontal line just below shoulder */}
      <path
        d="M 21,97 Q 80,100 139,97"
        stroke="#EDD9C8"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.65"
      />

      {/* ── Lid band (screw ring) ── */}
      <rect
        x="38"
        y="27"
        width="84"
        height="17"
        rx="3.5"
        fill="url(#jg-band)"
        stroke="#C9A200"
        strokeWidth="1"
      />
      {/* Thread lines */}
      <line
        x1="39"
        y1="32.5"
        x2="121"
        y2="32.5"
        stroke="#C9A200"
        strokeWidth="0.9"
        opacity="0.45"
      />
      <line
        x1="39"
        y1="38"
        x2="121"
        y2="38"
        stroke="#C9A200"
        strokeWidth="0.9"
        opacity="0.45"
      />

      {/* ── Lid cap ── */}
      <rect
        x="42"
        y="8"
        width="76"
        height="21"
        rx="7"
        fill="url(#jg-lid)"
        stroke="#C9A200"
        strokeWidth="1"
      />
      {/* Lid cap highlight */}
      <rect
        x="48"
        y="11"
        width="64"
        height="7"
        rx="3.5"
        fill="rgba(255,255,255,0.38)"
      />

      {/* Neck collar ring (lip between lid band and jar mouth) */}
      <rect
        x="48"
        y="40"
        width="64"
        height="4"
        rx="1.5"
        fill="#FFF9F4"
        stroke="#EDD9C8"
        strokeWidth="1"
      />

      {/* Base reflection ellipse */}
      <ellipse cx="80" cy="187" rx="54" ry="5" fill="rgba(237,217,200,0.22)" />
    </svg>
  );
}
