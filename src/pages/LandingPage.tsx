import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  FileScan,
  MapPin,
  CheckCheck,
  Layers,
  Fingerprint,
  Building2,
  ShieldCheck,
  Search,
  Award,
  Users
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, startDemoTour, govLanguage } = useApp();
  const isHindi = govLanguage === 'hi';

  const pipelineSteps = [
    { step: 1, title: isHindi ? '1. दस्तावेज़ स्कैनिंग' : '1. Document Scan', desc: isHindi ? 'विलेख, खतियान या पंजी-II स्कैन' : 'Legacy RoR, Khatiyan, or Sale Deed', icon: FileScan },
    { step: 2, title: isHindi ? '2. बहुभाषी एआई ओसीआर' : '2. Bilingual AI OCR', desc: isHindi ? 'हिंदी, कैथी व अंग्रेजी पार्सिंग' : 'Script recognition & entity extraction', icon: Sparkles },
    { step: 3, title: isHindi ? '3. डिजिटल लैंड ट्विन' : '3. Digital Land Twin', desc: isHindi ? 'एकल एकीकृत भूखंड प्रोफ़ाइल' : 'Unified parcel title & tax dossier', icon: Layers },
    { step: 4, title: isHindi ? '4. भू-नक्शा संरेखण' : '4. Cadastral GIS Match', desc: isHindi ? 'वेक्टर पॉलीगॉन क्षेत्र मिलान' : 'Geo-referenced vector polygon align', icon: MapPin },
    { step: 5, title: isHindi ? '5. 4-तरफ़ा विसंगति जांच' : '5. Cross-Validation', desc: isHindi ? 'शून्य-विश्वास डेटाबेस सत्यापन' : 'Zero-trust registry conflict detector', icon: CheckCheck },
    { step: 6, title: isHindi ? '6. 3-स्तरीय वैधानिक अनुमोदन' : '6. Statutory RBAC', desc: isHindi ? 'BDO → CO → समाहर्ता सत्यापन' : 'BDO → CO → Collector verification', icon: ShieldCheck }
  ];

  const nationalMetrics = [
    { value: '2.84 Cr+', label: isHindi ? 'डिजिटलीकृत भूखंड (Parcels)' : 'Digitized Land Parcels', sub: isHindi ? 'झारखंड व बिहार पायलट' : 'Pan-India DILRMP Project' },
    { value: '94.2%', label: isHindi ? 'भू-स्थानिक कैडस्ट्रल संरेखण' : 'GIS Cadastral Georeferenced', sub: isHindi ? 'भू-नक्शा वेक्टर समन्वय' : 'Bhu-Naksha Vector Synchronized' },
    { value: '100%', label: isHindi ? '3-स्तरीय वैधानिक अनुमोदन' : '3-Stage Statutory RBAC', sub: isHindi ? 'BDO → CO → समाहर्ता' : 'Level 1 → Level 2 → Level 3' },
    { value: '10 Scripts', label: isHindi ? 'भारतीय लिपियों में ओसीआर' : 'Indian Scripts Supported', sub: isHindi ? 'हिंदी, कैथी, बांग्ला व अंग्रेजी' : 'Multi-lingual Revenue NER' }
  ];

  const quickServices = [
    {
      title: isHindi ? 'नागरिक स्व-सेवा (Citizen Portal)' : 'Citizen Land Locker',
      desc: isHindi ? 'पंजीकृत भूमि, खतियान व लगान रसीद देखें और विसंगति निवारण अपील दर्ज करें।' : 'Access your registered parcels, inspect deeds, and submit appeals.',
      icon: Users,
      tab: 'user-dashboard',
      actionText: isHindi ? 'नागरिक पोर्टल खोलें' : 'Open Citizen Locker'
    },
    {
      title: isHindi ? 'विक्रय विलेख / खतियान अपलोड' : 'Upload Sale Deed / Khatiyan',
      desc: isHindi ? 'पंजीकृत विलेखों हेतु स्वचालित त्वरित एआई सत्यापन व विसंगति जांच।' : 'AI OCR extraction, conflict verification & 14-digit ULPIN alignment.',
      icon: FileScan,
      tab: 'upload-document',
      actionText: isHindi ? 'दस्तावेज़ अपलोड करें' : 'Upload Document'
    },
    {
      title: isHindi ? '14-अंकीय भू-आधार (ULPIN) खोज' : '14-Digit ULPIN Search',
      desc: isHindi ? 'खसरा, खाता व लगान बकाये की सार्वजनिक व पारदर्शी स्थिति की त्वरित जांच।' : 'Inspect land particulars, boundary coordinates & tax dues.',
      icon: Search,
      tab: 'check-document',
      actionText: isHindi ? 'रिकॉर्ड जांचें' : 'Check Record'
    },
    {
      title: isHindi ? 'राजस्व अधिकारी पोर्टल (RBAC)' : 'Revenue Officer Portal (RBAC)',
      desc: isHindi ? 'प्रखंड विकास अधिकारी (BDO), अंचल अधिकारी (CO) एवं समाहर्ता का 3-स्तरीय वर्कफ़्लो।' : 'Strict jurisdiction review queue, SLA timers & quasi-judicial decisions.',
      icon: Building2,
      tab: 'official-dashboard',
      actionText: isHindi ? 'अधिकारी पोर्टल' : 'Official Portal'
    }
  ];

  return (
    <div className="min-h-full bg-[#F4F6F9] text-slate-900 pb-12">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: AUTHENTIC GOVERNMENT INFO-DENSE BANNER                   */}
      {/* ========================================================================= */}
      <div className="bg-white border-b border-[#D0D7DE] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Government Scheme Chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0F5FA] border border-[#003D7C] rounded text-xs font-bold text-[#002856]">
              <span className="w-2 h-2 rounded-full bg-[#138808] animate-pulse" />
              <span>{isHindi ? 'डिजिटल इंडिया भूमि अभिलेख आधुनिकीकरण कार्यक्रम' : 'Digital India Land Records Modernization Programme'} (DILRMP 2.0)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#002856] tracking-tight leading-tight">
              {isHindi 
                ? 'कागजी भू-अभिलेखों से विश्वसनीय डिजिटल एवं भू-स्थानिक भूलेख प्रणाली' 
                : 'From Paper Deeds to Trusted, Cryptographically Verified Digital Land Records'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
              {isHindi
                ? 'बहुभाषी एआई ओसीआर डिजिटलीकरण, भू-नक्शा कैडस्ट्रल मानचित्र संरेखण, शून्य-विश्वास 4-तरफ़ा विसंगति निवारण एवं BDO → CO → समाहर्ता का 3-स्तरीय वैधानिक अनुमोदन।'
                : 'National AI-powered OCR digitization, Bhu-Naksha vector cadastral mapping, zero-trust cross-record discrepancy detection, and 3-stage statutory revenue officer governance.'}
            </p>

            {/* Main Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('signin')}
                className="px-5 py-2.5 rounded bg-[#003D7C] hover:bg-[#002856] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 active:scale-95"
              >
                <Fingerprint className="w-4 h-4 text-[#FF9933]" />
                <span>{isHindi ? 'पोर्टल में साइन इन करें' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('check-document')}
                className="px-4 py-2.5 rounded bg-white hover:bg-[#F8FAFC] text-[#003D7C] font-bold text-xs border border-[#CBD5E1] hover:border-[#003D7C] shadow-xs transition-all flex items-center gap-1.5"
              >
                <Search className="w-4 h-4 text-[#003D7C]" />
                <span>{isHindi ? '14-अंकीय ULPIN खोज' : '14-Digit ULPIN Search'}</span>
              </button>

              <button
                onClick={startDemoTour}
                className="px-4 py-2.5 rounded bg-[#FF9933] hover:bg-[#E65100] text-[#002856] hover:text-white font-bold text-xs border border-[#E65100] shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isHindi ? 'लाइव एसआईएच डेमो टूर (SIH 2026)' : 'Live SIH 2026 Demo Tour'}</span>
              </button>
            </div>

          </div>

          {/* Right Hero Official Stats / Ministry Card */}
          <div className="lg:col-span-4 bg-[#F0F5FA] border border-[#C2DCF0] rounded-md p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#002856] font-bold text-xs border-b border-[#C2DCF0] pb-2">
              <Award className="w-4 h-4 text-[#003D7C]" />
              <span>{isHindi ? 'राष्ट्रीय भूमि प्रशासन मानक' : 'National Governance Standards'}</span>
            </div>

            <div className="space-y-2.5 text-[11px] text-slate-700">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#E2E8F0]">
                <span>{isHindi ? 'वैधानिक स्तर:' : 'Statutory Levels:'}</span>
                <span className="font-bold text-[#002856]">3 Stages (BDO → CO → DC)</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-[#E2E8F0]">
                <span>{isHindi ? 'सुरक्षा मानक:' : 'Security Standard:'}</span>
                <span className="font-bold text-[#138808]">SHA-256 Digest &amp; CORDIS</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-[#E2E8F0]">
                <span>{isHindi ? 'भू-स्थानिक समन्वय:' : 'GIS Integration:'}</span>
                <span className="font-bold text-[#002856]">Bhu-Naksha &amp; NIC Cadastral</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{isHindi ? 'समस्या विवरण:' : 'Hackathon Statement:'}</span>
                <span className="font-bold text-[#B45309]">SIH-2026 PS-18</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#C2DCF0]">
              <button
                onClick={() => setActiveTab('overview')}
                className="w-full py-1.5 rounded bg-white hover:bg-[#E1EDF7] text-[#003D7C] text-xs font-bold border border-[#003D7C] transition-colors flex items-center justify-center gap-1"
              >
                <span>{isHindi ? 'राष्ट्रीय कमांड सेंटर देखें' : 'View National Command Center'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. KEY NATIONAL STATS BAR                                                 */}
      {/* ========================================================================= */}
      <div className="bg-[#002856] text-white py-6 border-b border-[#001A3A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            {nationalMetrics.map((m, idx) => (
              <div key={idx} className="p-3 bg-[#003D7C] rounded border border-[#0B4F8A]">
                <div className="text-xl sm:text-2xl font-extrabold text-[#FF9933] font-mono">{m.value}</div>
                <div className="text-xs font-bold text-white mt-0.5">{m.label}</div>
                <div className="text-[10px] text-[#C2DCF0] mt-0.5">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FUNCTIONAL SERVICE TILES (FLAT, BORDERED, MINIMAL SHADOW)              */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        <div>
          <div className="gov-section-header">
            <Building2 className="w-4 h-4 text-[#003D7C]" />
            <span>{isHindi ? 'प्रमुख सार्वजनिक एवं राजस्व सेवाएं' : 'Key Public & Revenue Services'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickServices.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <div key={idx} className="bg-white border border-[#D0D7DE] rounded-md p-4 flex flex-col justify-between hover:border-[#003D7C] transition-all shadow-sm">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded bg-[#F0F5FA] text-[#003D7C] border border-[#C2DCF0] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#002856]">
                      {svc.title}
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      {svc.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-2 border-t border-[#F1F5F9]">
                    <button
                      onClick={() => setActiveTab(svc.tab)}
                      className="w-full py-1.5 px-3 rounded bg-[#003D7C] hover:bg-[#002856] text-white font-semibold text-xs transition-all flex items-center justify-center gap-1"
                    >
                      <span>{svc.actionText}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. 6-STEP STATUTORY VERIFICATION & DIGITIZATION PIPELINE                  */}
        {/* ========================================================================= */}
        <div>
          <div className="gov-section-header">
            <ShieldCheck className="w-4 h-4 text-[#003D7C]" />
            <span>{isHindi ? '6-चरणीय एआई एवं वैधानिक राजस्व सत्यापन प्रक्रिया' : '6-Stage AI & Statutory Verification Architecture'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {pipelineSteps.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="bg-white border border-[#D0D7DE] rounded-md p-3 space-y-1.5 hover:border-[#003D7C] transition-all shadow-2xs">
                  <div className="w-7 h-7 rounded bg-[#003D7C] text-white flex items-center justify-center text-xs font-bold">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-xs text-[#002856] leading-tight">
                    {s.title}
                  </h4>
                  <p className="text-[10px] text-slate-600 leading-snug">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
