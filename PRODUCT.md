# PRODUCT.md — BHULEKH AI

## Product Overview
**BHULEKH AI** is an enterprise-grade Intelligent Land Record Digitization, Cross-Record Validation, and Geospatial Intelligence System built for the Digital India Land Records Modernization Programme (DILRMP) and State Departments of Revenue & Land Reforms.

## Platform
- **Platform**: `web`
- **Framework**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, Vanilla CSS Design Tokens
- **Mapping Engine**: Leaflet, React-Leaflet (GeoJSON / Cadastral Vector Layers)
- **Icons & Typography**: Lucide React, Google Fonts (`Inter`, `JetBrains Mono`)

---

## Target Audience & User Personas

### 1. Citizens / Landholders (`citizen`)
- **Profile**: Rural and urban landowners, heirs to ancestral property, property buyers/sellers.
- **Key Needs**:
  - Quick, frictionless public search using 14-digit Verification IDs, Khasra, or Khata numbers.
  - Transparent inspection of title deeds, encumbrance history, and e-Lagaan tax payment dues.
  - Alternative documentation pathway (*"I Don't Have These Documents"*) for ancestral/inherited land without registered sale deeds.
  - Live 3-tier statutory tracking with the right to file formal statutory appeals (`APP-XXXXXX`).
- **Context & Mindset**: High anxiety around property security and bureaucratic delays; requires clear, jargon-free explanations and immediate status visibility.

### 2. Revenue Officers (`patwari`, `tehsildar`, `district_officer`)
- **Profile**: Revenue Inspectors, Circle Officers / Tehsildars, Sub-Divisional Magistrates (SDM), and District Collectors (DC).
- **Key Needs**:
  - Strict jurisdiction-based filtering (e.g., Dumka Sadar, Arwal) ensuring officials only access assigned parcels.
  - High-density verification queue with clear indicators for overdue SLA cases (>14 days) and AI risk scores.
  - Fast-track mutation review with mandatory rejection reasoning to uphold citizen rights.
  - Cryptographic batch work submission with SHA-256 digital attestation.
- **Context & Mindset**: High caseload volume; needs high information density, fast keyboard workflows, and unambiguous legal evidence.

### 3. System Administrators (`admin`)
- **Profile**: State revenue IT directors, DILRMP mission officers.
- **Key Needs**: Real-time national command center, state-wise digitization metrics, API explorer, and immutable tamper-evident audit trails.

---

## Core Problems Solved

1. **Legacy Paper Records & Multi-Script Bottlenecks**:
   - Digitizes degraded handwritten RoRs, Khatiyans, and Jamabandis across 10 Indian scripts (Hindi, Kaithi, Bengali, Gujarati, Marathi, Tamil, Telugu, Kannada, Malayalam, English).
2. **Title Conflicts & Encroachment Risks**:
   - Executes Zero-Trust 4-way cross-record validation (RoR vs Sale Deed vs Jamabandi vs GIS Cadastral polygons).
   - Computes an explainable **Land Risk Score (0–100)** with actionable mitigating guidance.
3. **Statutory Delays & Administrative Friction**:
   - Enforces a 14-day statutory SLA with automated delay escalations.
   - Provides a formal statutory appeal mechanism routing disputes to Circle Officer quasi-judicial hearing queues.

---

## Key User Workflows (Surfaces)

| Surface / Page | Mode | Primary Objective |
| :--- | :--- | :--- |
| **Sign In / Auth** (`signin`) | *Operate* | Dual-mode authentication for Citizens (Aadhaar OTP) and Government Officials (SSO + Role Selection). |
| **Citizen Dashboard** (`user-dashboard`) | *Operate* | Command centre ribbon, quick access to 3 primary actions, linked MY LAND parcels, and state progress. |
| **Upload Document** (`upload-document`) | *Operate* | Dual-pathway document submission, 4-stage live AI OCR scan, and explainable Land Risk Score. |
| **Check Document** (`check-document`) | *Operate / Read* | 14-digit search, 3-column land & tax particulars, and interactive GIS Cadastral map. |
| **Track Progress** (`track-progress`) | *Operate / Read* | 3-stage statutory verification stepper, delay warnings, and statutory appeal filing modal. |
| **Official Portal** (`official-dashboard`) | *Operate* | Jurisdiction-based queue, delay escalations, case review modal with mandatory rejection validation. |
| **Digital Land Twin** (`twin`) | *Experience* | 3D-styled parcel dossier integrating title, GIS, financial status, and AI verification badges. |
| **Public Portal** (`landing`) | *Persuade* | Executive summary, live system stats, AI digitization pipeline showcase, and hackathon presentation mode. |

---

## Design Directives & Non-Negotiables
- **No AI Slop / Generic Templates**: Enterprise-grade UI tailored specifically for Indian land governance.
- **High Contrast & Readability**: Clear distinction between citizen-friendly guidance and official statutory data tables.
- **Zero Layout Shifts**: Consistent `max-w-7xl mx-auto space-y-6 pb-16` structure on `bg-slate-50`.
- **Accessibility & Bilingual Support**: Clear labels, monospace formatting for legal/parcel identifiers, and high-visibility status badges.
