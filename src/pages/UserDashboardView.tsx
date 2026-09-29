import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BhulekhAiAssistantChatbox } from '../components/chat/BhulekhAiAssistantChatbox';
import {
  UploadCloud,
  Search,
  Activity,
  MapPin,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Landmark,
  BarChart3,
  Compass,
  LogOut,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface StateDigitalizationStats {
  state: string;
  code: string;
  parcelsCount: string;
  digitizedPercent: number;
  gisGeoreferencedPercent: number;
  aiVerificationPercent: number;
  status: 'Leading' | 'Rapid Progress' | 'On Track';
}

const STATE_PROGRESS_DATA: StateDigitalizationStats[] = [
  { state: 'Jharkhand', code: 'JH', parcelsCount: '2.84 Cr', digitizedPercent: 94.2, gisGeoreferencedPercent: 91.8, aiVerificationPercent: 88.5, status: 'Leading' },
  { state: 'Bihar', code: 'BR', parcelsCount: '3.91 Cr', digitizedPercent: 89.4, gisGeoreferencedPercent: 84.6, aiVerificationPercent: 82.1, status: 'Rapid Progress' },
  { state: 'Uttar Pradesh', code: 'UP', parcelsCount: '7.42 Cr', digitizedPercent: 96.8, gisGeoreferencedPercent: 93.4, aiVerificationPercent: 91.0, status: 'Leading' },
  { state: 'Madhya Pradesh', code: 'MP', parcelsCount: '4.15 Cr', digitizedPercent: 95.1, gisGeoreferencedPercent: 92.0, aiVerificationPercent: 89.7, status: 'Leading' },
  { state: 'Maharashtra', code: 'MH', parcelsCount: '5.60 Cr', digitizedPercent: 93.7, gisGeoreferencedPercent: 88.9, aiVerificationPercent: 86.4, status: 'Rapid Progress' },
  { state: 'Karnataka', code: 'KA', parcelsCount: '3.45 Cr', digitizedPercent: 97.4, gisGeoreferencedPercent: 95.8, aiVerificationPercent: 94.2, status: 'Leading' },
  { state: 'Rajasthan', code: 'RJ', parcelsCount: '4.80 Cr', digitizedPercent: 91.2, gisGeoreferencedPercent: 87.3, aiVerificationPercent: 85.0, status: 'On Track' },
  { state: 'Gujarat', code: 'GJ', parcelsCount: '3.98 Cr', digitizedPercent: 98.1, gisGeoreferencedPercent: 96.5, aiVerificationPercent: 95.3, status: 'Leading' },
  { state: 'Odisha', code: 'OD', parcelsCount: '2.65 Cr', digitizedPercent: 88.6, gisGeoreferencedPercent: 83.1, aiVerificationPercent: 81.4, status: 'On Track' },
  { state: 'Tamil Nadu', code: 'TN', parcelsCount: '4.32 Cr', digitizedPercent: 96.0, gisGeoreferencedPercent: 94.1, aiVerificationPercent: 92.8, status: 'Leading' },
];

export const UserDashboardView: React.FC = () => {
  const { 
    currentUser, 
    parcels, 
    setActiveTab, 
    setSelectedParcelId,
    setSelectedTrackCaseId,
    getCitizenCases,
    logoutUser,
    govLanguage,
    selectedState,
    selectedDistrict,
    selectedTehsil,
    t
  } = useApp();

  const isHindi = govLanguage === 'hi';

  // Command Centre collapsible state
  const [isCommandCentreExpanded, setIsCommandCentreExpanded] = useState(false);

  // Citizen's linked parcels (defaults to first 3 parcels for demo user)
  const citizenParcels = parcels.slice(0, 3);

  // Citizen's real submitted verification cases
  const citizenCases = getCitizenCases(currentUser?.aadhaarMasked || 'XXXX-XXXX-9023');

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* ========================================================================= */}
      {/* 1. TOP WELCOME BAR (OFFICIAL CITIZEN PROFILE HEADER)                      */}
      {/* ========================================================================= */}
      <div className="bg-white border border-[#D0D7DE] rounded-md p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#002856]">
              {t('welcomeCitizen')} {currentUser?.name || 'Ramesh Kumar'}
            </h1>
            <span className="gov-badge-success">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#138808]" />
              <span>{t('aadhaarVerifiedBadge')}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 flex-wrap">
            <span>
              {t('aadhaarIdLabel')}{' '}
              <strong className="font-mono text-[#002856]">{currentUser?.aadhaarMasked || 'XXXX-XXXX-9023'}</strong>
            </span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('location-select')}
              className="flex items-center gap-1 text-[#003D7C] hover:underline font-bold"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FF9933]" />
              <span>Jurisdiction: <strong>{selectedState || 'Jharkhand'} › {selectedDistrict || 'Giridih'} › {selectedTehsil || 'Giridih Sadar'}</strong></span>
              <span className="text-[10px] text-[#FF9933] ml-1">Change ›</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('upload-document')}
            className="gov-btn-primary"
          >
            <UploadCloud className="w-4 h-4 text-[#FF9933]" />
            <span>{t('navUploadDoc')}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('check-document')}
            className="gov-btn-secondary"
          >
            <Search className="w-4 h-4 text-[#003D7C]" />
            <span>{t('navCheckDoc')}</span>
          </button>

          <button
            id="citizen-profile-logout-btn"
            onClick={logoutUser}
            className="px-3.5 py-2 rounded text-xs font-bold bg-[#FFEBEE] hover:bg-[#FFCDD2] text-[#C62828] border border-[#FFCDD2] shadow-2xs transition-all flex items-center gap-1.5 active:scale-95"
            title="Logout of Citizen Account"
          >
            <LogOut className="w-3.5 h-3.5 text-[#C62828]" />
            <span>{t('navLogout')}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. NATIONAL COMMAND CENTRE (OFFICIAL DILRMP STATUS RIBBON)                */}
      {/* ========================================================================= */}
      <div className="bg-white border border-[#D0D7DE] rounded-md shadow-sm overflow-hidden">
        <div 
          onClick={() => setIsCommandCentreExpanded(!isCommandCentreExpanded)}
          className="p-3 sm:p-4 bg-[#F0F5FA] border-b border-[#D0D7DE] flex items-center justify-between cursor-pointer hover:bg-[#E1EDF7] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#003D7C] text-white flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold text-[#002856]">
                  {t('commandCentreTitle')}
                </h2>
                <span className="gov-badge-official">
                  LIVE GRID
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                {t('commandCentreSub')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-[#003D7C]">
            <span>{isCommandCentreExpanded ? t('collapseMetrics') : t('expandMetrics')}</span>
            {isCommandCentreExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>

        {/* Collapsible Content */}
        {isCommandCentreExpanded ? (
          <div className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-3 bg-white">
            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span>{isHindi ? 'कुल डिजिटलीकृत खतियान' : 'Total Digitized RoRs'}</span>
                <TrendingUp className="w-3.5 h-3.5 text-[#138808]" />
              </div>
              <div className="text-xl font-bold text-[#002856] font-mono">38.45 Cr</div>
              <div className="text-[10px] text-[#138808] mt-0.5">↑ 94.8% National Target</div>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span>{isHindi ? 'कैडस्ट्रल जीआईएस पॉलीगॉन' : 'Cadastral GIS Polygons'}</span>
                <Layers className="w-3.5 h-3.5 text-[#003D7C]" />
              </div>
              <div className="text-xl font-bold text-[#002856] font-mono">14.28 Cr</div>
              <div className="text-[10px] text-[#003D7C] mt-0.5">Bhu-Naksha Vector Synced</div>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span>{isHindi ? 'एआई सत्यापन शुद्धता' : 'AI Validation Accuracy'}</span>
                <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
              </div>
              <div className="text-xl font-bold text-[#002856] font-mono">98.7%</div>
              <div className="text-[10px] text-[#B45309] mt-0.5">Zero-Trust Cross Checks</div>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span>{isHindi ? 'दाखिल-खारिज औसत समय' : 'Mutation SLA Time'}</span>
                <Clock className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="text-xl font-bold text-[#002856] font-mono">4.2 Days</div>
              <div className="text-[10px] text-purple-700 mt-0.5">Reduced from 45 days baseline</div>
            </div>
          </div>
        ) : (
          <div className="px-4 py-2 bg-white flex items-center justify-between text-xs text-slate-700 font-mono text-[11px] overflow-x-auto">
            <div className="flex items-center gap-6">
              <div><span className="text-slate-500">Total RoRs:</span> <strong className="text-[#138808]">38.45 Cr (94.8%)</strong></div>
              <div><span className="text-slate-500">GIS Polygons:</span> <strong className="text-[#003D7C]">14.28 Cr</strong></div>
              <div><span className="text-slate-500">AI Accuracy:</span> <strong className="text-[#B45309]">98.7%</strong></div>
              <div><span className="text-slate-500">Mutation SLA:</span> <strong className="text-purple-700">4.2 Days</strong></div>
            </div>
            <span className="text-[10px] text-[#003D7C] font-bold hidden sm:inline">{isHindi ? 'विस्तार हेतु क्लिक करें' : 'Click to expand'}</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. FOUR PRIMARY CITIZEN ACTION CARDS (FLAT GOVERNMENT STYLE)             */}
      {/* ========================================================================= */}
      <div>
        <div className="gov-section-header">
          <ShieldCheck className="w-4 h-4 text-[#003D7C]" />
          <span>{t('primaryServicesTitle')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Interactive Map Selection */}
          <div 
            onClick={() => setActiveTab('location-select')}
            className="gov-card-interactive p-4 flex flex-col justify-between bg-gradient-to-b from-white to-blue-50/40 border-blue-200 hover:border-[#003D7C]"
          >
            <div className="space-y-2">
              <div className="w-8 h-8 rounded bg-[#003D7C] text-white flex items-center justify-center">
                <Compass className="w-4 h-4 text-[#FF9933]" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#002856]">
                {t('cardMapTitle')}
              </h3>
              <p className="text-[11px] text-slate-600 leading-snug">
                {t('cardMapDesc')}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-bold text-[#003D7C]">
              <span>{t('cardMapBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Upload Document */}
          <div 
            onClick={() => setActiveTab('upload-document')}
            className="gov-card-interactive p-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-8 h-8 rounded bg-[#E1EDF7] text-[#003D7C] flex items-center justify-center">
                <UploadCloud className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#002856]">
                {t('cardUploadTitle')}
              </h3>
              <p className="text-[11px] text-slate-600 leading-snug">
                {t('cardUploadDesc')}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-bold text-[#003D7C]">
              <span>{t('cardUploadBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Check Document */}
          <div 
            onClick={() => setActiveTab('check-document')}
            className="gov-card-interactive p-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-8 h-8 rounded bg-[#E1EDF7] text-[#003D7C] flex items-center justify-center">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#002856]">
                {t('cardCheckTitle')}
              </h3>
              <p className="text-[11px] text-slate-600 leading-snug">
                {t('cardCheckDesc')}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-bold text-[#003D7C]">
              <span>{t('cardCheckBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Track Progress & Appeals */}
          <div 
            onClick={() => setActiveTab('track-progress')}
            className="gov-card-interactive p-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-8 h-8 rounded bg-[#E8F5E9] text-[#138808] flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#002856]">
                {t('cardTrackTitle')}
              </h3>
              <p className="text-[11px] text-slate-600 leading-snug">
                {t('cardTrackDesc')}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-bold text-[#138808]">
              <span>{t('cardTrackBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3.5 MY SUBMITTED APPLICATIONS & LIVE TRACKING SUMMARY                     */}
      {/* ========================================================================= */}
      <div className="gov-card p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D0D7DE]">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#003D7C]" />
              <h2 className="text-sm sm:text-base font-bold text-[#002856]">
                {isHindi ? 'मेरे जमा किए गए आवेदन एवं लाइव ट्रैकिंग' : 'My Submitted Applications & Tracking Status'}
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isHindi 
                ? 'आधार संख्या से जुड़े सभी सक्रिय भूमि अभिलेख सत्यापन मामलों की वास्तविक समय स्थिति।' 
                : 'Real-time tracking of all revenue record verification applications submitted under your authenticated profile.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setSelectedTrackCaseId(null);
                setActiveTab('track-progress');
              }}
              className="px-3 py-1.5 rounded text-xs font-bold bg-[#E1EDF7] hover:bg-[#C2DCF0] text-[#003D7C] border border-[#C2DCF0] flex items-center gap-1 transition-all"
            >
              <span>{isHindi ? 'सभी आवेदन देखें (ट्रैकर)' : 'Open Full Application Tracker'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#003D7C]" />
            </button>
          </div>
        </div>

        {/* Quick KPI Count Badges */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
            <span className="text-[11px] text-slate-600 font-semibold">{isHindi ? 'कुल आवेदन' : 'Total Applications'}</span>
            <span className="text-sm font-bold font-mono text-[#002856] px-2 py-0.5 bg-white border border-[#CBD5E1] rounded">
              {citizenCases.length}
            </span>
          </div>

          <div className="p-2.5 rounded bg-[#FFF8E1] border border-[#FFE082] flex items-center justify-between">
            <span className="text-[11px] text-[#B45309] font-semibold">{isHindi ? 'सत्यापनाधीन' : 'Under Verification'}</span>
            <span className="text-sm font-bold font-mono text-[#B45309] px-2 py-0.5 bg-white border border-[#FFE082] rounded">
              {citizenCases.filter(c => c.status === 'under_official_verification' || c.status === 'processing' || c.status === 'under_ai_verification').length}
            </span>
          </div>

          <div className="p-2.5 rounded bg-[#FFEBEE] border border-[#FFCDD2] flex items-center justify-between">
            <span className="text-[11px] text-[#C62828] font-semibold">{isHindi ? 'कार्रवाई आवश्यक' : 'Action Required'}</span>
            <span className="text-sm font-bold font-mono text-[#C62828] px-2 py-0.5 bg-white border border-[#FFCDD2] rounded">
              {citizenCases.filter(c => c.status === 'action_required').length}
            </span>
          </div>

          <div className="p-2.5 rounded bg-[#E8F5E9] border border-[#A5D6A7] flex items-center justify-between">
            <span className="text-[11px] text-[#138808] font-semibold">{isHindi ? 'स्वीकृत / पूर्ण' : 'Approved / Done'}</span>
            <span className="text-sm font-bold font-mono text-[#138808] px-2 py-0.5 bg-white border border-[#A5D6A7] rounded">
              {citizenCases.filter(c => c.status === 'completed' || c.status === 'approved').length}
            </span>
          </div>
        </div>

        {/* Recent Applications Grid */}
        <div className="mt-4 space-y-3">
          {citizenCases.slice(0, 3).map((app) => {
            const isActionReq = app.status === 'action_required';
            const isCompleted = app.status === 'completed';
            const isApproved = app.status === 'approved';
            const isRejected = app.status === 'rejected';

            const statusBadgeClass = 
              isActionReq ? 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]' :
              isCompleted ? 'bg-[#E8F5E9] text-[#138808] border-[#A5D6A7]' :
              isApproved ? 'bg-[#E1EDF7] text-[#003D7C] border-[#C2DCF0]' :
              isRejected ? 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]' :
              'bg-[#FFF8E1] text-[#B45309] border-[#FFE082]';

            const officerBadge = 
              app.currentStage === 'level_1_field' ? 'BDO (Level 1)' :
              app.currentStage === 'level_2_co' ? 'Circle Officer (CO)' :
              app.currentStage === 'level_3_collector' ? 'District Collector' :
              isCompleted ? 'Completed (Registrar Sign-off)' :
              isActionReq ? 'Action Required from Citizen' :
              'AI Validation Engine';

            return (
              <div
                key={app.id}
                className={`p-3.5 rounded border transition-all ${
                  isActionReq 
                    ? 'bg-[#FFF9F9] border-[#FFCDD2] shadow-2xs' 
                    : 'bg-[#F8FAFC] border-[#D0D7DE] hover:border-[#003D7C]'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-white text-[#002856] border border-[#CBD5E1]">
                        {app.id}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        ({app.trackingId || `TRK-${app.id.replace('CASE-', '')}`})
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${statusBadgeClass}`}>
                        {app.status === 'action_required' ? 'Action Required' :
                         app.status === 'completed' ? 'Completed' :
                         app.status === 'approved' ? 'Approved' :
                         app.status === 'rejected' ? 'Rejected' :
                         app.status === 'under_official_verification' ? 'Under Official Review' :
                         'Processing'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F0F5FA] text-[#003D7C] border border-[#CBD5E1] flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        <span>Responsible: {officerBadge}</span>
                      </span>
                    </div>

                    <div className="text-xs font-bold text-[#002856] flex items-center gap-2 flex-wrap">
                      <span>{app.documentType}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 font-normal">
                        Khasra #{app.khasraNo}, Mauza {app.village}, {app.block}, {app.district} ({app.state})
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 flex items-center gap-1.5 flex-wrap">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Submitted: {new Date(app.submissionDate).toLocaleDateString()}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-[#003D7C] font-semibold">
                        Next Action: {app.expectedNextAction || 'Awaiting statutory review.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                    <button
                      onClick={() => {
                        setSelectedTrackCaseId(app.id);
                        setActiveTab('track-progress');
                      }}
                      className="px-3 py-1.5 rounded text-xs font-bold bg-[#003D7C] hover:bg-[#002856] text-white flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
                    >
                      <Activity className="w-3.5 h-3.5 text-[#FF9933]" />
                      <span>{isHindi ? 'विस्तृत टाइमलाइन देखें' : 'View Full Timeline'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MY LAND SECTION (AUTHENTIC IDENTITY-LINKED PARCELS TABLE & CARDS)      */}
      {/* ========================================================================= */}
      <div className="gov-card p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D0D7DE]">
          <div>
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#003D7C]" />
              <h2 className="text-sm sm:text-base font-bold text-[#002856]">
                {isHindi ? 'मेरी भूमि — आधार-लिंक्ड भूखंड अभिलेख' : 'MY LAND — Identity-Linked Records'}
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isHindi ? 'आधार संख्या से प्रमाणित भूखंड:' : 'Authenticated under Aadhaar:'} <strong className="text-[#002856]">{currentUser?.aadhaarMasked || 'XXXX-XXXX-9023'}</strong>
            </p>
          </div>

          <button 
            onClick={() => setActiveTab('upload-document')}
            className="gov-btn-primary self-start sm:self-auto"
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#FF9933]" />
            <span>{isHindi ? 'नया भूखंड लिंक करें' : 'Link New Parcel'}</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {citizenParcels.map((parcel, idx) => {
            const riskBadge = 
              parcel.riskLevel === 'low' ? 'gov-badge-success' :
              parcel.riskLevel === 'medium' ? 'gov-badge-warning' :
              'gov-badge-danger';

            return (
              <div 
                key={parcel.id || parcel.parcelId}
                className="bg-[#F8FAFC] border border-[#D0D7DE] rounded p-3.5 flex flex-col justify-between hover:border-[#003D7C] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-white text-[#002856] border border-[#CBD5E1]">
                      Khasra #{parcel.khasraNo}
                    </span>
                    <span className={riskBadge}>
                      Risk Score: {parcel.riskScore || (idx === 0 ? 78 : 12)}/100
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-[#002856] mb-1">{parcel.owner}</h4>
                  <div className="text-[11px] text-slate-600 flex items-center gap-1 mb-2.5">
                    <MapPin className="w-3 h-3 text-[#003D7C] shrink-0" />
                    <span>{parcel.village}, {parcel.district}, {parcel.state}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2 rounded bg-white text-xs mb-3 border border-[#E2E8F0]">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">{isHindi ? 'क्षेत्रफल' : 'Area'}</span>
                      <span className="font-bold font-mono text-[#002856]">{parcel.areaRoR} Acres</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">{isHindi ? 'भूमि प्रकार' : 'Category'}</span>
                      <span className="font-bold text-slate-800">{parcel.landType}</span>
                    </div>
                  </div>

                  <div className="text-[11px] flex items-center gap-1.5 text-slate-600">
                    <span>{isHindi ? 'अभिलेख स्थिति:' : 'Registry Status:'}</span>
                    <span className="font-semibold text-[#138808] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#138808]" />
                      RoR Digitized
                    </span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-[#D0D7DE] flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedParcelId(parcel.parcelId);
                      setActiveTab('twin');
                    }}
                    className="flex-1 py-1.5 px-2 bg-[#E1EDF7] hover:bg-[#C2DCF0] text-[#003D7C] rounded text-xs font-bold transition-all flex items-center justify-center gap-1 border border-[#C2DCF0]"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isHindi ? 'डिजिटल लैंड ट्विन' : 'Digital Land Twin'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedParcelId(parcel.parcelId);
                      setActiveTab('track-progress');
                    }}
                    className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded text-xs border border-[#CBD5E1]"
                    title="Track Verification Pipeline"
                  >
                    <Activity className="w-3.5 h-3.5 text-[#138808]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. STATE-WISE LAND RECORD DIGITALISATION PROCESS TABLE                    */}
      {/* ========================================================================= */}
      <div className="gov-card p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D0D7DE]">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#003D7C]" />
              <h2 className="text-sm sm:text-base font-bold text-[#002856]">
                {isHindi ? 'राज्य-वार भूमि अभिलेख डिजिटलीकरण प्रगति (10 राज्य)' : 'State-wise Land Record Digitalisation Progress (10 States)'}
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isHindi ? 'झारभूमि, बिहार भूमि, यूपी भूलेख, महाभूमि आदि राज्य पोर्टलों से वास्तविक समय समन्वय।' : 'Real-time synchronization across state land revenue repositories.'}
            </p>
          </div>

          <span className="gov-badge-official self-start sm:self-auto">
            10 State Portals Connected
          </span>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th className="gov-th">{isHindi ? 'राज्य / संघ राज्य' : 'State / UT'}</th>
                <th className="gov-th">{isHindi ? 'कुल भूखंड' : 'Total Parcels'}</th>
                <th className="gov-th">{isHindi ? 'खतियान डिजिटलीकरण %' : 'RoR Digitized %'}</th>
                <th className="gov-th">{isHindi ? 'भू-नक्शा कैडस्ट्रल %' : 'GIS Cadastral %'}</th>
                <th className="gov-th">{isHindi ? 'एआई सत्यापन %' : 'AI Verification %'}</th>
                <th className="gov-th text-right">{isHindi ? 'डीआईएलआरएमपी स्थिति' : 'DILRMP Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {STATE_PROGRESS_DATA.map((item) => (
                <tr key={item.code} className="hover:bg-[#F8FAFC]">
                  <td className="gov-td font-bold text-[#002856]">
                    <span className="inline-block w-6 text-center px-1 py-0.5 rounded bg-[#F0F5FA] border border-[#CBD5E1] text-[10px] font-mono mr-2">
                      {item.code}
                    </span>
                    <span>{item.state}</span>
                  </td>

                  <td className="gov-td font-mono text-slate-700">
                    {item.parcelsCount}
                  </td>

                  <td className="gov-td">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-[#138808] h-full rounded-full" 
                          style={{ width: `${item.digitizedPercent}%` }}
                        />
                      </div>
                      <span className="text-[#138808] font-bold font-mono">{item.digitizedPercent}%</span>
                    </div>
                  </td>

                  <td className="gov-td">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-[#003D7C] h-full rounded-full" 
                          style={{ width: `${item.gisGeoreferencedPercent}%` }}
                        />
                      </div>
                      <span className="text-[#003D7C] font-bold font-mono">{item.gisGeoreferencedPercent}%</span>
                    </div>
                  </td>

                  <td className="gov-td">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-[#FF9933] h-full rounded-full" 
                          style={{ width: `${item.aiVerificationPercent}%` }}
                        />
                      </div>
                      <span className="text-[#B45309] font-bold font-mono">{item.aiVerificationPercent}%</span>
                    </div>
                  </td>

                  <td className="gov-td text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      item.status === 'Leading' ? 'bg-[#E8F5E9] text-[#138808] border-[#A5D6A7]' :
                      item.status === 'Rapid Progress' ? 'bg-[#E1EDF7] text-[#003D7C] border-[#C2DCF0]' :
                      'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. DEDICATED BHULEKH AI ASSISTANT CHATBOX (FLOATING BOTTOM-RIGHT)         */}
      {/* ========================================================================= */}
      <BhulekhAiAssistantChatbox />

    </div>
  );
};
