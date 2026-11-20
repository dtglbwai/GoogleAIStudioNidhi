import React, { useId } from 'react';

interface LogoIconProps {
  className?: string;
  style?: React.CSSProperties;
}

const LogoIcon: React.FC<LogoIconProps> = ({ className, style }) => {
  const uid = useId().replace(/:/g, '');
  const metalRimId = `logo-metal-rim-${uid}`;
  const extrudeWallId = `logo-extrude-wall-${uid}`;
  const coreSheenId = `logo-core-sheen-${uid}`;
  const glossSweepId = `logo-gloss-sweep-${uid}`;
  const embossFaceId = `logo-emboss-face-${uid}`;
  const shadowFilterId = `logo-3d-shadow-${uid}`;
  const shieldClipId = `logo-shield-clip-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={`text-primary shrink-0 select-none ${className || 'h-28 w-28'}`}
      viewBox="0 0 120 124"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        {/* Heavy cast 3D elevation shadow */}
        <filter id={shadowFilterId} x="-16%" y="-14%" width="132%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="3.6" floodColor="#020617" floodOpacity="0.48" />
          <feDropShadow dx="0" dy="2" stdDeviation="1" floodColor="#020617" floodOpacity="0.65" />
        </filter>

        {/* Thick stepped metallic extrusion wall */}
        <linearGradient id={extrudeWallId} x1="12" y1="60" x2="108" y2="122" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="45%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        {/* Ultra-sharp high-contrast brushed chrome bevel rim */}
        <linearGradient id={metalRimId} x1="8" y1="4" x2="112" y2="114" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="18%" stopColor="#f1f5f9" />
          <stop offset="42%" stopColor="#64748b" />
          <stop offset="56%" stopColor="#ffffff" />
          <stop offset="78%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        {/* Deep enamel dome over theme primary color */}
        <radialGradient id={coreSheenId} cx="34%" cy="22%" r="78%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.52" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0.58" />
        </radialGradient>

        {/* Razor-sharp mirror gloss sweep */}
        <linearGradient id={glossSweepId} x1="16" y1="12" x2="88" y2="76" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.72" />
          <stop offset="46%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Heavy high-luster silver chrome embossed face */}
        <linearGradient id={embossFaceId} x1="30" y1="22" x2="90" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="32%" stopColor="#f8fafc" />
          <stop offset="65%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        <clipPath id={shieldClipId}>
          <path d="M60 18 L95 32 L95 66 L60 97 L25 66 L25 32 Z" />
        </clipPath>
      </defs>

      <g filter={`url(#${shadowFilterId})`}>
        {/* Deep 7px physical 3D extrusion chassis */}
        <path
          d="M60 11 L111 31 L111 76 L60 120 L9 76 L9 31 Z"
          fill={`url(#${extrudeWallId})`}
          stroke="#020617"
          strokeWidth="1.5"
          strokeLinejoin="miter"
        />

        {/* Mid bevel thickness ledge */}
        <path
          d="M60 7 L111 27 L111 72 L60 116 L9 72 L9 27 Z"
          fill="#475569"
          stroke="#0f172a"
          strokeWidth="1.2"
          strokeLinejoin="miter"
        />

        {/* Thick chiseled metallic front bezel */}
        <path
          d="M60 4 L110 23 L110 68 L60 111 L10 68 L10 23 Z"
          fill={`url(#${metalRimId})`}
          stroke="#ffffff"
          strokeWidth="1.6"
          strokeLinejoin="miter"
        />

        {/* Crisp top specular edge & dark lower bevel */}
        <path
          d="M10 23 L60 4 L110 23"
          stroke="#ffffff"
          strokeWidth="2.4"
          strokeLinecap="square"
        />
        <path
          d="M10 68 L60 111 L110 68"
          stroke="#0f172a"
          strokeOpacity="0.82"
          strokeWidth="2.4"
          strokeLinecap="square"
        />

        {/* Thick inner chamfered enamel well */}
        <path
          d="M60 18 L95 32 L95 66 L60 97 L25 66 L25 32 Z"
          fill="currentColor"
          stroke="#0f172a"
          strokeOpacity="0.85"
          strokeWidth="2.4"
        />
        <path
          d="M60 18 L95 32 L95 66 L60 97 L25 66 L25 32 Z"
          fill={`url(#${coreSheenId})`}
        />

        {/* High-gloss diagonal reflection */}
        <path
          d="M12 12 L108 12 L78 62 L12 62 Z"
          fill={`url(#${glossSweepId})`}
          clipPath={`url(#${shieldClipId})`}
        />

        {/* 5px deep extruded drop wall beneath center monogram */}
        <g transform="translate(0, 5)">
          <path d="M60 22 L77 37 L60 52 L43 37 Z" fill="#020617" />
          <path d="M31 41 L54 41 L54 83 L38 72 L38 55 L31 55 Z" fill="#020617" />
          <path d="M89 41 L66 41 L66 83 L82 72 L82 55 L89 55 Z" fill="#020617" />
          <path d="M54 54 L66 54 L66 88 L60 94 L54 88 Z" fill="#020617" />
        </g>

        {/* Secondary mid-extrusion shoulder for heavy 3D depth */}
        <g transform="translate(0, 2.5)">
          <path d="M60 22 L77 37 L60 52 L43 37 Z" fill="#334155" />
          <path d="M31 41 L54 41 L54 83 L38 72 L38 55 L31 55 Z" fill="#334155" />
          <path d="M89 41 L66 41 L66 83 L82 72 L82 55 L89 55 Z" fill="#334155" />
          <path d="M54 54 L66 54 L66 88 L60 94 L54 88 Z" fill="#334155" />
        </g>

        {/* Thick chunky razor-sharp silver-chrome 3D foreground slabs */}
        <g>
          {/* Heavy Apex Diamond */}
          <path
            d="M60 21 L77 36 L60 51 L43 36 Z"
            fill={`url(#${embossFaceId})`}
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinejoin="miter"
          />
          {/* Heavy Left Wing Slab */}
          <path
            d="M31 40 L54 40 L54 82 L38 71 L38 54 L31 54 Z"
            fill={`url(#${embossFaceId})`}
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinejoin="miter"
          />
          {/* Heavy Right Wing Slab */}
          <path
            d="M89 40 L66 40 L66 82 L82 71 L82 54 L89 54 Z"
            fill={`url(#${embossFaceId})`}
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinejoin="miter"
          />
          {/* Thick Center Keystone Pillar */}
          <path
            d="M54 53 L66 53 L66 87 L60 93 L54 87 Z"
            fill={`url(#${embossFaceId})`}
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinejoin="miter"
          />
        </g>

        {/* Inner rim bright catchlight */}
        <path
          d="M60 19.5 L93.2 32.8 L93.2 65.2 L60 94.8 L26.8 65.2 L26.8 32.8 Z"
          stroke="#ffffff"
          strokeOpacity="0.52"
          strokeWidth="1.2"
        />
      </g>
    </svg>
  );
};

export default LogoIcon;
