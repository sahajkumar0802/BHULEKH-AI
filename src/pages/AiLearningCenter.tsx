import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { computeLearningMetrics } from '../services/learningFeedbackService';
import { 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  ArrowUpRight, 
  FileText, 
  UserCheck, 
  Database, 
  AlertCircle,
  TrendingUp,
  Cpu,
  Layers
} from 'lucide-react';

export const AiLearningCenter: React.FC = () => {
  const { feedbackRecords, setActiveTab, setSelectedParcelId } = useApp();
  const metrics = computeLearningMetrics(feedbackRecords);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredRecords = feedbackRecords.filter(f => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'hindi') return f.language === 'Hindi';
    if (activeFilter === 'english') return f.language === 'English';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <BrainCircuit className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                AI Learning & Feedback Center
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Continuous Feedback Loop Active
                </span>
              </h1>
              <p className="text-sm text-slate-600">
                Human officer corrections collected as training datasets for future model fine-tuning.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('queue')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
          >
            <UserCheck className="w-4 h-4" />
            Verify Queue Cases
          </button>
        </div>
      </div>

      {/* Honest Transparency Callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900">
          <p className="font-semibold">Honest Model Training Architecture Note:</p>
          <p className="text-amber-800 mt-0.5">
            Human feedback is recorded as high-quality ground-truth training pairs. In accordance with government ML governance protocols, automated retraining does not occur unsupervised in real time; training batches are reviewed by data engineers prior to scheduled model checkpoint updates.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Corrections Collected</span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><CheckCircle2 className="w-5 h-5" /></span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{metrics.totalCorrectionsCollected.toLocaleString()}</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center"><ArrowUpRight className="w-3 h-3" /> +12 today</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Ground truth verified field pairs</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fields Corrected</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Layers className="w-5 h-5" /></span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{metrics.totalFieldsCorrected.toLocaleString()}</span>
            <span className="text-xs font-medium text-blue-600">Across 10 scripts</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Owner names, mutation numbers, areas</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg OCR Confidence</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Cpu className="w-5 h-5" /></span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{metrics.averageExtractionConfidence}%</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded">High Tier</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Indic-NER & legal layout analysis</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Model Accuracy Gain</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg"><TrendingUp className="w-5 h-5" /></span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-purple-700">+{metrics.modelImprovementRate}%</span>
            <span className="text-xs font-semibold text-purple-600">Post-Feedback</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Measurable gain after 1,200+ human edits</p>
        </div>
      </div>

      {/* Visual Feedback Architecture Pipeline */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-6 text-white shadow-md border border-slate-800">
        <h3 className="text-base font-semibold text-indigo-300 flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Continuous Human-in-the-Loop Feedback Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
          <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold mx-auto mb-2 text-xs">1</div>
            <p className="font-semibold text-sm">AI Prediction</p>
            <p className="text-xs text-slate-400 mt-1">OCR extracts fields with confidence scores</p>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mx-auto mb-2 text-xs">2</div>
            <p className="font-semibold text-sm">Uncertain Triage</p>
            <p className="text-xs text-slate-400 mt-1">Scores below 75% routed to Officer Queue</p>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold mx-auto mb-2 text-xs">3</div>
            <p className="font-semibold text-sm">Human Correction</p>
            <p className="text-xs text-slate-400 mt-1">Officer edits erroneous text with rationale</p>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold mx-auto mb-2 text-xs">4</div>
            <p className="font-semibold text-sm">Feedback Pair Logged</p>
            <p className="text-xs text-slate-400 mt-1">AI vs Correct value stored with SHA-256 hash</p>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mx-auto mb-2 text-xs">5</div>
            <p className="font-semibold text-sm">Batch Fine-Tuning</p>
            <p className="text-xs text-slate-400 mt-1">Training dataset prepared for Indic-NER update</p>
          </div>
        </div>
      </div>

      {/* Two-Column Analytics: Top Corrected Fields & Language Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Corrected Fields */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            Top Corrected Revenue Fields
          </h3>
          <p className="text-xs text-slate-500 mb-4">Historical impact of human supervisor interventions</p>
          <div className="space-y-3">
            {metrics.topCorrectedFields.map((f, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{f.fieldName}</p>
                  <p className="text-xs text-slate-500">{f.correctionCount} verified corrections logged</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-800 rounded">
                    Accuracy {f.accuracyGain}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Feedback Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-purple-600" />
            Language Training Distribution
          </h3>
          <p className="text-xs text-slate-500 mb-4">Ground-truth pairs accumulated across Indian languages</p>
          <div className="space-y-3">
            {metrics.languageFeedbackBreakdown.map((l, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800">{l.language}</span>
                <span className="text-sm font-bold text-slate-900">{l.feedbackCount} pairs</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Feedback Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Human Training Corrections</h3>
            <p className="text-xs text-slate-500">Every officer verification action contributes to this active training registry</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveFilter('all')} 
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              All Records ({feedbackRecords.length})
            </button>
            <button 
              onClick={() => setActiveFilter('hindi')} 
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${activeFilter === 'hindi' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              Hindi Devanagari
            </button>
            <button 
              onClick={() => setActiveFilter('english')} 
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${activeFilter === 'english' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              English
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Feedback ID</th>
                <th className="px-4 py-3">Parcel & Document</th>
                <th className="px-4 py-3">Field</th>
                <th className="px-4 py-3">AI Prediction (Before)</th>
                <th className="px-4 py-3">Officer Corrected (After)</th>
                <th className="px-4 py-3">Verified By</th>
                <th className="px-4 py-3">Candidate Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-xs">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-indigo-700">{r.id}</td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => {
                        setSelectedParcelId(r.parcelId);
                        setActiveTab('twin');
                      }}
                      className="text-slate-900 font-sans font-semibold hover:text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      {r.parcelId}
                    </button>
                    <span className="text-[11px] text-slate-500 font-sans block">{r.documentId} ({r.language})</span>
                  </td>
                  <td className="px-4 py-3 font-sans font-medium text-slate-900">{r.fieldLabel}</td>
                  <td className="px-4 py-3 text-red-600 line-through bg-red-50/50 rounded font-sans">
                    {r.aiValue} <span className="text-[10px] text-red-400">({r.confidence}%)</span>
                  </td>
                  <td className="px-4 py-3 text-emerald-700 font-bold bg-emerald-50/50 rounded font-sans">
                    {r.correctedValue}
                  </td>
                  <td className="px-4 py-3 font-sans">
                    <span className="text-slate-900 font-medium block">{r.verifiedBy}</span>
                    <span className="text-[10px] text-slate-400">{r.timestamp}</span>
                  </td>
                  <td className="px-4 py-3 font-sans">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-semibold text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-indigo-600" /> Ground Truth Ready
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
