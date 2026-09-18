/** Small line icons drawn in the brand's stroke weight - one per company value. */
const paths = {
  integrity: <path d="M16 3 6 7v8c0 7 4.6 11.5 10 14 5.4-2.5 10-7 10-14V7l-10-4Z" />,
  professionalism: (
    <>
      <rect x="4" y="9" width="24" height="18" rx="2" />
      <path d="M12 9V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M4 16h24" />
    </>
  ),
  accountability: (
    <>
      <circle cx="16" cy="16" r="12" />
      <path d="M16 9v7l5 3" />
    </>
  ),
  innovation: (
    <>
      <path d="M16 4a8 8 0 0 0-5 14.2V22h10v-3.8A8 8 0 0 0 16 4Z" />
      <path d="M13 26h6M14 29h4" />
    </>
  ),
  collaboration: (
    <>
      <circle cx="11" cy="12" r="4" />
      <circle cx="21" cy="12" r="4" />
      <path d="M4 26c0-4 3.1-7 7-7s7 3 7 7M18 19.4c1-.9 2.4-1.4 3.9-1.4 3.9 0 6.1 3 6.1 7" />
    </>
  ),
  'client-success': (
    <>
      <path d="M5 25 13 15l5 5 9-12" />
      <path d="M22 8h5v5" />
    </>
  )
};

const ValueIcon = ({ name = 'integrity', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {paths[name] || paths.integrity}
  </svg>
);

export default ValueIcon;
