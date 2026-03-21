import { SVGProps } from "react";

interface JarSVGProps extends SVGProps<SVGSVGElement> {
  noteCount?: number;
}

const notes = [
  {
    x: 130,
    y: 380,
    rotate: -12,
    w: 50,
    h: 38,
    fill: "url(#note1)",
    stroke: "#d4a060",
  },
  {
    x: 185,
    y: 390,
    rotate: 5,
    w: 48,
    h: 40,
    fill: "url(#note2)",
    stroke: "#e08090",
  },
  {
    x: 240,
    y: 375,
    rotate: 18,
    w: 46,
    h: 36,
    fill: "url(#note3)",
    stroke: "#7090c0",
  },
  {
    x: 150,
    y: 330,
    rotate: -8,
    w: 48,
    h: 35,
    fill: "url(#note4)",
    stroke: "#70a860",
  },
  {
    x: 210,
    y: 310,
    rotate: 14,
    w: 45,
    h: 50,
    fill: "url(#note5)",
    stroke: "#9080c0",
  },
  {
    x: 170,
    y: 355,
    rotate: -20,
    w: 44,
    h: 36,
    fill: "#fff8e8",
    stroke: "#c8a870",
  },
];

export default function JarSVG({ noteCount = 6, ...props }: JarSVGProps) {
  const visibleNotes = notes.slice(0, Math.min(noteCount, notes.length));

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 520"
      width={400}
      height={520}
      {...props}
    >
      <defs>
        <linearGradient id="jarBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8ddd0" stopOpacity={0.6} />
          <stop offset="30%" stopColor="#faf6f0" stopOpacity={0.3} />
          <stop offset="70%" stopColor="#faf6f0" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#e0d4c6" stopOpacity={0.5} />
        </linearGradient>
        <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5c842" />
          <stop offset="50%" stopColor="#e8b730" />
          <stop offset="100%" stopColor="#d4a520" />
        </linearGradient>
        <linearGradient id="lidTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fad961" />
          <stop offset="100%" stopColor="#f0c040" />
        </linearGradient>
        <linearGradient id="note1" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#fff5e0" />
          <stop offset="100%" stopColor="#ffe4b5" />
        </linearGradient>
        <linearGradient id="note2" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#ffe8ec" />
          <stop offset="100%" stopColor="#ffc9d4" />
        </linearGradient>
        <linearGradient id="note3" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#e0f0ff" />
          <stop offset="100%" stopColor="#b8d8f8" />
        </linearGradient>
        <linearGradient id="note4" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#e8ffe0" />
          <stop offset="100%" stopColor="#c0eab0" />
        </linearGradient>
        <linearGradient id="note5" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#f0e8ff" />
          <stop offset="100%" stopColor="#d4c0f0" />
        </linearGradient>
        <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx={205} cy={490} rx={120} ry={18} fill="#00000010" />

      {/* Jar body */}
      <path
        d="M 120 150 C 90 170, 75 210, 75 260 L 75 400 C 75 460, 120 480, 200 480 C 280 480, 325 460, 325 400 L 325 260 C 325 210, 310 170, 280 150 Z"
        fill="url(#jarBody)"
        stroke="#3a3a3a"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Glass highlight */}
      <path
        d="M 115 180 C 100 210, 95 250, 95 290 L 95 380 C 95 400, 100 410, 108 420"
        fill="none"
        stroke="url(#shine)"
        strokeWidth={8}
        strokeLinecap="round"
        opacity={0.7}
      />
      <ellipse
        cx={125}
        cy={200}
        rx={5}
        ry={12}
        fill="white"
        opacity={0.4}
        transform="rotate(-15,125,200)"
      />

      {/* Paper notes */}
      {visibleNotes.map((note, i) => (
        <g
          key={i}
          transform={`translate(${note.x}, ${note.y}) rotate(${note.rotate})`}
        >
          <rect
            x={0}
            y={0}
            width={note.w}
            height={note.h}
            rx={3}
            fill={note.fill}
            stroke={note.stroke}
            strokeWidth={1}
          />
          <line
            x1={7}
            y1={10}
            x2={note.w - 8}
            y2={10}
            stroke={`${note.stroke}80`}
            strokeWidth={1.5}
          />
          <line
            x1={7}
            y1={18}
            x2={note.w - 12}
            y2={18}
            stroke={`${note.stroke}60`}
            strokeWidth={1.5}
          />
          <line
            x1={7}
            y1={26}
            x2={note.w - 18}
            y2={26}
            stroke={`${note.stroke}40`}
            strokeWidth={1.5}
          />
        </g>
      ))}

      {/* Jar neck */}
      <path
        d="M 120 150 L 120 120 C 120 110, 130 105, 140 105 L 260 105 C 270 105, 280 110, 280 120 L 280 150"
        fill="url(#jarBody)"
        stroke="#3a3a3a"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Rim */}
      <rect
        x={115}
        y={100}
        width={170}
        height={18}
        rx={6}
        fill="#f8f0e0"
        stroke="#3a3a3a"
        strokeWidth={4}
      />

      {/* Lid */}
      <rect
        x={118}
        y={62}
        width={164}
        height={42}
        rx={8}
        fill="url(#lidGrad)"
        stroke="#3a3a3a"
        strokeWidth={4}
      />
      <ellipse
        cx={200}
        cy={65}
        rx={80}
        ry={12}
        fill="url(#lidTop)"
        stroke="#3a3a3a"
        strokeWidth={3.5}
      />
      <ellipse cx={185} cy={62} rx={40} ry={5} fill="white" opacity={0.25} />

      {/* Clasp */}
      <path
        d="M 190 118 L 190 130 C 190 140, 195 145, 200 145 C 205 145, 210 140, 210 130 L 210 118"
        fill="none"
        stroke="#3a3a3a"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <circle cx={190} cy={115} r={3.5} fill="#3a3a3a" />
      <circle cx={210} cy={115} r={3.5} fill="#3a3a3a" />
      <path
        d="M 280 115 L 295 115 C 302 115, 305 120, 302 127 L 290 140"
        fill="none"
        stroke="#3a3a3a"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
    </svg>
  );
}
