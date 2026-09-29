import React from 'react';
import { RiskLevel } from '../../types/landRecord';
import { AlertTriangle, ShieldCheck, AlertCircle, ShieldAlert } from 'lucide-react';

interface RiskBadgeProps {
  score: number;
  level?: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showTier?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  score,
  level,
  size = 'md',
  showIcon = true,
  showTier = true
}) => {
  const derivedLevel: RiskLevel = level || (score > 80 ? 'critical' : score > 60 ? 'high' : score > 30 ? 'medium' : 'low');

  const config = {
    critical: {
      bg: 'bg-red-50 text-red-700 border-red-200',
      pill: 'bg-red-600 text-white',
      label: 'CRITICAL',
      icon: ShieldAlert
    },
    high: {
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      pill: 'bg-orange-500 text-white',
      label: 'HIGH RISK',
      icon: AlertTriangle
    },
    medium: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      pill: 'bg-amber-500 text-white',
      label: 'MEDIUM',
      icon: AlertCircle
    },
    low: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pill: 'bg-emerald-600 text-white',
      label: 'LOW RISK',
      icon: ShieldCheck
    }
  }[derivedLevel];

  const IconComponent = config.icon;

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${config.bg}`}>
        {showIcon && <IconComponent className="w-3 h-3 shrink-0" />}
        <span>{score}/100</span>
        {showTier && <span className="opacity-80">({config.label})</span>}
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`flex items-center justify-between p-4 rounded-xl border ${config.bg}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${config.pill}`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold opacity-75">AI Risk Assessment</div>
            <div className="text-2xl font-bold tracking-tight">{score} <span className="text-sm font-medium text-slate-500">/ 100</span></div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${config.pill}`}>
          {config.label}
        </span>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${config.bg}`}>
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span className="font-bold">{score}</span>
      <span className="opacity-70">/ 100</span>
      {showTier && <span className="ml-0.5 px-1.5 py-0.2 rounded bg-black/5 uppercase text-[10px] tracking-wider">{config.label}</span>}
    </span>
  );
};
