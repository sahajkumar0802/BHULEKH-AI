import React from 'react';
import { ParcelStatus } from '../../types/landRecord';
import { CheckCircle2, AlertCircle, AlertTriangle, XCircle, Navigation } from 'lucide-react';

interface StatusBadgeProps {
  status: ParcelStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<ParcelStatus, { label: string; bg: string; icon: any }> = {
    verified: {
      label: 'Verified',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2
    },
    needs_review: {
      label: 'Needs Review',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertCircle
    },
    high_risk: {
      label: 'High Risk',
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: AlertTriangle
    },
    critical: {
      label: 'Critical Conflict',
      bg: 'bg-red-50 text-red-700 border-red-200',
      icon: XCircle
    },
    in_dispute: {
      label: 'In Legal Dispute',
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: AlertTriangle
    },
    field_verification_ordered: {
      label: 'Field Survey Ordered',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Navigation
    }
  };

  const current = configs[status] || configs.needs_review;
  const Icon = current.icon;

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${current.bg}`}>
        <Icon className="w-3 h-3 shrink-0" />
        <span>{current.label}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${current.bg}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{current.label}</span>
    </span>
  );
};
