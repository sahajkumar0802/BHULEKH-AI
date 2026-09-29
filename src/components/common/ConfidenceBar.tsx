import React from 'react';

interface ConfidenceBarProps {
  confidence: number;
  label?: string;
  showPercentage?: boolean;
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  confidence,
  label,
  showPercentage = true
}) => {
  const isHigh = confidence >= 90;
  const isMed = confidence >= 75 && confidence < 90;

  const barColor = isHigh ? 'bg-emerald-500' : isMed ? 'bg-amber-500' : 'bg-red-500';
  const textColor = isHigh ? 'text-emerald-700' : isMed ? 'text-amber-700' : 'text-red-700';

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs mb-1">
          {label && <span className="text-slate-600 font-medium">{label}</span>}
          {showPercentage && <span className={`font-semibold ${textColor}`}>{confidence}%</span>}
        </div>
      )}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }}
        />
      </div>
    </div>
  );
};
