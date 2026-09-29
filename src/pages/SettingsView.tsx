import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  ShieldAlert,
  RefreshCw,
  CheckCircle2,
  Bell,
  Scale,
  Cpu,
  Globe
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { addAuditLog, activeRole } = useApp();

  // Settings state
  const [defaultState, setDefaultState] = useState('Jharkhand');
  const [defaultDistrict, setDefaultDistrict] = useState('Deoghar');
  const [defaultLanguage, setDefaultLanguage] = useState('Hindi');
  
  // OCR thresholds
  const [highConfidenceThreshold, setHighConfidenceThreshold] = useState(90);
  const [reviewConfidenceThreshold, setReviewConfidenceThreshold] = useState(75);
  const [ocrEngineMode, setOcrEngineMode] = useState('Indic-Vision + TrOCR (Hybrid Multi-Script)');
  const [fuzzyNameMatchingThreshold, setFuzzyNameMatchingThreshold] = useState(85);
  const [areaTolerancePercent, setAreaTolerancePercent] = useState(2.5);
  const [spatialOverlapToleranceSqm, setSpatialOverlapToleranceSqm] = useState(5.0);

  // Risk Weights
  const [weightOwnerMismatch, setWeightOwnerMismatch] = useState(30);
  const [weightAreaMismatch, setWeightAreaMismatch] = useState(15);
  const [weightDuplicateDoc, setWeightDuplicateDoc] = useState(20);
  const [weightSpatialOverlap, setWeightSpatialOverlap] = useState(17);
  const [weightLowConfidence, setWeightLowConfidence] = useState(9);

  // Notification toggles
  const [notifyOnCriticalRisk, setNotifyOnCriticalRisk] = useState(true);
  const [notifyOnDuplicateCollision, setNotifyOnDuplicateCollision] = useState(true);
  const [notifyOnOfficerCorrection, setNotifyOnOfficerCorrection] = useState(true);

  // Status feedback
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSaveSettings = () => {
    addAuditLog({
      officerName: 'System Administrator',
      officerRole: activeRole,
      action: 'Document Metadata Updated',
      parcelId: 'SYSTEM-CONFIG',
      reason: `Updated AI OCR thresholds (High: ${highConfidenceThreshold}%, Review: ${reviewConfidenceThreshold}%) and validation tolerance (${areaTolerancePercent}% area).`
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetToBaseline = () => {
    setHighConfidenceThreshold(90);
    setReviewConfidenceThreshold(75);
    setFuzzyNameMatchingThreshold(85);
    setAreaTolerancePercent(2.5);
    setSpatialOverlapToleranceSqm(5.0);
    setWeightOwnerMismatch(30);
    setWeightAreaMismatch(15);
    setWeightDuplicateDoc(20);
    setWeightSpatialOverlap(17);
    setWeightLowConfidence(9);

    addAuditLog({
      officerName: 'System Administrator',
      officerRole: activeRole,
      action: 'Document Metadata Updated',
      parcelId: 'SYSTEM-CONFIG',
      reason: 'Reset all AI threshold parameters and risk weights to factory baseline default.'
    });

    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <Settings className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                System Settings & AI Engine Configuration
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Tune AI OCR confidence bands, adjust cross-record validation tolerances, configure risk weights, and manage demo presets.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToBaseline}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Baseline</span>
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>System configuration parameters saved and active across all AI processing modules!</span>
        </div>
      )}

      {resetSuccess && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-300 text-blue-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <RefreshCw className="w-4 h-4 text-blue-600 shrink-0" />
          <span>All AI thresholds, tolerances, and risk model weights have been restored to factory baseline.</span>
        </div>
      )}

      {/* Section 1: AI OCR & Extraction Thresholds */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <span>1. AI OCR & Indic-NER Confidence Tier Thresholds</span>
          </h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono">
            FIELD-LEVEL SCORING
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          {/* High Confidence Slider */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between font-bold text-slate-800">
              <span>High Confidence Cutoff:</span>
              <span className="text-emerald-700 font-mono text-sm">{highConfidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="98"
              value={highConfidenceThreshold}
              onChange={(e) => setHighConfidenceThreshold(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Fields scoring ≥{highConfidenceThreshold}% are marked as verified with zero human review needed.
            </p>
          </div>

          {/* Review Threshold Slider */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Review Queue Cutoff:</span>
              <span className="text-amber-700 font-mono text-sm">{reviewConfidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="85"
              value={reviewConfidenceThreshold}
              onChange={(e) => setReviewConfidenceThreshold(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Fields scoring &lt;{reviewConfidenceThreshold}% are automatically routed to the Tehsildar's Verification Queue.
            </p>
          </div>

          {/* OCR Engine Preference */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800">Active OCR Pipeline Engine:</div>
            <select
              value={ocrEngineMode}
              onChange={(e) => setOcrEngineMode(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
            >
              <option value="Indic-Vision + TrOCR (Hybrid Multi-Script)">Indic-Vision + TrOCR (Hybrid Multi-Script)</option>
              <option value="Tesseract v5.3 + Indic-NER Specialized">Tesseract v5.3 + Indic-NER Specialized</option>
              <option value="Bilingual Devanagari/Latin Fast Pipeline">Bilingual Devanagari/Latin Fast Pipeline</option>
            </select>
            <p className="text-[11px] text-slate-500">
              Pluggable OCR architecture supporting Indic language models.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Validation Tolerances & Fuzzy Matching */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600" />
            <span>2. Cross-Record Validation Rules & Statutory Tolerances</span>
          </h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono">
            DILRMP COMPLIANT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          {/* Area Tolerance */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Area Divergence Tolerance:</span>
              <span className="text-indigo-700 font-mono text-sm">±{areaTolerancePercent}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10.0"
              step="0.5"
              value={areaTolerancePercent}
              onChange={(e) => setAreaTolerancePercent(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Discrepancy flagged if |RoR Area - GIS Area| / RoR Area &gt; {areaTolerancePercent}%.
            </p>
          </div>

          {/* Fuzzy Name Matching Ratio */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Fuzzy Raiyat Name Matching:</span>
              <span className="text-indigo-700 font-mono text-sm">{fuzzyNameMatchingThreshold}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="99"
              value={fuzzyNameMatchingThreshold}
              onChange={(e) => setFuzzyNameMatchingThreshold(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Levenshtein string distance threshold for phonetic transliteration variations (e.g., Rajesh vs Rakesh).
            </p>
          </div>

          {/* Spatial Overlap Tolerance */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Cadastral Overlap Tolerance:</span>
              <span className="text-indigo-700 font-mono text-sm">{spatialOverlapToleranceSqm} m²</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="20.0"
              step="1.0"
              value={spatialOverlapToleranceSqm}
              onChange={(e) => setSpatialOverlapToleranceSqm(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Adjacent vector polygons overlapping by more than {spatialOverlapToleranceSqm} m² trigger boundary disputes.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Additive Risk Model Scoring Weights */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>3. Explainable Risk Model Factor Weights (Additive Scoring)</span>
          </h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-mono">
            SCORE = MIN(100, Σ WEIGHTS)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-800 block">Owner Name Conflict</span>
            <div className="text-rose-700 font-mono font-extrabold text-lg">+{weightOwnerMismatch} pts</div>
            <input
              type="range"
              min="10"
              max="50"
              value={weightOwnerMismatch}
              onChange={(e) => setWeightOwnerMismatch(Number(e.target.value))}
              className="w-full accent-rose-600"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-800 block">Duplicate Registration</span>
            <div className="text-rose-700 font-mono font-extrabold text-lg">+{weightDuplicateDoc} pts</div>
            <input
              type="range"
              min="10"
              max="40"
              value={weightDuplicateDoc}
              onChange={(e) => setWeightDuplicateDoc(Number(e.target.value))}
              className="w-full accent-rose-600"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-800 block">Spatial Overlap / Gochar</span>
            <div className="text-rose-700 font-mono font-extrabold text-lg">+{weightSpatialOverlap} pts</div>
            <input
              type="range"
              min="5"
              max="35"
              value={weightSpatialOverlap}
              onChange={(e) => setWeightSpatialOverlap(Number(e.target.value))}
              className="w-full accent-rose-600"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-800 block">Area Mismatch &gt; Tol</span>
            <div className="text-rose-700 font-mono font-extrabold text-lg">+{weightAreaMismatch} pts</div>
            <input
              type="range"
              min="5"
              max="30"
              value={weightAreaMismatch}
              onChange={(e) => setWeightAreaMismatch(Number(e.target.value))}
              className="w-full accent-rose-600"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-800 block">Low OCR Confidence</span>
            <div className="text-rose-700 font-mono font-extrabold text-lg">+{weightLowConfidence} pts</div>
            <input
              type="range"
              min="2"
              max="20"
              value={weightLowConfidence}
              onChange={(e) => setWeightLowConfidence(Number(e.target.value))}
              className="w-full accent-rose-600"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Revenue Jurisdiction & Notification Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default Jurisdiction */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            <span>4. Revenue Boundary Defaults</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Default Pilot State:</label>
              <select
                value={defaultState}
                onChange={(e) => setDefaultState(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
              >
                <option value="Jharkhand">Jharkhand (State Pilot)</option>
                <option value="Bihar">Bihar</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Odisha">Odisha</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Default Operational District:</label>
              <select
                value={defaultDistrict}
                onChange={(e) => setDefaultDistrict(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
              >
                <option value="Deoghar">Deoghar</option>
                <option value="Dumka">Dumka</option>
                <option value="Ranchi">Ranchi</option>
                <option value="Dhanbad">Dhanbad</option>
                <option value="Bokaro">Bokaro</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Default Indic OCR Language:</label>
              <select
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
              >
                <option value="Hindi">Hindi (Devanagari)</option>
                <option value="English">English (Latin)</option>
                <option value="Bengali">Bengali (Bangla)</option>
                <option value="Marathi">Marathi (Devanagari)</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Kannada">Kannada</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Odia">Odia</option>
                <option value="Punjabi">Punjabi (Gurmukhi)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Real-time Alerts */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <span>5. Revenue Officer Alert Triggers</span>
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Critical Risk Alerts</span>
                <span className="text-[11px] text-slate-500">Auto-flag cases with score ≥80 for Circle Officer review</span>
              </div>
              <input
                type="checkbox"
                checked={notifyOnCriticalRisk}
                onChange={(e) => setNotifyOnCriticalRisk(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Duplicate Deed Collisions</span>
                <span className="text-[11px] text-slate-500">Instant alert upon detection of duplicate registered sale deeds</span>
              </div>
              <input
                type="checkbox"
                checked={notifyOnDuplicateCollision}
                onChange={(e) => setNotifyOnDuplicateCollision(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">AI Learning Feedback Sync</span>
                <span className="text-[11px] text-slate-500">Log training pair automatically when an officer edits an extracted field</span>
              </div>
              <input
                type="checkbox"
                checked={notifyOnOfficerCorrection}
                onChange={(e) => setNotifyOnOfficerCorrection(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
