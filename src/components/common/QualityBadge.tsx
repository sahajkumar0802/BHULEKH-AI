import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';

interface QualityBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const QualityBadge: React.FC<QualityBadgeProps> = ({
  score,
  size = 'md',
  showLabel = true
}) => {
  const isHigh = score >= 85;
  const isMed = score >= 65 && score < 85;

  const colorClass = isHigh
    ? 'bg-blue-50 text-blue-700 border-blue-200'
    : isMed
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-slate-100 text-slate-700 border-slate-200';

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${colorClass}`}>
        <Award className="w-3 h-3 text-blue-600 shrink-0" />
        <span>{score}%</span>
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`p-4 rounded-xl border ${colorClass} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-600 text-white">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold opacity-75">Record Quality Index</div>
            <div className="text-2xl font-bold">{score}%</div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100/70 text-blue-800">
            {isHigh ? 'High Integrity' : isMed ? 'Moderate Completeness' : 'Needs Rescan'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${colorClass}`}>
      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
      {showLabel && <span className="opacity-75">Quality:</span>}
      <span className="font-bold">{score}%</span>
    </span>
  );
};
