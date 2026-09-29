import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Landmark,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Receipt,
  Download,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Clock,
  Sparkles,
  MapPin
} from 'lucide-react';
import { GisCadastralViewer } from '../components/gis/GisCadastralViewer';

export const CheckDocumentView: React.FC = () => {
  const { 
    parcels, 
    verificationCases, 
    setSelectedParcelId,
    setActiveTab,
    selectedState,
    selectedDistrict,
    selectedTehsil
  } = useApp();

  // Search Input (defaults to sample 14-digit / Case ID)
  const [searchInput, setSearchInput] = useState('CASE-2026-0125');
  const [activeSearchedCase, setActiveSearchedCase] = useState<any>(() => {
    return verificationCases.find(c => c.id === 'CASE-2026-0125') || verificationCases[0];
  });
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Quick Preset Search IDs
  const SAMPLE_IDS = [
    { label: 'CASE-2026-0125 (Dumka Overdue)', id: 'CASE-2026-0125' },
    { label: 'Khasra #125 (Giridih / Dumka)', id: '125' },
    { label: 'Khasra #312 (Title Verified)', id: '312' },
    { label: 'CASE-2026-0932 (BDO: Mutation)', id: 'CASE-2026-0932' },
    { label: 'CASE-2026-1390 (CO: Hearing)', id: 'CASE-2026-1390' }
  ];

  const handleSearch = (query: string) => {
    setSearchError(null);
    const q = query.trim().toLowerCase();

    // 1. Try finding in verification cases
    const foundCase = verificationCases.find(c => 
      c.id.toLowerCase() === q ||
      c.parcelId.toLowerCase().includes(q) ||
      c.khasraNo.toLowerCase() === q ||
      c.ownerName.toLowerCase().includes(q)
    );

    if (foundCase) {
      setActiveSearchedCase(foundCase);
      setSelectedParcelId(foundCase.parcelId);
      return;
    }

    // 2. Try finding in parcels
    const foundParcel = parcels.find(p => 
      p.parcelId.toLowerCase().includes(q) ||
      p.khasraNo.toLowerCase() === q ||
      p.owner.toLowerCase().includes(q)
    );

    if (foundParcel) {
      setSelectedParcelId(foundParcel.parcelId);
      // Synthesize case object from parcel
      setActiveSearchedCase({
        id: `VERIF-2026-${foundParcel.khasraNo.padStart(4, '0')}`,
        parcelId: foundParcel.parcelId,
        khasraNo: foundParcel.khasraNo,
        khataNo: foundParcel.khataNo || '42',
        plotNo: `${foundParcel.khasraNo}/A`,
        surveyNo: `SUR-1968-${foundParcel.khasraNo}`,
        village: foundParcel.village,
        block: foundParcel.district + ' Sadar',
        district: foundParcel.district,
        state: foundParcel.state,
        ownerName: foundParcel.owner,
        aadhaarMasked: 'XXXX-XXXX-9023',
        areaAcres: foundParcel.areaRoR,
        landType: foundParcel.landType,
        documentType: 'Registered Sale Deed (Kewala)',
        isAlternativeDocument: false,
        daysPending: 3,
        isDelayed: false,
        currentStage: 'verified',
        status: 'approved',
        problemDetected: 'All title registrations, GIS polygon boundaries, and Jamabandi records verified.',
        riskScore: foundParcel.riskScore || 12,
        riskLevel: foundParcel.riskLevel || 'low',
        financialInfo: {
          taxStatus: 'paid',
          annualRevenueAmount: Math.round(foundParcel.areaRoR * 220),
          outstandingDues: 0,
          lastPaymentDate: '2026-02-10',
          receiptNumber: `LAGAN-${foundParcel.khasraNo}-2026`,
          financialYear: '2025-2026'
        }
      });
      return;
    }

    setSearchError(`No land record found matching "${query}". Please check the 14-digit Verification ID or Khasra Number.`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-7 pb-16 animate-in fade-in duration-300">
      {/* Search Header with Breadcrumb */}
      <div className="space-y-2 pb-4 border-b border-slate-200">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 font-medium flex-wrap">
          <div className="flex items-center gap-2">
            <span className="cursor-pointer hover:underline text-[#003D7C]" onClick={() => setActiveTab('user-dashboard')}>Home</span>
            <span>/</span>
            <span>Public Registry</span>
            <span>/</span>
            <span className="text-gov-navy font-bold">Check Land Record &amp; Title Verification</span>
          </div>

          <button
            onClick={() => setActiveTab('location-select')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#E1EDF7] hover:bg-[#C2DCF0] text-[#003D7C] rounded text-xs font-bold border border-[#C2DCF0] transition-all shadow-2xs"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF9933]" />
            <span>Jurisdiction: <strong>{selectedState || 'Jharkhand'} › {selectedDistrict || 'Giridih'} › {selectedTehsil || 'Giridih Sadar'}</strong></span>
            <span className="text-[10px] text-[#FF9933] underline ml-1">Change ›</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gov-navy">
                भू-अभिलेख एवं विधिक स्वत्व जांच | Land Verification &amp; Registry Search
              </h1>
              <span className="px-2 py-0.5 rounded bg-gov-navy text-white text-[11px] font-bold font-mono">
                PUBLIC REGISTRY
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Search by 14-Digit ULPIN Verification ID, Case Reference, or Khasra Number to inspect legal title, e-Lagaan tax dues, and Cadastral GIS maps.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs flex-wrap bg-slate-100 p-1.5 rounded-md border border-slate-200">
            <span className="text-slate-600 font-bold px-1">Quick Presets:</span>
            <div className="flex flex-wrap gap-1">
              {SAMPLE_IDS.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSearchInput(s.id);
                    handleSearch(s.id);
                  }}
                  className="px-2 py-0.5 text-xs font-mono bg-white hover:bg-blue-50 text-gov-navy rounded border border-slate-300 font-semibold shadow-xs transition-all"
                >
                  {s.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="gov-card p-5 rounded-lg space-y-4">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-gov-navy" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchInput)}
              placeholder="Enter 14-digit Verification ID (e.g. CASE-2026-0125 or Khasra 125)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-gov-navy font-medium"
            />
          </div>

          <button
            onClick={() => handleSearch(searchInput)}
            className="gov-btn-primary py-2 px-5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Registry</span>
          </button>
        </div>

        {searchError && (
          <div className="p-3 rounded bg-red-50 border border-red-300 text-xs text-red-800 flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{searchError}</span>
          </div>
        )}
      </div>

      {/* Main Results Grid if record is selected */}
      {activeSearchedCase && (
        <div className="space-y-6">
          {/* Top Status Banner */}
          <div className="gov-card p-5 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={`w-10 h-10 rounded flex items-center justify-center text-white shadow-xs ${
                activeSearchedCase.riskScore > 60 ? 'bg-red-600' :
                activeSearchedCase.riskScore > 30 ? 'bg-amber-600' :
                'bg-emerald-700'
              }`}>
                {activeSearchedCase.riskScore > 60 ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-gov-navy">
                    ID: {activeSearchedCase.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    activeSearchedCase.status === 'resolved' || activeSearchedCase.status === 'approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                    activeSearchedCase.status === 'escalated' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                    'bg-amber-50 text-amber-800 border-amber-300'
                  }`}>
                    {activeSearchedCase.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Khasra #{activeSearchedCase.khasraNo} • {activeSearchedCase.village}, {activeSearchedCase.district}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedParcelId(activeSearchedCase.parcelId);
                  setActiveTab('twin');
                }}
                className="gov-btn-primary py-1.5 px-3.5 text-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Launch Digital Twin</span>
              </button>

              <button
                onClick={() => setActiveTab('track-progress')}
                className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-800 rounded border border-slate-300 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-gov-navy" />
                <span>Track Stages</span>
              </button>
            </div>
          </div>

          {/* 3-Column Info Layout: Land Details, Financial & Revenue Status, Risk Assessment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Column 1: Land Details */}
            <div className="gov-card p-5 rounded-lg flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gov-navy font-bold text-xs mb-3 pb-2 border-b border-slate-200">
                  <Landmark className="w-4 h-4 text-gov-navy" />
                  <span className="uppercase tracking-wide">भू-विवरण एवं स्वामित्व | Land Particulars</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Registered Owner (रैयत)</span>
                    <span className="font-bold text-slate-900 text-sm">{activeSearchedCase.ownerName}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Khasra (खेसरा)</span>
                      <span className="font-mono font-bold text-slate-800">#{activeSearchedCase.khasraNo}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Khata (खाता)</span>
                      <span className="font-mono font-bold text-slate-800">#{activeSearchedCase.khataNo || '42'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Area (रकबा)</span>
                      <span className="font-mono font-bold text-slate-800">{activeSearchedCase.areaAcres} Acres</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Land Type</span>
                      <span className="font-bold text-slate-800">{activeSearchedCase.landType}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px]">Location Hierarchy</span>
                    <span className="text-slate-700">
                      {activeSearchedCase.village}, {activeSearchedCase.block}, {activeSearchedCase.district}, {activeSearchedCase.state}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px]">Document Classification</span>
                    <span className="text-slate-700 font-medium">{activeSearchedCase.documentType}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                Aadhaar Hash: <span className="font-mono text-slate-700 font-semibold">{activeSearchedCase.aadhaarMasked || 'XXXX-XXXX-9023'}</span>
              </div>
            </div>

            {/* Column 2: Financial & Revenue Tax Status */}
            <div className="gov-card p-5 rounded-lg flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gov-navy font-bold text-xs mb-3 pb-2 border-b border-slate-200">
                  <Receipt className="w-4 h-4 text-emerald-700" />
                  <span className="uppercase tracking-wide">राजस्व एवं लगान स्थिति | e-Lagaan Status</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded bg-emerald-50 border border-emerald-300">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Tax Status</span>
                      <span className={`font-bold uppercase text-xs flex items-center gap-1 ${
                        activeSearchedCase.financialInfo?.taxStatus === 'paid' ? 'text-emerald-800' : 'text-amber-800'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        {activeSearchedCase.financialInfo?.taxStatus || 'PAID (No Dues)'}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold border border-emerald-300">
                      FY 2025-26
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Annual Revenue</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        ₹{activeSearchedCase.financialInfo?.annualRevenueAmount || Math.round(activeSearchedCase.areaAcres * 200)}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Outstanding Dues</span>
                      <span className="font-mono font-bold text-emerald-800 text-sm">
                        ₹{activeSearchedCase.financialInfo?.outstandingDues || 0}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px]">Last Payment Date</span>
                    <span className="font-mono text-slate-700 font-medium">
                      {activeSearchedCase.financialInfo?.lastPaymentDate || '15-Jan-2026'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px]">Receipt / Chalan Number</span>
                    <span className="font-mono text-gov-navy font-bold">
                      {activeSearchedCase.financialInfo?.receiptNumber || `TAX-${activeSearchedCase.khasraNo}-2026`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <button
                  onClick={() => setShowReceiptModal(true)}
                  className="w-full py-2 px-3 bg-white hover:bg-emerald-50 border border-emerald-400 text-emerald-900 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Download e-Lagaan Chalan Receipt</span>
                </button>
              </div>
            </div>

            {/* Column 3: AI Findings & Risk Breakdown */}
            <div className="gov-card p-5 rounded-lg flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gov-navy font-bold text-xs mb-3 pb-2 border-b border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-gov-saffron" />
                  <span className="uppercase tracking-wide">विधिक जोखिम मूल्यांकन | Risk Assessment</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Composite Risk Score</span>
                      <span className="font-mono font-bold text-base text-slate-900">
                        {activeSearchedCase.riskScore}/100
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      activeSearchedCase.riskScore > 60 ? 'bg-red-50 text-red-800 border-red-300' :
                      activeSearchedCase.riskScore > 30 ? 'bg-amber-50 text-amber-800 border-amber-300' :
                      'bg-emerald-50 text-emerald-800 border-emerald-300'
                    }`}>
                      {activeSearchedCase.riskLevel} Risk
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px] mb-0.5 font-semibold">Cross-Check Findings</span>
                    <p className="text-slate-700 leading-relaxed text-[11px] font-sans">
                      {activeSearchedCase.problemDetected || 'All 4 verification checks passed without conflict.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="text-slate-500 text-[9px] block">Days in Queue</span>
                      <span className="font-bold text-slate-800">{activeSearchedCase.daysPending || 1} Days</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="text-slate-500 text-[9px] block">Statutory SLA</span>
                      <span className={`font-bold ${activeSearchedCase.isDelayed ? 'text-purple-800' : 'text-emerald-800'}`}>
                        {activeSearchedCase.isDelayed ? 'Overdue (>14d)' : 'Within SLA'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <button
                  onClick={() => setActiveTab('track-progress')}
                  className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded text-xs font-bold border border-slate-300 transition-all flex items-center justify-center gap-1 shadow-xs"
                >
                  <span>View Full Statutory Audit Trail</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gov-navy" />
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* INTERACTIVE GIS CADASTRAL MAP SECTION                                     */}
          {/* ========================================================================= */}
          <div className="gov-card p-5 sm:p-6 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-gov-navy" />
                  <h2 className="text-base font-bold text-gov-navy tracking-tight">
                    भू-नक्शा कैडस्ट्रल मानचित्र | Interactive Cadastral GIS Parcel Viewer
                  </h2>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Bhu-Naksha Geo-referenced Boundary Overlay • Khasra #{activeSearchedCase.khasraNo} Polygon
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                  EPSG:4326 WGS84
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-gov-navy border border-blue-300 font-bold">
                  24.2678° N, 87.2451° E
                </span>
              </div>
            </div>

            <div className="mt-4 rounded overflow-hidden border border-slate-300 shadow-inner">
              <GisCadastralViewer />
            </div>
          </div>
        </div>
      )}

      {/* Tax Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-300 rounded-lg p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="text-center pb-3 border-b border-slate-200">
              <div className="inline-flex p-2.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-300 mb-2">
                <Receipt className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-gov-navy">राजस्व लगान रसीद | Land Revenue Receipt (ई-लगान)</h3>
              <p className="text-xs text-slate-500">Department of Land Resources &amp; Revenue Reforms</p>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded border border-slate-200 font-mono">
              <div className="flex justify-between pb-1.5 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Chalan No:</span>
                <span className="font-bold text-slate-900">{activeSearchedCase?.financialInfo?.receiptNumber || 'TAX-125-2026'}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Owner Name:</span>
                <span className="font-bold text-slate-900">{activeSearchedCase?.ownerName}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Khasra / Khata:</span>
                <span className="font-bold text-slate-900">Khasra {activeSearchedCase?.khasraNo} / Khata {activeSearchedCase?.khataNo || '42'}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Village / District:</span>
                <span className="font-bold text-slate-900">{activeSearchedCase?.village}, {activeSearchedCase?.district}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Financial Year:</span>
                <span className="font-bold text-emerald-800">2025-2026 (Paid)</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold">
                <span className="text-slate-700 font-sans">Amount Paid:</span>
                <span className="text-emerald-800 font-mono">₹{activeSearchedCase?.financialInfo?.annualRevenueAmount || '480'}.00</span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 text-xs font-bold transition-all"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Official Tax receipt PDF downloaded.');
                  setShowReceiptModal(false);
                }}
                className="flex-1 py-2 px-3 gov-btn-primary text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Official PDF Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
