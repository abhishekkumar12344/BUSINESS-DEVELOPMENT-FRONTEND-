/**
 * The brand motif: the rising arc and meridian grid drawn from the Nisha logo.
 * Used as a background element in the hero and page headers.
 */
const GrowthArc = ({ className = '', showGlobe = true }) => (
  <svg className={className} viewBox="0 0 640 520" fill="none" aria-hidden="true" focusable="false">
    {showGlobe && (
      <g opacity="0.5" stroke="var(--gold)" strokeWidth="0.8">
        <circle cx="300" cy="230" r="160" opacity="0.55" />
        <ellipse cx="300" cy="230" rx="62" ry="160" opacity="0.4" />
        <ellipse cx="300" cy="230" rx="118" ry="160" opacity="0.3" />
        <line x1="140" y1="230" x2="460" y2="230" opacity="0.45" />
        <path d="M160 160 H440" opacity="0.3" />
        <path d="M160 300 H440" opacity="0.3" />
      </g>
    )}

    {/* Growth bars */}
    <g>
      <rect x="386" y="248" width="34" height="122" rx="3" fill="var(--green-growth)" opacity="0.85" />
      <rect x="432" y="202" width="34" height="168" rx="3" fill="var(--green-growth)" opacity="0.7" />
      <rect x="478" y="150" width="34" height="220" rx="3" fill="var(--green-growth)" opacity="0.55" />
    </g>

    {/* Gold rising arc */}
    <path
      d="M40 430 C 180 452, 356 400, 452 292 C 500 238, 528 182, 546 128"
      stroke="var(--gold)"
      strokeWidth="9"
      strokeLinecap="round"
    />
    <path d="M512 132 L556 112 L544 158 Z" fill="var(--gold)" />

    {/* Green sweep */}
    <path
      d="M24 470 C 190 500, 392 448, 500 330"
      stroke="var(--green-growth)"
      strokeWidth="5"
      strokeLinecap="round"
      opacity="0.75"
    />
  </svg>
);

export default GrowthArc;
