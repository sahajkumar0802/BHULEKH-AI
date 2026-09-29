import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/landRecord';
import {
  LayoutDashboard,
  Layers,
  FileScan,
  MapPin,
  CheckCheck,
  ShieldAlert,
  GitBranch,
  Bot,
  ListTodo,
  History,
  ShieldCheck,
  Sparkles,
  FileSpreadsheet,
  FolderArchive,
  Network,
  BrainCircuit,
  Terminal,
  Award,
  BarChart3,
  Settings,
  UserCheck,
  Lock,
  Search,
  Bell,
  ChevronDown,
  Check,
  LogOut,
  User,
  X,
  Grid,
  AlertCircle,
  Info
} from 'lucide-react';

interface FeatureItem {
  id: string;
  label: string;
  labelHi: string;
  desc: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  category: 'Citizen Services' | 'Revenue Officers (RBAC)' | 'Registry & Geospatial' | 'AI & Validation Core' | 'Governance & Platform';
  categoryHi: string;
}

const ALL_FEATURES: FeatureItem[] = [
  // 1. Citizen Services
  { id: 'user-dashboard', label: 'Citizen Dashboard', labelHi: 'नागरिक डैशबोर्ड', desc: 'Personal land locker, command centre ribbon & state metrics', icon: LayoutDashboard, badge: 'Portal', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-300', category: 'Citizen Services', categoryHi: 'नागरिक सेवाएं' },
  { id: 'upload-document', label: 'Upload Document', labelHi: 'दस्तावेज़ अपलोड', desc: 'Sale deed / Khatiyan AI OCR scan & conflict detection', icon: FileScan, badge: 'AI Direct', badgeColor: 'bg-blue-50 text-blue-700 border-blue-300', category: 'Citizen Services', categoryHi: 'नागरिक सेवाएं' },
  { id: 'check-document', label: 'Check Document', labelHi: 'दस्तावेज़ जांच (ULPIN)', desc: '14-digit verification search, e-Lagaan tax dues & GIS map', icon: CheckCheck, badge: 'Public', badgeColor: 'bg-sky-50 text-sky-700 border-sky-300', category: 'Citizen Services', categoryHi: 'नागरिक सेवाएं' },
  { id: 'track-progress', label: 'Track & Appeals', labelHi: 'स्थिति एवं अपील', desc: '3-stage statutory verification stepper & quasi-judicial appeals', icon: GitBranch, badge: 'Statutory', badgeColor: 'bg-amber-50 text-amber-700 border-amber-300', category: 'Citizen Services', categoryHi: 'नागरिक सेवाएं' },

  // 2. Revenue Officers (RBAC)
  { id: 'official-dashboard', label: 'Official Portal', labelHi: 'राजस्व अधिकारी पोर्टल', desc: 'Strict jurisdiction queue, 14-day SLA escalation & reviews', icon: ShieldCheck, badge: 'RBAC', badgeColor: 'bg-purple-50 text-purple-700 border-purple-300', category: 'Revenue Officers (RBAC)', categoryHi: 'राजस्व अधिकारी (RBAC)' },
  { id: 'queue', label: 'Verification Queue', labelHi: 'सत्यापन कतार', desc: 'Pending, flagged & disputed cases triage queue', icon: ListTodo, badge: 'Queue', badgeColor: 'bg-rose-50 text-rose-700 border-rose-300', category: 'Revenue Officers (RBAC)', categoryHi: 'राजस्व अधिकारी (RBAC)' },
  { id: 'audit', label: 'Audit Trail', labelHi: 'अपरिवर्तनीय ऑडिट ट्रेल', desc: 'Cryptographically hashed immutable mutation & action logs', icon: History, badge: 'SHA-256', badgeColor: 'bg-slate-100 text-slate-700 border-slate-300', category: 'Revenue Officers (RBAC)', categoryHi: 'राजस्व अधिकारी (RBAC)' },

  // 3. Registry & Geospatial
  { id: 'overview', label: 'National Overview', labelHi: 'राष्ट्रीय अवलोकन', desc: 'High-level pan-India land digitization command center', icon: BarChart3, category: 'Registry & Geospatial', categoryHi: 'पंजीकरण एवं भू-स्थानिक' },
  { id: 'records', label: 'Land Registry', labelHi: 'भू-अभिलेख डेटाबेस', desc: 'Tabular database of all registered cadastral parcels', icon: FileSpreadsheet, category: 'Registry & Geospatial', categoryHi: 'पंजीकरण एवं भू-स्थानिक' },
  { id: 'gis', label: 'GIS Cadastral Map', labelHi: 'भू-नक्शा कैडस्ट्रल मानचित्र', desc: 'Geo-referenced vector polygon parcel visualizer (Bhu-Naksha)', icon: MapPin, badge: 'Vector GIS', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-300', category: 'Registry & Geospatial', categoryHi: 'पंजीकरण एवं भू-स्थानिक' },
  { id: 'twin', label: 'Digital Land Twin', labelHi: 'डिजिटल लैंड ट्विन', desc: 'Unified 3D parcel dossier with title, tax & GIS layers', icon: Layers, badge: '3D Twin', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-300', category: 'Registry & Geospatial', categoryHi: 'पंजीकरण एवं भू-स्थानिक' },

  // 4. AI & Validation Core
  { id: 'digitization', label: 'Document Digitization', labelHi: 'बहुभाषी ओसीआर डिजिटलीकरण', desc: 'Multi-lingual OCR & NER extraction across 10 Indian scripts', icon: FileScan, badge: '10 Scripts', badgeColor: 'bg-purple-50 text-purple-700 border-purple-300', category: 'AI & Validation Core', categoryHi: 'एआई एवं सत्यापन कोर' },
  { id: 'documents', label: 'Document Repository', labelHi: 'दस्तावेज़ रिपॉजिटरी', desc: 'Digital repository of raw deeds with SHA-256 hashes', icon: FolderArchive, category: 'AI & Validation Core', categoryHi: 'एआई एवं सत्यापन कोर' },
  { id: 'validation', label: 'Validation Center', labelHi: 'विसंगति सत्यापन केंद्र', desc: 'Zero-trust 4-way cross-record discrepancy detector', icon: CheckCheck, category: 'AI & Validation Core', categoryHi: 'एआई एवं सत्यापन कोर' },
  { id: 'risk', label: 'Risk Intelligence', labelHi: 'जोखिम स्कोरिंग इंजन', desc: 'Explainable parcel risk scoring engine (0-100)', icon: ShieldAlert, category: 'AI & Validation Core', categoryHi: 'एआई एवं सत्यापन कोर' },
  { id: 'timeline', label: 'Ownership Timeline', labelHi: 'स्वामित्व वंशावली टाइमलाइन', desc: 'Historic chain-of-custody & mutation genealogy trees', icon: GitBranch, category: 'AI & Validation Core', categoryHi: 'एआई एवं सत्यापन कोर' },
  { id: 'assistant', label: 'AI Copilot Assistant', labelHi: 'एआई राजस्व सहायक', desc: 'Conversational revenue assistant for title questions', icon: Bot, badge: 'Copilot', badgeColor: 'bg-blue-50 text-blue-700 border-blue-300', category: 'AI & Validation Core', categoryHi: 'एआई एवं सत्यापन कोर' },
  { id: 'learning', label: 'AI Learning Center', labelHi: 'एआई लर्निंग सेंटर', desc: 'Human-in-the-loop retraining dataset & OCR corrections', icon: BrainCircuit, badge: '+8.7%', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-300', category: 'AI & Validation Core', categoryHi: 'एआई एवं सत्यापन कोर' },

  // 5. Governance & Platform
  { id: 'integrations', label: 'Gov Integrations', labelHi: 'शासकीय एपीआई एकीकरण', desc: 'DILRMP, CORDIS, e-Courts & NGDRS API connector status', icon: Network, badge: 'DILRMP', badgeColor: 'bg-blue-50 text-blue-700 border-blue-300', category: 'Governance & Platform', categoryHi: 'प्रशासन एवं प्लेटफ़ॉर्म' },
  { id: 'analytics', label: 'Analytics & SLA', labelHi: 'राजस्व विश्लेषण एवं एसएलए', desc: 'State and district-level performance & turnaround analytics', icon: BarChart3, category: 'Governance & Platform', categoryHi: 'प्रशासन एवं प्लेटफ़ॉर्म' },
  { id: 'security', label: 'Security & RBAC', labelHi: 'सुरक्षा एवं पहुँच नियंत्रण', desc: 'Access control matrices, role policies & session audits', icon: Lock, category: 'Governance & Platform', categoryHi: 'प्रशासन एवं प्लेटफ़ॉर्म' },
  { id: 'sih-coverage', label: 'SIH Requirements', labelHi: 'एसआईएच समस्या आवश्यकताएं', desc: '100% Problem statement requirement coverage checklist', icon: Award, badge: '100%', badgeColor: 'bg-amber-50 text-amber-700 border-amber-300', category: 'Governance & Platform', categoryHi: 'प्रशासन एवं प्लेटफ़ॉर्म' },
  { id: 'api-explorer', label: 'REST API Explorer', labelHi: 'एपीआई एक्सप्लोरर', desc: 'Live documentation & curl endpoints for 17 revenue APIs', icon: Terminal, category: 'Governance & Platform', categoryHi: 'प्रशासन एवं प्लेटफ़ॉर्म' },
  { id: 'settings', label: 'System Settings', labelHi: 'सिस्टम सेटिंग्स', desc: 'Model confidence thresholds, API keys & storage configs', icon: Settings, category: 'Governance & Platform', categoryHi: 'प्रशासन एवं प्लेटफ़ॉर्म' },
];

export const Navbar: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    currentUser,
    isAuthenticated,
    logoutUser,
    selectedDistrict,
    selectedState,
    setIsSearchOpen,
    startDemoTour,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setSelectedParcelId,
    activeTab,
    setActiveTab,
    govLanguage
  } = useApp();

  const isHindi = govLanguage === 'hi';

  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [featureSearchQuery, setFeatureSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const featuresRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (featuresRef.current && !featuresRef.current.contains(e.target as Node)) {
        setIsFeaturesOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: { role: UserRole; title: string; desc: string; icon: any }[] = [
    { role: 'citizen', title: isHindi ? 'नागरिक / भूमिधारक' : 'Citizen / Landholder', desc: isHindi ? 'खतियान खोज, दस्तावेज अपलोड व अपील' : 'Public search, upload documents & file appeals', icon: User },
    { role: 'patwari', title: isHindi ? 'खंड विकास अधिकारी (BDO / RI)' : 'Level 1: BDO / Revenue Inspector', desc: isHindi ? 'क्षेत्र सत्यापन व प्रारंभिक अभिलेख जांच' : 'Field inspection & initial document check', icon: User },
    { role: 'tehsildar', title: isHindi ? 'अंचल अधिकारी (Circle Officer)' : 'Level 2: Circle Officer (CO)', desc: isHindi ? 'अर्ध-न्यायिक विवाद समीक्षा व दाखिल-खारिज' : 'Quasi-judicial dispute review & mutation approval', icon: ShieldCheck },
    { role: 'district_officer', title: isHindi ? 'जिला समाहर्ता (Collector / DM)' : 'Level 3: District Collector (DM)', desc: isHindi ? 'अंतिम वैधानिक सत्यापन व जिला अपील' : 'Final statutory approval & district oversight', icon: ShieldCheck },
    { role: 'admin', title: isHindi ? 'सिस्टम प्रशासक (IT Admin)' : 'System Administrator', desc: isHindi ? 'DILRMP पाइपलाइन, ऑडिट व सुरक्षा' : 'DILRMP pipelines, API explorer & audit trails', icon: Lock }
  ];

  const filteredFeatures = ALL_FEATURES.filter(f => 
    f.label.toLowerCase().includes(featureSearchQuery.toLowerCase()) ||
    f.labelHi.includes(featureSearchQuery) ||
    f.desc.toLowerCase().includes(featureSearchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(featureSearchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(ALL_FEATURES.map(f => f.category)));
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#003D7C] text-white shadow-md border-b-2 border-[#002856] select-none">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 h-12 sm:h-13 flex items-center justify-between gap-2">
        
        {/* ========================================================================= */}
        {/* LEFT: MAIN GOVERNMENT NAVIGATION MENU TABS                                */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-0 overflow-x-auto no-scrollbar">
          
          {/* FEATURES Directory Mega-Menu Trigger */}
          <div className="relative shrink-0" ref={featuresRef}>
            <button
              onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all border ${
                isFeaturesOpen
                  ? 'bg-[#FF9933] text-[#002856] border-[#FF9933] shadow-xs'
                  : 'bg-[#002856] text-white hover:bg-[#001A3A] border-[#0B4F8A]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{isHindi ? 'सेवाएं / सुविधाएं' : 'ALL SERVICES'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Central Features Mega-Menu Dropdown */}
            {isFeaturesOpen && (
              <div className="fixed sm:absolute top-16 sm:top-full left-2 right-2 sm:left-0 sm:w-[740px] max-h-[85vh] sm:max-h-[560px] bg-white text-slate-900 rounded-md shadow-2xl border-2 border-[#003D7C] p-4 z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 mt-1">
                {/* Search Bar in Features Menu */}
                <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-[#D0D7DE] mb-3 bg-[#F0F5FA] p-2 rounded">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#003D7C] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={featureSearchQuery}
                      onChange={(e) => setFeatureSearchQuery(e.target.value)}
                      placeholder={isHindi ? 'सभी 20+ सेवाएं खोजें (उदा. अपलोड, खतियान, भू-नक्शा, जोखिम)...' : 'Search all 20+ services (e.g. Upload, GIS, Risk, Timeline)...'}
                      className="w-full pl-9 pr-4 py-1.5 rounded bg-white border border-[#CBD5E1] text-xs font-medium text-slate-900 placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#003D7C]"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={() => setIsFeaturesOpen(false)}
                    className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Categorized Features Grid */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-[440px]">
                  {categories.map((category) => {
                    const items = filteredFeatures.filter(f => f.category === category);
                    if (items.length === 0) return null;

                    const catTitle = isHindi ? items[0].categoryHi : category;

                    return (
                      <div key={category} className="space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#003D7C] bg-[#F0F5FA] px-2 py-1 rounded border-l-3 border-[#003D7C]">
                          {catTitle}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {items.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;

                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setActiveTab(item.id);
                                  setIsFeaturesOpen(false);
                                  setFeatureSearchQuery('');
                                }}
                                className={`flex items-start gap-2.5 p-2 rounded border text-left transition-all ${
                                  isActive
                                    ? 'bg-[#E1EDF7] border-[#003D7C] text-[#002856] font-bold'
                                    : 'bg-white hover:bg-[#F8FAFC] border-[#E2E8F0] text-slate-800 hover:border-[#003D7C]'
                                }`}
                              >
                                <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                                  isActive ? 'bg-[#003D7C] text-white' : 'bg-[#F0F5FA] text-[#003D7C]'
                                }`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-bold text-xs truncate text-[#002856]">
                                      {isHindi ? item.labelHi : item.label}
                                    </span>
                                    {item.badge && (
                                      <span className={`text-[9px] px-1 py-0.2 rounded font-semibold border ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                                    {item.desc}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Direct Government Nav Tabs (Sharp, rectangular, crisp) */}
          <nav className="flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('user-dashboard')}
              className={`px-2.5 py-1.5 rounded transition-all whitespace-nowrap border ${
                activeTab === 'user-dashboard'
                  ? 'bg-[#002856] text-[#FF9933] font-bold border-[#FF9933] shadow-2xs'
                  : 'text-white hover:bg-[#002856] border-transparent'
              }`}
            >
              {isHindi ? 'नागरिक डैशबोर्ड' : 'Citizen Dashboard'}
            </button>
            <button
              onClick={() => setActiveTab('upload-document')}
              className={`px-2.5 py-1.5 rounded transition-all whitespace-nowrap border ${
                activeTab === 'upload-document'
                  ? 'bg-[#002856] text-[#FF9933] font-bold border-[#FF9933] shadow-2xs'
                  : 'text-white hover:bg-[#002856] border-transparent'
              }`}
            >
              {isHindi ? 'दस्तावेज़ अपलोड' : 'Upload Deed'}
            </button>
            <button
              onClick={() => setActiveTab('check-document')}
              className={`px-2.5 py-1.5 rounded transition-all whitespace-nowrap border ${
                activeTab === 'check-document'
                  ? 'bg-[#002856] text-[#FF9933] font-bold border-[#FF9933] shadow-2xs'
                  : 'text-white hover:bg-[#002856] border-transparent'
              }`}
            >
              {isHindi ? 'खतियान/भू-अभिलेख जांच' : 'Check Record'}
            </button>
            <button
              onClick={() => setActiveTab('track-progress')}
              className={`px-2.5 py-1.5 rounded transition-all whitespace-nowrap border ${
                activeTab === 'track-progress'
                  ? 'bg-[#002856] text-[#FF9933] font-bold border-[#FF9933] shadow-2xs'
                  : 'text-white hover:bg-[#002856] border-transparent'
              }`}
            >
              {isHindi ? 'स्थिति एवं अपील' : 'Track & Appeals'}
            </button>
            <button
              onClick={() => setActiveTab('official-dashboard')}
              className={`px-2.5 py-1.5 rounded transition-all whitespace-nowrap border ${
                activeTab === 'official-dashboard'
                  ? 'bg-[#002856] text-[#FF9933] font-bold border-[#FF9933] shadow-2xs'
                  : 'text-white hover:bg-[#002856] border-transparent'
              }`}
            >
              {isHindi ? 'राजस्व अधिकारी पोर्टल' : 'Official Portal (RBAC)'}
            </button>
          </nav>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT: SEARCH, ALERTS, DEMO TOUR, USER PROFILE & LOGOUT                  */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Universal Search trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#002856] hover:bg-[#001A3A] border border-[#0B4F8A] text-xs text-[#E1EDF7] font-medium transition-all"
            title="Search Land Records (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5 text-[#FF9933]" />
            <span className="hidden lg:inline">{isHindi ? 'खोजें' : 'Search'}</span>
            <kbd className="hidden xl:inline-block px-1 bg-[#001A3A] text-[#8FBFE4] border border-[#0B4F8A] rounded text-[9px] font-mono">
              Ctrl K
            </kbd>
          </button>

          {/* Real-time Notifications Popover */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-1.5 rounded bg-[#002856] hover:bg-[#001A3A] border border-[#0B4F8A] text-white transition-colors"
              title="Revenue Alerts"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-1.5 w-80 sm:w-96 bg-white text-slate-900 rounded-md shadow-2xl border-2 border-[#003D7C] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#D0D7DE]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#002856]">
                    <Bell className="w-3.5 h-3.5 text-[#003D7C]" />
                    <span>{isHindi ? 'वास्तविक समय राजस्व अलर्ट' : 'Real-time Revenue Alerts'}</span>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[10px] text-[#003D7C] hover:underline font-bold"
                    >
                      {isHindi ? 'सभी साफ़ करें' : 'Clear All'}
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1.5">
                  {notifications.length === 0 ? (
                    <div className="py-4 text-center text-xs text-slate-400">
                      {isHindi ? 'कोई नया अलर्ट नहीं है' : 'No active alerts'}
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.parcelId) {
                            setSelectedParcelId(n.parcelId);
                            setActiveTab('twin');
                            setIsNotifOpen(false);
                          }
                        }}
                        className={`p-2 rounded border text-xs cursor-pointer transition-all ${
                          n.read
                            ? 'bg-[#F8FAFC] border-[#E2E8F0] text-slate-600'
                            : 'bg-[#FFF8E1] border-[#FDE68A] text-slate-900 shadow-2xs font-medium'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {n.type === 'alert' ? (
                            <AlertCircle className="w-3.5 h-3.5 text-[#DC2626] shrink-0 mt-0.5" />
                          ) : (
                            <Info className="w-3.5 h-3.5 text-[#003D7C] shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-[#002856] flex items-center justify-between">
                              <span className="truncate">{n.title}</span>
                              <span className="text-[9px] text-slate-500 font-normal shrink-0 ml-1">{n.time}</span>
                            </div>
                            <p className="text-slate-700 text-[11px] mt-0.5 leading-snug">{n.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Guided SIH Demo Tour Button */}
          <button
            onClick={startDemoTour}
            className="px-2.5 py-1 rounded text-xs font-bold bg-[#FF9933] hover:bg-[#E65100] text-[#002856] hover:text-white border border-[#E65100] shadow-xs transition-all flex items-center gap-1 active:scale-95"
            title="Start SIH 2026 Live Demo Tour"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isHindi ? 'लाइव डेमो' : 'Demo Tour'}</span>
          </button>

          {/* AUTHENTICATED USER PROFILE OR SIGN IN BUTTON */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1">
              {/* Profile Popover Trigger */}
              <div className="relative" ref={profileRef}>
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded bg-[#002856] hover:bg-[#001A3A] border border-[#0B4F8A] text-xs transition-all"
                >
                  <div className="w-5 h-5 rounded bg-[#FF9933] text-[#002856] flex items-center justify-center text-[10px] font-bold">
                    {currentUser?.name ? currentUser.name.charAt(0) : activeRole.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden lg:block leading-none">
                    <div className="font-bold text-white text-[11px] truncate max-w-[90px]">
                      {currentUser?.name || activeRole.replace(/_/g, ' ')}
                    </div>
                  </div>
                  <ChevronDown className={`w-3 h-3 text-[#8FBFE4] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile & Role Switcher Popover */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-1.5 w-76 bg-white text-slate-900 rounded-md shadow-2xl border-2 border-[#003D7C] p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* Active User Header */}
                    <div className="pb-2.5 border-b border-[#D0D7DE] mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-[#003D7C] text-white flex items-center justify-center font-bold text-xs">
                          {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-[#002856] text-xs">
                            {currentUser?.name || 'Ramesh Kumar'}
                          </div>
                          <div className="text-[10px] text-slate-600 font-medium">
                            {currentUser?.designation || (activeRole === 'citizen' ? 'Citizen / Landholder' : 'Government Revenue Officer')}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 px-2 py-1 rounded bg-[#F0F5FA] text-[10px] text-slate-700 font-mono flex items-center justify-between border border-[#D0D7DE]">
                        <span>{isHindi ? 'अधिकार क्षेत्र:' : 'Jurisdiction:'}</span>
                        <span className="font-bold text-[#002856]">{selectedDistrict}, {selectedState}</span>
                      </div>
                    </div>

                    {/* Persona / Role Selector */}
                    <div className="space-y-1 mb-2.5">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-[#003D7C] px-1">
                        {isHindi ? 'सक्रिय प्राधिकारी (RBAC)' : 'Active Authority (RBAC)'}
                      </div>
                      {roles.map((r) => {
                        const isCurrent = activeRole === r.role;
                        const Icon = r.icon;

                        return (
                          <button
                            key={r.role}
                            onClick={() => {
                              setActiveRole(r.role);
                              setIsProfileOpen(false);
                              if (r.role === 'citizen') {
                                setActiveTab('user-dashboard');
                              } else {
                                setActiveTab('official-dashboard');
                              }
                            }}
                            className={`w-full text-left p-1.5 rounded text-xs transition-all flex items-center justify-between ${
                              isCurrent
                                ? 'bg-[#E1EDF7] text-[#002856] font-bold border border-[#003D7C]'
                                : 'text-slate-700 hover:bg-[#F8FAFC]'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#003D7C]' : 'text-slate-400'}`} />
                              <div>
                                <div className="text-[11px]">{r.title}</div>
                              </div>
                            </div>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-[#003D7C] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Prominent Full-Width Logout Action in User Profile */}
                    <div className="pt-2 border-t border-[#D0D7DE]">
                      <button
                        id="user-profile-logout-btn"
                        onClick={() => {
                          logoutUser();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-[#FFEBEE] hover:bg-[#FFCDD2] text-[#C62828] font-bold text-xs border border-[#FFCDD2] transition-all"
                      >
                        <LogOut className="w-3.5 h-3.5 text-[#C62828]" />
                        <span>{isHindi ? 'लॉग आउट (Logout)' : 'Logout'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Quick Logout Button on Navbar */}
              <button
                id="navbar-quick-logout-btn"
                onClick={() => logoutUser()}
                className="px-2 py-1 rounded bg-[#002856] hover:bg-[#C62828] text-white border border-[#0B4F8A] hover:border-[#C62828] transition-all text-xs font-bold flex items-center gap-1"
                title="Logout session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-xs">{isHindi ? 'लॉग आउट' : 'Logout'}</span>
              </button>
            </div>
          ) : (
            <button
              id="navbar-signin-btn"
              onClick={() => setActiveTab('signin')}
              className="flex items-center gap-1 px-3 py-1 rounded bg-[#FF9933] hover:bg-[#E65100] text-[#002856] hover:text-white text-xs font-bold border border-[#E65100] shadow-xs transition-all active:scale-95"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{isHindi ? 'साइन इन' : 'Sign In'}</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
