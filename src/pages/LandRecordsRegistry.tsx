import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { QualityBadge } from '../components/common/QualityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { TerminologyTooltip } from '../components/common/TerminologyTooltip';
import {
  Search,
  MapPin,
  FileSpreadsheet,
  ArrowUpDown,
  Eye,
  RefreshCw
} from 'lucide-react';

export const LandRecordsRegistry: React.FC = () => {
  const { parcels, setSelectedParcelId, setActiveTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('ALL');
  const [selectedRiskTier, setSelectedRiskTier] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedLandType, setSelectedLandType] = useState('ALL');
  const [sortBy, setSortBy] = useState<'khasra' | 'risk' | 'quality' | 'area'>('risk');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredParcels = useMemo(() => {
    return parcels.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        p.owner.toLowerCase().includes(q) ||
        p.khasraNo.includes(q) ||
        p.parcelId.toLowerCase().includes(q) ||
        p.khataNo.includes(q) ||
        p.fatherHusbandName.toLowerCase().includes(q);

      const matchesVillage = selectedVillage === 'ALL' || p.village === selectedVillage;
      const matchesRisk = selectedRiskTier === 'ALL' || p.riskLevel === selectedRiskTier;
      const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
      const matchesLandType = selectedLandType === 'ALL' || p.landType === selectedLandType;

      return matchesSearch && matchesVillage && matchesRisk && matchesStatus && matchesLandType;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'risk') comparison = a.riskScore - b.riskScore;
      else if (sortBy === 'quality') comparison = a.qualityScore - b.qualityScore;
      else if (sortBy === 'area') comparison = a.areaRoR - b.areaRoR;
      else if (sortBy === 'khasra') comparison = parseInt(a.khasraNo) - parseInt(b.khasraNo);

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [parcels, searchQuery, selectedVillage, selectedRiskTier, selectedStatus, selectedLandType, sortBy, sortOrder]);

  const handleOpenTwin = (parcelId: string) => {
    setSelectedParcelId(parcelId);
    setActiveTab('twin');
  };

  const handleOpenGis = (parcelId: string) => {
    setSelectedParcelId(parcelId);
    setActiveTab('gis');
  };

  const villages = ['ALL', 'Rampur', 'Lakshmipur', 'Madhopur', 'Haripur', 'Chandipur'];
  const riskTiers = ['ALL', 'critical', 'high', 'medium', 'low'];
  const statuses = ['ALL', 'verified', 'needs_review', 'high_risk', 'critical', 'field_verification_ordered'];
  const landTypes = ['ALL', 'Agricultural', 'Residential', 'Commercial', 'Forest/Gochar', 'Industrial'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-gov-600" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Land Records Directory & Cadastral Ledger
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Searchable database of authoritative <TerminologyTooltip termKey="RoR">Record of Rights (RoR)</TerminologyTooltip>, Khatiyans, and digitized Cadastral parcels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedVillage('ALL');
              setSelectedRiskTier('ALL');
              setSelectedStatus('ALL');
              setSelectedLandType('ALL');
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
          <button
            onClick={() => setActiveTab('digitization')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gov-600 hover:bg-gov-700 text-white shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <span>+ Digitize New Document</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-gov space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Owner Name (e.g. Rajesh Kumar), Khasra Number (e.g. 125), Khata Number, Father's Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gov-500/20 focus:border-gov-500"
          />
        </div>

        {/* Faceted Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 pt-1 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Revenue Village
            </label>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="w-full p-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-gov-500"
            >
              {villages.map(v => (
                <option key={v} value={v}>{v === 'ALL' ? 'All Villages' : v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Risk Assessment
            </label>
            <select
              value={selectedRiskTier}
              onChange={(e) => setSelectedRiskTier(e.target.value)}
              className="w-full p-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-gov-500 capitalize"
            >
              {riskTiers.map(r => (
                <option key={r} value={r}>{r === 'ALL' ? 'All Risk Levels' : r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Validation Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-gov-500"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s.replace(/_/g, ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Land Category
            </label>
            <select
              value={selectedLandType}
              onChange={(e) => setSelectedLandType(e.target.value)}
              className="w-full p-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-gov-500"
            >
              {landTypes.map(l => (
                <option key={l} value={l}>{l === 'ALL' ? 'All Categories' : l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Sort Attribute
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-gov-500"
            >
              <option value="risk">Risk Score</option>
              <option value="quality">Quality Score</option>
              <option value="khasra">Khasra Number</option>
              <option value="area">Total Area</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Sort Direction
            </label>
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="w-full p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-medium flex items-center justify-between"
            >
              <span>{sortOrder === 'desc' ? 'Highest First' : 'Lowest First'}</span>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count & Table */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-gov space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="font-bold text-slate-900">{filteredParcels.length}</strong> of {parcels.length} digitized land parcels in Dumka Circle
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>AI Verified & Cadastral Vector Synchronized</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Parcel ID & <TerminologyTooltip termKey="Khasra">Khasra</TerminologyTooltip></th>
                <th className="py-3 px-4">Village & <TerminologyTooltip termKey="Khata">Khata</TerminologyTooltip></th>
                <th className="py-3 px-4">Raiyat (Owner)</th>
                <th className="py-3 px-4">Area (RoR vs GIS)</th>
                <th className="py-3 px-4">Land Type</th>
                <th className="py-3 px-4">Quality Score</th>
                <th className="py-3 px-4">AI Risk Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParcels.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 font-mono text-sm">Khasra {p.khasraNo}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{p.parcelId}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{p.village}</div>
                    <div className="text-[11px] text-slate-500">Khata No: {p.khataNo}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{p.owner}</div>
                    <div className="text-[11px] text-slate-500">s/o {p.fatherHusbandName}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{p.areaRoR.toFixed(2)} Acre</div>
                    <div className={`text-[11px] font-mono ${Math.abs(p.areaRoR - p.areaGIS) > 0.05 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                      GIS: {p.areaGIS.toFixed(2)} ac
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                      {p.landType}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <QualityBadge score={p.qualityScore} size="sm" showLabel={false} />
                  </td>

                  <td className="py-3 px-4">
                    <RiskBadge score={p.riskScore} size="sm" />
                  </td>

                  <td className="py-3 px-4">
                    <StatusBadge status={p.status} size="sm" />
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenGis(p.parcelId)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-gov-100 hover:text-gov-700 text-slate-600 transition-colors"
                        title="View on Cadastral GIS Map"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenTwin(p.parcelId)}
                        className="px-2.5 py-1.5 rounded-lg bg-gov-600 hover:bg-gov-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Digital Twin</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
