// Line illustrations for option cards. The new work is shaded so people can see at a
// glance what each option adds to their home.
const NEW = { fill: "#dfe6d6", stroke: "currentColor" };
const OLD = { fill: "none", stroke: "currentColor" };

const svg = (children) => (
  <svg viewBox="0 0 120 72" fill="none" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
    {children}
  </svg>
);

// Plan views (from above) for extensions: main house, back addition and garden line.
const plan = (extra) =>
  svg(
    <>
      <path d="M8 66H112" stroke="currentColor" opacity="0.35" strokeDasharray="3 4" />
      <rect x="20" y="8" width="56" height="30" {...OLD} />
      <rect x="20" y="38" width="30" height="16" {...OLD} />
      {extra}
    </>,
  );

// Elevations (from the side) for lofts.
const house = (roof) =>
  svg(
    <>
      <path d="M22 66V36H98V66" {...OLD} />
      <path d="M44 66V52H56V66M70 46H84V56H70Z" stroke="currentColor" opacity="0.6" />
      {roof}
    </>,
  );

const ICONS = {
  rear: plan(<rect x="20" y="54" width="56" height="10" {...NEW} />),
  side: plan(<rect x="50" y="38" width="26" height="16" {...NEW} />),
  wrap: plan(<path d="M50 38H76V64H20V54H50Z" {...NEW} />),
  double: svg(
    <>
      <path d="M14 66V30L40 12L66 30V66" {...OLD} />
      <rect x="66" y="30" width="38" height="36" {...NEW} />
      <path d="M66 48H104" stroke="currentColor" />
    </>,
  ),
  basement: svg(
    <>
      <path d="M6 40H114" stroke="currentColor" opacity="0.5" />
      <path d="M26 40V18L60 4L94 18V40" {...OLD} />
      <rect x="26" y="40" width="68" height="26" {...NEW} />
    </>,
  ),
  velux: house(
    <>
      <path d="M18 36L60 10L102 36" {...OLD} />
      <path d="M68 20L76 25L73 30L65 25Z" {...NEW} />
    </>,
  ),
  rearDormer: house(
    <>
      <path d="M18 36L60 10L102 36" {...OLD} />
      <path d="M60 10H96V36H60" {...NEW} />
    </>,
  ),
  lShapedDormer: house(
    <>
      <path d="M18 36L54 12L90 36" {...OLD} />
      <path d="M54 12H86V36H54Z" {...NEW} />
      <path d="M86 24H106V36H86Z" {...NEW} />
    </>,
  ),
  hipToGable: house(
    <>
      <path d="M18 36L40 12" {...OLD} />
      <path d="M40 12H80L102 36V36" {...OLD} strokeDasharray="3 3" />
      <path d="M40 12H98V36" {...NEW} />
    </>,
  ),
  mansard: house(<path d="M24 36L32 10H88L96 36Z" {...NEW} />),
  kSingle: svg(
    <>
      <rect x="20" y="10" width="80" height="54" {...OLD} />
      <rect x="20" y="10" width="80" height="12" {...NEW} />
    </>,
  ),
  kGalley: svg(
    <>
      <rect x="20" y="10" width="80" height="54" {...OLD} />
      <rect x="20" y="10" width="80" height="12" {...NEW} />
      <rect x="20" y="52" width="80" height="12" {...NEW} />
    </>,
  ),
  kL: svg(
    <>
      <rect x="20" y="10" width="80" height="54" {...OLD} />
      <path d="M20 10H100V22H32V64H20Z" {...NEW} />
    </>,
  ),
  kU: svg(
    <>
      <rect x="20" y="10" width="80" height="54" {...OLD} />
      <path d="M20 10H100V64H88V22H32V64H20Z" {...NEW} />
    </>,
  ),
  cloakroom: svg(
    <>
      <rect x="34" y="8" width="52" height="58" {...OLD} />
      <path d="M44 18h12v10c0 6-12 6-12 0z" {...NEW} />
      <rect x="64" y="18" width="14" height="8" rx="2" {...NEW} />
    </>,
  ),
  ensuite: svg(
    <>
      <rect x="22" y="8" width="76" height="58" {...OLD} />
      <rect x="22" y="8" width="30" height="30" {...NEW} />
      <circle cx="37" cy="23" r="3" stroke="currentColor" />
      <path d="M62 18h12v10c0 6-12 6-12 0z" {...NEW} />
      <rect x="80" y="18" width="12" height="8" rx="2" {...NEW} />
    </>,
  ),
  family: svg(
    <>
      <rect x="14" y="8" width="92" height="58" {...OLD} />
      <rect x="14" y="8" width="56" height="20" rx="8" {...NEW} />
      <path d="M78 18h12v10c0 6-12 6-12 0z" {...NEW} />
      <rect x="80" y="44" width="16" height="10" rx="2" {...NEW} />
    </>,
  ),
  wetroom: svg(
    <>
      <rect x="18" y="8" width="84" height="58" {...OLD} />
      <rect x="18" y="8" width="48" height="58" {...NEW} />
      <path d="M36 46h12" stroke="currentColor" />
      <circle cx="42" cy="22" r="4" stroke="currentColor" />
      <path d="M78 18h12v10c0 6-12 6-12 0z" {...OLD} />
    </>,
  ),
};

export default function OptionIcon({ name, className }) {
  const icon = ICONS[name];
  return icon ? <span className={className}>{icon}</span> : null;
}
