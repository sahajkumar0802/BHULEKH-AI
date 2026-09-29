import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ChevronRight, ChevronLeft, X, Award, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const DEMO_STEPS = [
  {
    step: 1,
    title: '1. Scanned Land Document Ingestion',
    tab: 'digitization',
    desc: 'Ingest legacy scanned revenue records (PDF, JPG, PNG, scanned, historical, handwritten).',
    actionPrompt: 'Select "Sample 1: Deoghar Jamabandi Scan" to load a realistic Hindi RoR document.'
  },
  {
    step: 2,
    title: '2. Language & Script Detection (10 Languages)',
    tab: 'digitization',
    desc: 'Automatic identification of Indian language (Hindi) and script (Devanagari) with manual override.',
    actionPrompt: 'Observe the detected language meter and 10 Indian script selectors.'
  },
  {
    step: 3,
    title: '3. Intelligent Document Classification (8 Classes)',
    tab: 'digitization',
    desc: 'Deep rule-based classifier identifies the document as "Record of Rights (RoR / Jamabandi)" with 97.4% confidence.',
    actionPrompt: 'Notice the document classification badge and secondary classification scores.'
  },
  {
    step: 4,
    title: '4. Multi-Field Extraction & Confidence Scoring',
    tab: 'digitization',
    desc: 'Extracts 16 revenue fields with individual confidence tiers (High, Medium, Review).',
    actionPrompt: 'Notice the "Uncertain Fields" alert flagging mutation numeral confidence at 71%.'
  },
  {
    step: 5,
    title: '5. GIS Cadastral Parcel Matching',
    tab: 'gis',
    desc: 'Extracted Khasra 125 is automatically matched against 100+ GeoJSON cadastral polygons in Dumka district.',
    actionPrompt: 'The interactive Leaflet map focuses on Khasra 125 with color-coded critical status.'
  },
  {
    step: 6,
    title: '6. Spatial Cadastral Layer & Buffer Analysis',
    tab: 'gis',
    desc: 'Inspect parcel vector boundaries, satellite hybrid tiles, and spatial buffer zones.',
    actionPrompt: 'Observe the 2.40 Acre (RoR) vs 2.47 Acre (GIS Cadastral) variance (+2.9%).'
  },
  {
    step: 7,
    title: '7. 4-Way Cross-Database Validation Matrix',
    tab: 'validation',
    desc: 'Simultaneously cross-checks RoR Jamabandi vs Mutation Registry vs Sale Deed vs Cadastral GIS.',
    actionPrompt: 'Review the multi-source matrix highlighting owner spelling conflict (Rajesh vs Rakesh).'
  },
  {
    step: 8,
    title: '8. Spatial Overlap & Encroachment Detection',
    tab: 'validation',
    desc: 'Identifies 0.07-acre boundary encroachment into protected village Gochar (grazing) land.',
    actionPrompt: 'Review the spatial consistency finding recommending Patwari field demarcation.'
  },
  {
    step: 9,
    title: '9. Deterministic Duplicate Document Detection',
    tab: 'validation',
    desc: 'Identifies duplicate registration ID REG-2018-8831 indexed across both Rampur and Lakshmipur.',
    actionPrompt: 'Inspect the 100% duplicate match badge and collision alert.'
  },
  {
    step: 10,
    title: '10. Additive AI Risk Score (91/100) vs Quality Score',
    tab: 'twin',
    desc: 'Calculates additive risk score (+30 Owner, +20 Duplicate, +17 Spatial, +15 Area, +9 Low OCR) alongside Record Quality (68%).',
    actionPrompt: 'Notice how Risk and Record Quality are mathematically separated.'
  },
  {
    step: 11,
    title: '11. 360° Digital Land Twin Hero Dossier',
    tab: 'twin',
    desc: 'Consolidates 9 distinct facets: ownership, geometry, 4-way matrix, documents, history, and audit log.',
    actionPrompt: 'Explore the single source of truth that resolves fragmented paper records.'
  },
  {
    step: 12,
    title: '12. Human-Assisted Officer Verification Queue',
    tab: 'queue',
    desc: 'Low-confidence records and critical discrepancies are routed to the Tehsildar triage docket.',
    actionPrompt: 'Click "Edit Field" on Khasra 125 to correct the owner name.'
  },
  {
    step: 13,
    title: '13. Human Officer Correction Action',
    tab: 'queue',
    desc: 'Officer corrects the AI prediction (Rakesh Kumar -> Rajesh Kumar) and provides revenue order notes.',
    actionPrompt: 'Submit the edit to trigger the ground truth learning feedback loop.'
  },
  {
    step: 14,
    title: '14. Continuous AI Learning Feedback Loop',
    tab: 'learning',
    desc: 'Every human correction is saved as a training pair for future model retraining (+8.7% accuracy gain).',
    actionPrompt: 'Inspect the recently logged feedback pair in the AI Learning Center table.'
  },
  {
    step: 15,
    title: '15. Learning Metrics & Model Improvement Candidates',
    tab: 'learning',
    desc: 'Dashboard tracks 1,284 corrections, 2,931 fields, and ground-truth candidates across 10 scripts.',
    actionPrompt: 'Review the language training distribution and top corrected fields.'
  },
  {
    step: 16,
    title: '16. Government Integration Connectors (DILRMP/NGDRS)',
    tab: 'integrations',
    desc: 'Integration-ready adapter interfaces for LRMS, DILRMP, NGDRS, and NIC Bhu-Naksha.',
    actionPrompt: 'Click "Test API Heartbeat" to test real-time connector latency.'
  },
  {
    step: 17,
    title: '17. Tamper-Evident SHA-256 Audit Trail',
    tab: 'audit',
    desc: 'Every upload, OCR step, human edit, validation run, and officer approval is sealed with cryptographic hashes.',
    actionPrompt: 'Observe the immutable SHA-256 hash log and CSV export capability.'
  },
  {
    step: 18,
    title: '18. Full SIH Problem Statement Coverage',
    tab: 'sih-coverage',
    desc: '100% of SIH criteria addressed through working interactive UI, realistic synthetic data, and modular services.',
    actionPrompt: 'Click "Complete Live Demo" to celebrate prototype readiness!'
  }
];

export const GuidedDemoTour: React.FC = () => {
  const { isDemoTourActive, demoStep, nextDemoStep, prevDemoStep, endDemoTour, goToDemoStep } = useApp();

  if (!isDemoTourActive) return null;

  const current = DEMO_STEPS[demoStep - 1] || DEMO_STEPS[0];
  const isLast = demoStep === DEMO_STEPS.length;

  const handleNext = () => {
    if (isLast) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
      endDemoTour();
    } else {
      nextDemoStep();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-lg w-full bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Top Banner */}
      <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="font-bold text-xs uppercase tracking-wider">
            BHULEKH AI Live SIH Demo Walkthrough
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded-full">
            {demoStep} / {DEMO_STEPS.length}
          </span>
          <button
            onClick={endDemoTour}
            className="p-1 hover:bg-white/20 rounded-md transition-colors text-slate-200"
            title="Exit Demo Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-1.5">
            {current.title}
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{current.desc}</p>
        </div>

        {/* Action Prompt */}
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
          <div className="text-amber-400 font-bold mb-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Judge Presentation Cue:</span>
          </div>
          <div className="text-slate-200">{current.actionPrompt}</div>
        </div>

        {/* Progress Bar & Buttons */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          <div className="flex items-center gap-1">
            {DEMO_STEPS.map((s) => (
              <button
                key={s.step}
                onClick={() => goToDemoStep(s.step)}
                className={`w-2 h-2 rounded-full transition-all ${
                  s.step === demoStep
                    ? 'w-6 bg-indigo-500'
                    : s.step < demoStep
                    ? 'bg-emerald-500'
                    : 'bg-slate-700'
                }`}
                title={`Jump to step ${s.step}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevDemoStep}
              disabled={demoStep === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-slate-300"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md flex items-center gap-1 transition-all"
            >
              {isLast ? (
                <>
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>Finish Demo</span>
                </>
              ) : (
                <>
                  <span>Next Step</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
