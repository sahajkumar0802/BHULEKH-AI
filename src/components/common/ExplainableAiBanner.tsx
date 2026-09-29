import React from 'react';
import { Sparkles, Info, ArrowRight } from 'lucide-react';

interface ExplainableAiBannerProps {
  summary: string;
  reasons?: string[];
  recommendedAction?: string;
  onActionClick?: () => void;
  actionLabel?: string;
  compact?: boolean;
}

export const ExplainableAiBanner: React.FC<ExplainableAiBannerProps> = ({
  summary,
  reasons = [],
  recommendedAction,
  onActionClick,
  actionLabel = 'Review in Verification Queue',
  compact = false
}) => {
  return (
    <div className={`rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white ${compact ? 'p-3' : 'p-4'} shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0 shadow-sm mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1">
              Explainable AI Risk Diagnostic
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
              Deterministic Rationale
            </span>
          </div>

          <p className="text-sm text-slate-800 leading-relaxed font-medium mb-2">
            {summary}
          </p>

          {!compact && reasons.length > 0 && (
            <div className="space-y-1.5 my-2.5 pt-2 border-t border-blue-100/80">
              <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Contributing Factor Rationale:
              </div>
              <ul className="space-y-1">
                {reasons.map((r, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommendedAction && (
            <div className="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-medium">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span><strong className="font-semibold">Recommended Revenue Action:</strong> {recommendedAction}</span>
              </div>
              {onActionClick && (
                <button
                  onClick={onActionClick}
                  className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors shrink-0 flex items-center gap-1 shadow-sm"
                >
                  <span>{actionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          <div className="mt-2 text-[11px] text-slate-400 italic">
            * AI risk score is an automated triage prioritization aid, not a statutory determination of title.
          </div>
        </div>
      </div>
    </div>
  );
};
