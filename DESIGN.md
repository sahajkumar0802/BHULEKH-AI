# DESIGN.md — BHULEKH AI Design System

## Design Philosophy & Personality
- **Government Enterprise Precision**: Authoritative, trustworthy, and modern — aligned with Digital India (NIC / DILRMP) standards.
- **Clarity over Clutter**: Dense, legal-grade revenue data structured with high visual hierarchy, clean zebra striping, and distinct risk indicators.
- **Zero AI Slop**: Custom-tailored typography, structured multi-column particulars, and bespoke Cadastral GIS mapping rather than generic SaaS cards.

---

## 1. Color Palette & Tokens

### Primary & Government Identity
- `gov-50`: `#f0f7ff` — Soft tinted surface
- `gov-500`: `#0e8ce4` — Primary brand accent
- `gov-600`: `#026fc3` — Primary interactive state
- `gov-700`: `#03589e` — Deep gov header
- `navy-900`: `#0f172a` — Primary dark surface (Header / Dark Cards)
- `navy-950`: `#090d16` — Deep background

### Saffron & Heritage Accents (SIH & Statutory Escalations)
- `saffron-50`: `#fffbeb`
- `saffron-500`: `#f59e0b`
- `saffron-600`: `#d97706`

### Risk & Verification Semantic Colors
- **Low Risk / Clear Title**: `emerald-600` (`#10b981`), `emerald-50` background
- **Moderate / Needs Review**: `amber-600` (`#f59e0b`), `amber-50` background
- **High Risk / Encroachment Alert**: `orange-600` (`#f97316`), `orange-50` background
- **Critical / Severe Conflict**: `rose-600` (`#ef4444`), `rose-50` background
- **Statutory Appeal / Quasi-Judicial**: `purple-600` (`#9333ea`), `purple-50` background

---

## 2. Typography

- **Primary Sans**: `Inter`, system-ui, -apple-system, sans-serif
  - `font-black` (`900`) / `font-extrabold` (`800`) for primary metrics and page titles.
  - `font-semibold` (`600`) for labels and button text.
  - `font-normal` (`400`) / `font-medium` (`500`) for body explanations.
- **Monospace**: `JetBrains Mono`, `Fira Code`, monospace
  - Used for all legal identifiers: **Khasra Numbers**, **Khata Numbers**, **14-digit Verification IDs**, **Aadhaar tokens**, and **SHA-256 Hashes**.

---

## 3. Surface & Elevation Guidelines

- `.gov-card`: `bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200`
- `.gov-card-interactive`: `bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-gov-400 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`
- `.gov-card-dark`: `bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-xl`
- `.glass-panel`: `bg-white/80 backdrop-blur-md border border-white/40 shadow-sm`
- `.glass-panel-dark`: `bg-slate-900/80 backdrop-blur-md border border-slate-800/80 shadow-lg`

---

## 4. Spacing & Container Layouts

- **Workspace Frame**: Standardized `max-w-7xl mx-auto space-y-6 pb-16` within `bg-slate-50`.
- **Zebra Tables**: Slate-50 alternating row backgrounds with slate-200 dividers and hover row highlighting.
- **Status Pills**: `gov-pill` with semantic background and border colors for instant scannability.
- **GIS Map Overlays**: Rounded 14px Leaflet popup cards with drop-shadows and dark high-contrast tooltips.
