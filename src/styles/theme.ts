// ── Brand color tokens ──────────────────────────────────────────────────────
// Single source of truth for all brand colors.
// Use in inline `style={{}}` props and in logic (e.g. chart / SVG fills).
// In Tailwind class strings use the named tokens:
//   bg-brand-red, text-brand-red, border-brand-red, hover:bg-brand-red-light
//   bg-brand-dark, text-brand-dark
//   bg-brand-page, bg-brand-alt

/** Primary accent — bright red */
export const RED           = '#f80000';

/** Red on hover / lighter variant */
export const RED_LIGHT     = '#ff3333';

/** Light-theme page background — off-white with graphite tint */
export const BG_PAGE       = '#F5F4F2';

/** Light-theme alternate background — slightly darker off-white */
export const BG_ALT        = '#EDECEA';

/** Light-theme primary text — near-black with graphite tint */
export const TEXT_DARK     = '#1A1A1B';

/** Dark-theme page background */
export const BG_DARK       = '#0d0d0d';

/** Dark-theme secondary background */
export const BG_DARK_ALT   = '#111111';

/** About-page graphite background */
export const BG_GRAPHITE   = '#0a0a0a';
