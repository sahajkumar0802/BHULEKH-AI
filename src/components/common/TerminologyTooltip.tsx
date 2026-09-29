import React, { useState } from 'react';
import { LAND_GLOSSARY } from '../../data/glossaryData';
import { HelpCircle, BookOpen } from 'lucide-react';

interface TerminologyTooltipProps {
  termKey: keyof typeof LAND_GLOSSARY | string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export const TerminologyTooltip: React.FC<TerminologyTooltipProps> = ({
  termKey,
  children,
  showIcon = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const data = LAND_GLOSSARY[termKey] || {
    term: termKey,
    hindiTerm: 'राजस्व शब्दावली',
    category: 'Administrative',
    definition: 'Standard administrative term in Indian Land Revenue Systems.',
    significance: 'Used for record classification and statutory reporting.'
  };

  return (
    <span className="relative inline-flex items-center group">
      <span
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="cursor-help border-b border-dotted border-slate-400 hover:border-gov-600 hover:text-gov-700 transition-colors inline-flex items-center gap-1 font-medium"
      >
        {children || data.term}
        {showIcon && <HelpCircle className="w-3 h-3 text-slate-400 group-hover:text-gov-600 shrink-0" />}
      </span>

      {isOpen && (
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 p-3 bg-slate-900 text-white rounded-lg shadow-xl text-xs z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150 border border-slate-700"
          style={{ maxWidth: '90vw' }}
        >
          <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-800">
            <div className="flex items-center gap-1 text-gov-400 font-semibold">
              <BookOpen className="w-3 h-3" />
              <span>{data.term}</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-mono">
              {data.category}
            </span>
          </div>
          <div className="text-[11px] text-amber-200/90 font-medium mb-1">
            {data.hindiTerm}
          </div>
          <p className="text-slate-300 leading-relaxed mb-2">
            {data.definition}
          </p>
          <div className="bg-slate-800/80 rounded p-1.5 text-[10px] text-slate-300 border border-slate-700/50">
            <span className="text-gov-300 font-semibold">Revenue Role: </span>
            {data.significance}
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </span>
  );
};
