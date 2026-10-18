# VariPath — Machine Learning-Based Pathogenicity Prediction for Missense Variants

VariPath is a clinical genomics web application designed for genetic counselors, clinical geneticists, and researchers to assess the pathogenicity of missense single-nucleotide variants (SNVs). Given a variant input, VariPath generates an interactive **Clinical Risk Dashboard** detailing pathogenicity probability, biochemical red flags, explainable feature contributions, and actionable clinical notes.

> **Academic Project:** VTU 2022 Scheme · BCS586 Mini Project  
> **Phase:** Frontend Implementation (Mock API & Local Persistence)

---

## 1. Quick Start & How to Run

### Prerequisites
- Node.js `v18.17+` or `v20+` / `v24+`
- npm (or pnpm / yarn)

### Installation & Execution

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
# Navigate to: http://localhost:3000
```

### Production Build & Verification

```bash
# Build the optimized production bundle
npm run build

# Start the production server
npm run start
```

---

## 2. Project Folder Structure

VariPath strictly adheres to the Next.js App Router component architecture:

```text
varipath-frontend/
├── app/
│   ├── layout.tsx                # Global HTML wrapper, Inter font, Navbar, Toast & Footer
│   ├── page.tsx                  # Analyze Page: Hero, 3-step pipeline strip, VariantForm
│   ├── not-found.tsx             # Clinical 404 handler
│   ├── globals.css               # Design tokens, print styles & staggered animations
│   ├── icon.svg                  # Custom DNA helix favicon
│   ├── results/
│   │   └── page.tsx              # Clinical Risk Dashboard (Gauge, Red Flags, Chart, Notes)
│   ├── history/
│   │   └── page.tsx              # Analysis History Log (Table, Filter, Sort, CSV, Compare)
│   └── analytics/
│       └── page.tsx              # Model performance, Confusion Matrix & ROC Curve
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Sticky header with active tabs, history count & theme toggle
│   │   └── Footer.tsx            # VTU academic credits, demo indicator & disclaimer
│   ├── form/
│   │   ├── VariantForm.tsx       # 4-field clinical input form with inline validation
│   │   ├── ExampleChips.tsx      # Quick-fill demo chips (TP53 R248W, BRCA1 I1234V)
│   │   └── LoadingStepper.tsx    # 6-stage animated analysis pipeline overlay
│   ├── dashboard/
│   │   ├── VariantSummaryHeader.tsx # HGVS title, metadata tags & print button
│   │   ├── VerdictBadge.tsx      # Color-coded clinical verdict pill
│   │   ├── ProbabilityGauge.tsx  # Animated SVG semicircle gauge with 3-zone risk bar
│   │   ├── RedFlagCard.tsx       # Biochemical metric card with severity flag & tooltip
│   │   ├── RedFlagsSection.tsx   # 3-flag grid (BLOSUM62, Hydropathy, Charge) + stat tiles
│   │   ├── FeatureContributionChart.tsx # Recharts horizontal bar chart of Shapley impacts
│   │   └── ClinicalNoteBox.tsx   # Color-coded recommendation box with next steps
│   ├── history/
│   │   ├── HistoryTable.tsx      # Sortable table, probability bars, delete confirmation
│   │   └── HistoryEmptyState.tsx # Empty state placeholder
│   └── ui/
│       ├── Button.tsx            # Primary, secondary, danger, ghost variants + loading state
│       ├── Card.tsx              # Rounded-xl container with soft borders and shadows
│       ├── Badge.tsx             # Pathogenic, benign, uncertain, and brand status badges
│       ├── Spinner.tsx           # Accessible SVG loader
│       ├── Toast.tsx             # Auto-dismissing notification system
│       └── Disclaimer.tsx        # Standard clinical research disclaimer box
├── lib/
│   ├── aminoAcids.ts             # All 20 amino acids, hydropathy, charge, and HGVS builder
│   ├── validation.ts             # Pure validation rules for gene, residues, and coordinates
│   ├── mockData.ts               # Hardcoded PATHOGENIC_MOCK and BENIGN_MOCK reference cases
│   ├── storage.ts                # SSR-safe localStorage persistence for history & latest result
│   └── api.ts                    # Centralized mock data layer & future backend endpoint
├── hooks/
│   ├── useAnalysis.ts            # Execution hook managing analysis lifecycle and routing
│   └── useHistory.ts             # Cross-tab synchronized browser storage hook
└── types/
    └── variant.ts                # TypeScript data contracts (Verdict, Features, HistoryEntry)
```

---

## 3. How the Mock API Works

All data operations are centralized in [`lib/api.ts`](file:///d:/mini%20project%20jgi/MINI%20PROJECT%20%28ME%29/lib/api.ts) via `analyzeVariant(query: VariantQuery)`:

1. **Simulated Network Latency:**
   Enforces a ~900ms delay to realistically simulate cloud inference pipelines and trigger the animated `LoadingStepper`.

2. **Official Pathogenic Demo:**
   When input matches `TP53`, Wild-Type `R` (Arg), Mutant `W` (Trp), Position `248`, the system outputs `PATHOGENIC_MOCK` with 91.4% probability, BLOSUM62 `-3.0` ("Rare Swap"), Δ Hydropathy `+3.6` ("Severe Hydrophobic Shift"), and Charge Loss (`Positive (+) → Neutral (0)`).

3. **Conservative Substitution Rule:**
   Conservative amino acid pairs (`I-V`, `V-I`, `L-I`, `I-L`, `K-R`, `R-K`, `D-E`, `E-D`, `S-T`, `T-S`, `F-Y`, `Y-F`) automatically return `BENIGN_MOCK` with the user's specific gene and locus coordinates (e.g. `BRCA1 p.Ile1234Val`, 8.7% probability).

4. **Dynamic Biophysical Derivation:**
   Any other amino acid substitution is evaluated on-the-fly using the Kyte-Doolittle hydropathy scale, sidechain formal charges at pH 7.0, and a standard 20×20 BLOSUM62 log-odds matrix. Probability is computed dynamically:
   - $\text{Probability} \ge 70.0\% \implies \textbf{Pathogenic}$
   - $\text{Probability} \le 30.0\% \implies \textbf{Benign}$
   - $30.0\% < \text{Probability} < 70.0\% \implies \textbf{Uncertain Significance}$

---

## 4. Backend Integration Point

Connecting a real Python / FastAPI / Flask / Node.js backend requires editing **only one file**: [`lib/api.ts`](file:///d:/mini%20project%20jgi/MINI%20PROJECT%20%28ME%29/lib/api.ts).

### Step-by-Step Backend Connection:
1. Set your backend URL in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://api.varipath.org
   ```

2. Open [`lib/api.ts`](file:///d:/mini%20project%20jgi/MINI%20PROJECT%20%28ME%29/lib/api.ts) and locate the marked integration spot:
   ```typescript
   // TODO(BACKEND): replace this body with fetch(`${API_BASE_URL}/predict`, { method: "POST", body: JSON.stringify(query) })
   ```

3. Replace the body of `analyzeVariant` with:
   ```typescript
   export async function analyzeVariant(query: VariantQuery): Promise<AnalysisResult> {
     const response = await fetch(`${API_BASE_URL}/predict`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(query)
     });
     if (!response.ok) {
       throw new Error(`Model inference failed: ${response.statusText}`);
     }
     return response.json();
   }
   ```

---

## 5. Design Tokens & Accessibility

- **Brand:** `#059669` (Emerald)
- **Pathogenic:** `#DC2626` (Red) with `#FEF2F2` background
- **Benign:** `#16A34A` (Green) with `#F0FDF4` background
- **Uncertain:** `#D97706` (Amber) with `#FFFBEB` background
- **Ink / Muted:** `#0F172A` / `#64748B`
- **Background:** `#F8FAFC` (Light) / `#0B1120` (Dark Mode)
- **Multi-modal Signals:** Color is always paired with clear text labels and distinct Lucide icons (`ShieldAlert`, `ShieldCheck`, `HelpCircle`).
- **Accessibility:** Full WCAG AA contrast compliance, keyboard focus rings (`focus:ring-2`), and `aria-live` status regions.
