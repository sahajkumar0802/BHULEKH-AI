import React from 'react';
import { useApp } from '../../context/AppContext';
import { Megaphone, PhoneCall } from 'lucide-react';

export const GovMarqueeTicker: React.FC = () => {
  const { govLanguage } = useApp();
  const isHindi = govLanguage === 'hi';

  const announcements = isHindi ? [
    '• डिजिटल इंडिया भूमि अभिलेख आधुनिकीकरण कार्यक्रम (DILRMP): 100% 3-स्तरीय राजस्व सत्यापन (BDO → CO → समाहर्ता) सक्रिय है।',
    '• पंजीकृत विक्रय विलेख (Registered Sale Deed) एवं खतियान/RoR हेतु स्वचालित एआई सत्यापन सेवा उपलब्ध है।',
    '• 14-अंकीय विशिष्ट भूखंड पहचान संख्या (ULPIN) द्वारा खसरा व लगान स्थिति की तुरंत जांच करें।',
    '• राष्ट्रीय राजस्व हेल्पलाइन: 1800-180-1551 (टोल-फ्री) | ई-कोर्ट्स व उप-पंजीयक समन्वय लाइव।'
  ] : [
    '• Digital India Land Records Modernization Programme (DILRMP): 100% 3-Stage Statutory Verification (BDO → CO → Collector) is active.',
    '• Direct AI Verification enabled for Registered Sale Deeds and Khatiyan / RoR records.',
    '• Check real-time cadastral records & e-Lagaan tax dues using 14-digit ULPIN identifier.',
    '• National Revenue Helpline: 1800-180-1551 (Toll-Free) | e-Courts & Sub-Registrar live synchronization.'
  ];

  return (
    <div className="bg-[#FFF8E1] border-b border-[#FDE68A] text-[#1E293B] text-xs py-1 px-3 sm:px-6 flex items-center overflow-hidden select-none">
      <div className="max-w-7xl mx-auto w-full flex items-center gap-3">
        
        {/* Left Ticker Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FF9933] text-[#002856] font-extrabold text-[10px] uppercase tracking-wider rounded shrink-0 shadow-2xs">
          <Megaphone className="w-3.5 h-3.5 text-[#002856]" />
          <span>{isHindi ? 'नवीनतम सूचना' : 'LATEST UPDATES'}</span>
        </div>

        {/* Scrolling News Strip */}
        <div className="overflow-hidden whitespace-nowrap flex-1 relative">
          <div className="animate-gov-ticker inline-block text-xs font-semibold text-[#002856]">
            <span className="mr-8">{announcements[0]}</span>
            <span className="mr-8">{announcements[1]}</span>
            <span className="mr-8">{announcements[2]}</span>
            <span className="mr-8">{announcements[3]}</span>
          </div>
        </div>

        {/* Toll-Free Help Desk Shortcut */}
        <div className="hidden lg:flex items-center gap-1.5 shrink-0 pl-3 border-l border-[#FDE68A] text-[11px] font-bold text-[#003D7C]">
          <PhoneCall className="w-3 h-3 text-[#138808]" />
          <span>Toll-Free: <strong>1800-180-1551</strong></span>
        </div>

      </div>
    </div>
  );
};
