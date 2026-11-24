---
name: Tactual Editorial
colors:
  surface: '#fff8f3'
  surface-dim: '#e3d8cd'
  surface-bright: '#fff8f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fdf2e6'
  surface-container: '#f7ece1'
  surface-container-high: '#f1e7db'
  surface-container-highest: '#ebe1d5'
  on-surface: '#1f1b14'
  on-surface-variant: '#4d4540'
  inverse-surface: '#353028'
  inverse-on-surface: '#faefe3'
  outline: '#7e7570'
  outline-variant: '#d0c4be'
  surface-tint: '#625d5b'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1e1b19'
  on-primary-container: '#888380'
  inverse-primary: '#ccc5c2'
  secondary: '#815500'
  on-secondary: '#ffffff'
  secondary-container: '#ffb94d'
  on-secondary-container: '#724a00'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002019'
  on-tertiary-container: '#558f7e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9e1dd'
  primary-fixed-dim: '#ccc5c2'
  on-primary-fixed: '#1e1b19'
  on-primary-fixed-variant: '#4a4643'
  secondary-fixed: '#ffddb2'
  secondary-fixed-dim: '#ffb94d'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#624000'
  tertiary-fixed: '#b3efdb'
  tertiary-fixed-dim: '#97d2bf'
  on-tertiary-fixed: '#002019'
  on-tertiary-fixed-variant: '#115042'
  background: '#fff8f3'
  on-background: '#1f1b14'
  surface-variant: '#ebe1d5'
typography:
  display:
    fontFamily: Newsreader
    fontSize: 44px
    fontWeight: '400'
    lineHeight: 52px
    letterSpacing: -0.01em
  display-mobile:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 34px
    fontWeight: '400'
    lineHeight: 42px
    letterSpacing: 0em
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 26px
    fontWeight: '400'
    lineHeight: 34px
    letterSpacing: 0em
  headline-md:
    fontFamily: Newsreader
    fontSize: 26px
    fontWeight: '400'
    lineHeight: 34px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Newsreader
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
    letterSpacing: 0.02em
  body-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0.02em
  body-sm:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.03em
  label-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.75rem
  space-xl: 3rem
---

## Brand & Style

This design system is conceived for specialized typhlological and pre-Braille graphic tools. It merges high-end editorial book design with rigorous accessibility standards (targeting strict WCAG AAA contrast and spatial legibility). The target audience spans low-vision users, blind practitioners, typhlology educators, tactile graphic transcribers, and accessibility engineers.

The emotional core is quiet, scholarly, and dignified. It eschews generic medical or clinical tropes in favor of an artisanal, bookbinding aesthetic inspired by heavy rag paper, debossing, hot-metal stamping, and swell-paper (PIAF) printing plates.

Key stylistic principles:
- **Paper & Plate Metaphor:** Interfaces model tactile surfaces. Cards and working canvases are treated as physical sheets laid atop a warm drafting surface.
- **Architectural Crispness:** Depth is created exclusively through fine structural line work (blind deboss / score lines) rather than blurred, simulated drop shadows.
- **Generous Spatial Rhythm:** Layouts reserve at least 35% negative space to reduce cognitive friction and ensure distinct visual/haptic landmarks for magnification and screen reader users.
- **Uncompromising Clarity:** High-contrast pigment calibration ensures that monochrome plates retain absolute fidelity when converted to microcapsule swell paper (100% K ink).

## Colors

The palette is anchored in raw materials: bone china, rag cotton, mineral carbon, and vegetal dyes. Color is applied with restraint to preserve structural legibility and prevent fatigue.

- **Primary (`#1C1917` - Deep Carbon):** Pure carbon pigment for maximum contrast on light backgrounds (exceeding 13:1 contrast ratio against ivory). In the canvas view, this color functions as pure process black (100% K) intended for thermal expansion in PIAF machines.
- **Secondary (`#C88A1E` - Warm Ochre):** Used for deliberate high-visibility focus indicators, active selection frames, and progressive touch-tracking modes. Delivers over 4.5:1 contrast against white surfaces and serves as an unequivocal optical anchor.
- **Tertiary (`#235E4F` - Deep Sage):** Applied to tactile validation checkpoints, affirmative confirmations, and successful Braille node completions. Exceeds 7:1 against both ivory and pure white.
- **Neutral (`#686158` - Stone Grey):** Reserved for secondary metadata, structural labels, tactile coordinate indices, and non-interactive grid markings. Meets WCAG AAA requirements for large text and AA for standard body text.
- **Surface Accents:** The global canvas foundation is warm ivory paper (`#F8F5EF`), supporting clean sheets of stark white (`#FFFFFF`). Line dividers and debossed borders utilize `#DFD7C8`, creating clean optical separations without drop shadows.

## Typography

The typographic system pairs an authoritative, literary serif for editorial structure with an ultra-legible grotesque optimized specifically for visual impairment.

- **Headlines & Display (`Newsreader`):** Imparts dignity, intellectual authority, and high craft. Used in light and regular weights, occasionally paired with subtle italic variations for tiflological terms or specimen metadata. It must never be set below 20px.
- **Reading, Controls & Data (`Atkinson Hyperlegible Next`):** Designed to unambiguously differentiate easily confused characters (such as uppercase `I`, lowercase `l`, and digit `1`). Letter-spacing is intentionally open (2% to 6%) with line heights locked at a generous 1.6 ratio to ensure comfortable tracking for low-vision readers using screen magnifiers.
- **Braille Annotation:** All numeric references or tactile coordinate pairs default to the label scale in bold weight to preserve legibility under extreme zooming.

## Layout & Spacing

The layout philosophy follows a disciplined, open-canvas model. Negative space is treated as an active functional component, preventing visual crowding and providing distinct tactile landing zones.

- **Grid Architecture:** Desktop views employ a 12-column layout flanked by generous outer margins (`3rem`) to frame the workspace like a drafting board. Tablet uses 8 columns, while mobile condenses to a single or 4-column flow with tightened margins (`1.25rem`).
- **Tactile Sheet Framing:** Primary editor workspaces and tactile plate previews adhere to fixed physical ratios (A4, SwellTouch standard 11x11.5", and B5). These canvas wrappers are centered and isolated with `space-xl` breathing room.
- **Breathing Space Rule:** Containers must maintain internal air equivalent to at least one third of their total area. Elements must never touch the perimeters of their containers without an explicit debossed boundary.

## Elevation & Depth

This design system avoids all diffuse, blurred drop shadows and radial gradients. Spatial hierarchy is communicated through tactile score lines, paper layering, and boundary articulation.

- **Debossed Scores ("Hendidura"):** Instead of floating surfaces via cast shadows, elevation drops and panel divisions are marked by a crisp 1px score line in `#DFD7C8`. When inset depth is required (such as preview wells or tactile input fields), use an inner border or a crisp 1px solid stroke.
- **Layer Stacking:** Depth is achieved by placing pure white sheets (`#FFFFFF`) directly over the warm ivory backdrop (`#F8F5EF`). The optical transition between the two values provides sufficient contrast to delineate surfaces naturally.
- **Active Focus Elevation:** Interactive focus states must not use soft glows. State changes are communicated via a high-contrast 2px solid boundary in warm ochre (`#C88A1E`) offset by 2px of empty paper space, ensuring clean separation from the interactive target.

## Shapes

The shape vocabulary emphasizes architectural precision, book arts, and physical drafting tools:

- **Corner Radii:** Set to soft architectural corners (`roundedness: 1`, 0.25rem / 4px). This subtle rounding prevents visual harshness while maintaining crisp geometry reminiscent of heavy guillotine-cut paper sheets.
- **Braille & Tactile Nodes:** Individual Braille dot indicators and tactile reference markers form the sole circular exception, remaining 100% round to honor their real-world geometry.
- **Bounding Boxes:** Toolbars, preview canvases, and specimen cards strictly follow rectangular silhouettes with continuous 1px `#DFD7C8` perimeter strokes.

## Components

### Buttons & Interactive Triggers
- **Primary Action:** Solid Deep Carbon (`#1C1917`) fill with pure `#FFFFFF` typography. Crisp 4px corner radius. No shadow.
- **Secondary Action:** Transparent background, 1px solid `#1C1917` stroke, Deep Carbon text.
- **Tertiary / Utility:** Transparent background, 1px solid `#DFD7C8` stroke, Stone Grey (`#686158`) text, transitioning to `#1C1917` on hover.
- **Height & Targets:** Minimum touch target size of 48px × 48px regardless of visual label size.
- **Focus State:** 2px solid `#C88A1E` outline with a 2px whitespace gap.

### Tactile Canvas & Specimen Sheets (PIAF / SwellTouch)
- Pure white `#FFFFFF` surface bordered by a 1px solid `#DFD7C8` stroke.
- Interactive tactile vector paths and dots are rendered exclusively in 100% K (`#1C1917`).
- Active diagnostic guides and alignment coordinates appear in `#686158` (dashed 1px) and do not export to production relief files.

### Inputs & Braille Cell Simulators
- **Input Fields:** `#FFFFFF` background, 1px solid `#DFD7C8` border, 48px height, padded with `space-md`. Active focus turns the border to `#1C1917` with the standard ochre offset ring.
- **Braille 6-Dot / 8-Dot Input Cells:** Grid-aligned, debossed circular nodes. Inactive nodes use an unembossed `#DFD7C8` ring; activated nodes fill with solid `#1C1917` to mimic raised capsules.

### Status Chips & Badges
- 4px radius, 1px solid border.
- **Diagnostic / Verification Passed:** Surface `#FFFFFF`, border `#235E4F`, text `#235E4F`.
- **In-Progress / Calibration:** Surface `#FFFFFF`, border `#C88A1E`, text `#C88A1E`.
- **System Metadata:** Surface `#F8F5EF`, border `#DFD7C8`, text `#686158`.

### Inspection Cards & Lists
- Unbroken white background bounded by 1px solid `#DFD7C8`.
- Rows separated by hairline dividers (`#DFD7C8`). Hover states shift the background to `#F8F5EF` with immediate, non-animated contrast changes for assistive clarity.