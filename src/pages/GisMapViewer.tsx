import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LandParcel } from '../types/landRecord';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  useMap
} from 'react-leaflet';
import {
  Search,
  Eye,
  X,
  Sparkles
} from 'lucide-react';

// Subcomponent to smoothly pan map to selected parcel
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

export const GisMapViewer: React.FC = () => {
  const { parcels, selectedParcelId, setSelectedParcelId, setActiveTab, runValidationForParcel } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskTier, setSelectedRiskTier] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [mapLayer, setMapLayer] = useState<'osm' | 'topo' | 'satellite'>('osm');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  const selectedParcel = useMemo(() => {
    return parcels.find((p: LandParcel) => p.parcelId === selectedParcelId || p.id === selectedParcelId) || parcels[0];
  }, [parcels, selectedParcelId]);

  const mapCenter: [number, number] = useMemo(() => {
    if (selectedParcel && selectedParcel.geometry.coordinates[0]?.[0]) {
      const coord = selectedParcel.geometry.coordinates[0][0];
      return [coord[1], coord[0]];
    }
    return [24.2650, 87.2550];
  }, [selectedParcel]);

  const filteredParcels = useMemo(() => {
    return parcels.filter((p: LandParcel) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        p.owner.toLowerCase().includes(q) ||
        p.khasraNo.includes(q) ||
        p.parcelId.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q);

      const matchesRisk = selectedRiskTier === 'ALL' || p.riskLevel === selectedRiskTier;
      const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;

      return matchesSearch && matchesRisk && matchesStatus;
    });
  }, [parcels, searchQuery, selectedRiskTier, selectedStatus]);

  const getPolygonStyle = (p: LandParcel) => {
    const isSelected = p.parcelId === selectedParcelId;

    if (p.status === 'critical' || p.riskLevel === 'critical') {
      return {
        color: '#dc2626',
        fillColor: '#ef4444',
        fillOpacity: isSelected ? 0.75 : 0.45,
        weight: isSelected ? 3 : 2,
        dashArray: isSelected ? '4, 4' : undefined
      };
    }
    if (p.status === 'high_risk' || p.riskLevel === 'high') {
      return {
        color: '#ea580c',
        fillColor: '#f97316',
        fillOpacity: isSelected ? 0.75 : 0.45,
        weight: isSelected ? 3 : 2
      };
    }
    if (p.status === 'needs_review' || p.riskLevel === 'medium') {
      return {
        color: '#d97706',
        fillColor: '#f59e0b',
        fillOpacity: isSelected ? 0.75 : 0.45,
        weight: isSelected ? 3 : 2
      };
    }
    return {
      color: '#059669',
      fillColor: '#10b981',
      fillOpacity: isSelected ? 0.75 : 0.4,
      weight: isSelected ? 3 : 1.5
    };
  };

  const tileLayerUrls = {
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  const tileAttributions = {
    osm: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    topo: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap',
    satellite: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-900 flex">
      {/* Interactive Leaflet Map Container */}
      <div className="flex-1 h-full relative z-0">
        <MapContainer
          center={mapCenter}
          zoom={15}
          scrollWheelZoom={true}
          className="h-full w-full"
          style={{ background: '#0F172A' }}
        >
          <MapController center={mapCenter} zoom={15} />

          <TileLayer
            attribution={tileAttributions[mapLayer]}
            url={tileLayerUrls[mapLayer]}
          />

          {/* Render 30+ GeoJSON Cadastral Parcel Polygons */}
          {filteredParcels.map((p: LandParcel) => {
            const positions: [number, number][] = p.geometry.coordinates[0].map(c => [c[1], c[0]]);

            return (
              <Polygon
                key={p.id}
                positions={positions}
                pathOptions={getPolygonStyle(p)}
                eventHandlers={{
                  click: () => {
                    setSelectedParcelId(p.parcelId);
                    setIsSidePanelOpen(true);
                  }
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                  <div className="text-xs p-1">
                    <div className="font-bold text-slate-900">Khasra {p.khasraNo} ({p.village})</div>
                    <div className="text-slate-600">Owner: {p.owner}</div>
                    <div className="text-slate-600">Area: {p.areaRoR} Acre</div>
                    <div className={`font-bold mt-0.5 ${p.riskScore > 60 ? 'text-red-600' : 'text-emerald-600'}`}>
                      Risk Score: {p.riskScore}/100 ({p.riskLevel.toUpperCase()})
                    </div>
                  </div>
                </Tooltip>
              </Polygon>
            );
          })}
        </MapContainer>

        {/* Floating Top Control Bar */}
        <div className="absolute top-4 left-4 z-[1000] flex flex-wrap items-center gap-2 max-w-3xl bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-slate-200 text-xs">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Khasra (125), Owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 rounded-xl bg-slate-100 border-none text-xs font-medium focus:ring-1 focus:ring-gov-500"
            />
          </div>

          <select
            value={selectedRiskTier}
            onChange={(e) => setSelectedRiskTier(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 capitalize"
          >
            <option value="ALL">All Risk</option>
            <option value="critical">Critical</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium</option>
            <option value="low">Verified</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 capitalize"
          >
            <option value="ALL">All Status</option>
            <option value="verified">Verified</option>
            <option value="needs_review">Needs Review</option>
            <option value="high_risk">High Risk</option>
            <option value="critical">Critical</option>
            <option value="field_verification_ordered">Survey Ordered</option>
          </select>

          <select
            value={mapLayer}
            onChange={(e) => setMapLayer(e.target.value as any)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="osm">OpenStreetMap</option>
            <option value="satellite">Satellite Imagery</option>
            <option value="topo">Topographic</option>
          </select>

          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="p-1.5 rounded-lg bg-gov-600 text-white hover:bg-gov-700 font-semibold flex items-center gap-1"
            title="Toggle Parcel Inspector Panel"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inspector</span>
          </button>
        </div>

        {/* Floating Bottom Left Legend */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 hidden sm:block">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Cadastral Boundary Status
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500/80 border border-emerald-400" />
              <span>Verified (0-30)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-500/80 border border-amber-400" />
              <span>Needs Review (31-60)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-orange-500/80 border border-orange-400" />
              <span>High Risk (61-80)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-red-500/80 border border-red-400 animate-pulse" />
              <span>Critical (81-100)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side Inspector Drawer */}
      {isSidePanelOpen && (
        <div className="w-96 h-full bg-white border-l border-slate-200 z-10 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
          <div className="p-5 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="text-[10px] text-gov-600 font-bold uppercase tracking-wider">
                  Cadastral Parcel Inspector
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">
                  Khasra {selectedParcel.khasraNo}
                </h2>
                <div className="text-xs text-slate-500 font-mono">
                  {selectedParcel.parcelId}
                </div>
              </div>
              <button
                onClick={() => setIsSidePanelOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-2">
              <RiskBadge score={selectedParcel.riskScore} level={selectedParcel.riskLevel} size="md" />
              <StatusBadge status={selectedParcel.status} size="md" />
            </div>

            <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <div className="flex justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500">Recorded Owner:</span>
                <strong className="text-slate-900">{selectedParcel.owner}</strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500">Father / Husband:</span>
                <span className="text-slate-800">{selectedParcel.fatherHusbandName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500">Revenue Village:</span>
                <span className="text-slate-800 font-semibold">{selectedParcel.village} (Khata #{selectedParcel.khataNo})</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500">Recorded Area (RoR):</span>
                <span className="text-slate-900 font-mono font-bold">{selectedParcel.areaRoR} Acre</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cadastral Vector Area:</span>
                <span className={`font-mono font-bold ${Math.abs(selectedParcel.areaRoR - selectedParcel.areaGIS) > 0.05 ? 'text-red-600' : 'text-slate-900'}`}>
                  {selectedParcel.areaGIS} Acre
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                Cross-Record Diagnostic Summary
              </div>
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-2">
                <p className="text-blue-900 font-medium leading-relaxed">
                  {selectedParcel.riskAssessment.explainableSummary}
                </p>
                <div className="space-y-1 text-[11px] text-slate-700">
                  {selectedParcel.riskAssessment.topReasons.map((r: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-2">
            <button
              onClick={() => {
                setSelectedParcelId(selectedParcel.parcelId);
                setActiveTab('twin');
              }}
              className="w-full py-2.5 rounded-xl bg-gov-600 hover:bg-gov-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>Open 360° Digital Land Twin</span>
            </button>

            <button
              onClick={() => {
                runValidationForParcel(selectedParcel.parcelId);
                setActiveTab('validation');
              }}
              className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-gov-600" />
              <span>Run Validation Engine</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
