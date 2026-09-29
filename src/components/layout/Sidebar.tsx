import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
  ChevronLeft,
  ChevronRight,
  Home,
  FileSpreadsheet,
  FolderArchive,
  Network,
  BrainCircuit,
  Terminal,
  Award,
  BarChart3,
  Settings,
  UserCheck,
  Lock
} from 'lucide-react';

interface NavSection {
  title: string;
  items: {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: string | null;
    badgeColor?: string;
  }[];
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, parcels, auditLogs } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  // Count flagged items in queue
  const flaggedCount = parcels.filter(p => p.status === 'critical' || p.status === 'high_risk').length;

  const navSections: NavSection[] = [
    {
      title: 'Citizen Services',
      items: [
        { id: 'user-dashboard', label: 'Citizen Dashboard', icon: LayoutDashboard, badge: 'Portal', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
        { id: 'upload-document', label: 'Upload Document', icon: FileScan, badge: 'AI Scan', badgeColor: 'bg-gov-500/20 text-gov-300 border border-gov-500/30' },
        { id: 'check-document', label: 'Check Document', icon: CheckCheck, badge: 'GIS & Tax', badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
        { id: 'track-progress', label: 'Track & Appeals', icon: GitBranch, badge: 'Statutory', badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
      ]
    },
    {
      title: 'Revenue Officers (RBAC)',
      items: [
        { id: 'official-dashboard', label: 'Official Portal', icon: ShieldCheck, badge: 'Verified', badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' },
        { id: 'queue', label: 'Verification Queue', icon: ListTodo, badge: `${flaggedCount}`, badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30' },
        { id: 'audit', label: 'Audit Trail', icon: History, badge: `${auditLogs.length}`, badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700' },
      ]
    },
    {
      title: 'Registry & Geospatial',
      items: [
        { id: 'overview', label: 'National Command', icon: BarChart3 },
        { id: 'records', label: 'Land Registry', icon: FileSpreadsheet, badge: `${parcels.length}`, badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700' },
        { id: 'gis', label: 'GIS Cadastral Map', icon: MapPin, badge: '100+ Parcels', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
        { id: 'twin', label: 'Digital Land Twin', icon: Layers, badge: '3D Live', badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' },
      ]
    },
    {
      title: 'AI & Validation Core',
      items: [
        { id: 'digitization', label: 'Document Digitization', icon: FileScan, badge: '10 Scripts', badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' },
        { id: 'documents', label: 'Document Repository', icon: FolderArchive, badge: 'SHA-256', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
        { id: 'validation', label: 'Validation Center', icon: CheckCheck },
        { id: 'risk', label: 'Risk Intelligence', icon: ShieldAlert },
        { id: 'timeline', label: 'Ownership Timeline', icon: GitBranch },
        { id: 'assistant', label: 'AI Copilot Assistant', icon: Bot, badge: 'AI', badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
        { id: 'learning', label: 'AI Learning Center', icon: BrainCircuit, badge: '+8.7%', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
      ]
    },
    {
      title: 'Governance & Platform',
      items: [
        { id: 'integrations', label: 'Gov Integrations', icon: Network, badge: 'DILRMP', badgeColor: 'bg-gov-500/20 text-gov-300 border border-gov-500/30' },
        { id: 'analytics', label: 'Analytics & SLA', icon: BarChart3 },
        { id: 'security', label: 'Security & RBAC', icon: Lock },
        { id: 'sih-coverage', label: 'SIH Requirements', icon: Award, badge: '100%', badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
        { id: 'api-explorer', label: 'REST API Explorer', icon: Terminal, badge: '17 APIs', badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700' },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 flex flex-col justify-between shrink-0 z-20 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Quick Action Buttons: Home & Sign In */}
      <div className="p-2 border-b border-slate-800/80 space-y-1">
        <button
          onClick={() => setActiveTab('landing')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group relative ${
            activeTab === 'landing'
              ? 'bg-gov-600 text-white shadow-md shadow-gov-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
          title={collapsed ? 'Landing Page' : undefined}
        >
          <Home className={`w-4 h-4 shrink-0 transition-transform ${activeTab === 'landing' ? 'text-white' : 'text-slate-400 group-hover:text-gov-400'}`} />
          {!collapsed && <span className="flex-1 text-left truncate tracking-tight font-medium">Public Portal</span>}
        </button>

        <button
          onClick={() => setActiveTab('signin')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group relative ${
            activeTab === 'signin'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-amber-300/80 hover:text-amber-200 hover:bg-slate-800/60'
          }`}
          title={collapsed ? 'Sign In / Auth' : undefined}
        >
          <UserCheck className={`w-4 h-4 shrink-0 transition-transform ${activeTab === 'signin' ? 'text-white' : 'text-amber-400 group-hover:text-amber-300'}`} />
          {!collapsed && (
            <>
              <span className="flex-1 text-left truncate tracking-tight font-medium">Sign In / Switch Role</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                SSO
              </span>
            </>
          )}
        </button>
      </div>

      {/* Structured Categorized Navigation Sections */}
      <div className="py-2 px-2 flex-1 overflow-y-auto space-y-4">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 pt-1 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>{section.title}</span>
              </div>
            )}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-gov-600 to-indigo-600 text-white font-semibold shadow-md shadow-gov-600/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-white scale-105' : 'text-slate-400 group-hover:text-gov-400'}`} />

                    {!collapsed && (
                      <span className="flex-1 text-left truncate tracking-tight">
                        {item.label}
                      </span>
                    )}

                    {!collapsed && item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold tracking-tight ${
                          item.badgeColor || 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Collapsed Tooltip on hover */}
                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-950 text-white rounded-lg text-xs font-medium whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none z-50 border border-slate-800 transition-opacity">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Toggle & System Version */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        {!collapsed && (
          <div className="mb-2 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px]">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIH 2026 Production Ready</span>
            </div>
            <div className="text-slate-400 text-[10px] mt-0.5">
              Deterministic Verification &amp; AI Stack
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="text-[10px] text-slate-500 font-mono">
              BHULEKH AI v2.4 • DILRMP
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-auto"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
};

