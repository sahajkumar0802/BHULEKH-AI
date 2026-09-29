import React, { useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LandParcel } from '../../types/landRecord';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  useMap
} from 'react-leaflet';

const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

export const GisCadastralViewer: React.FC<{ height?: string }> = ({ height = '400px' }) => {
  const { parcels, selectedParcelId, setSelectedParcelId } = useApp();

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

  const getPolygonStyle = (p: LandParcel) => {
    const isSelected = p.parcelId === selectedParcelId || p.id === selectedParcelId;

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

  return (
    <div style={{ height, width: '100%' }} className="relative z-0">
      <MapContainer
        center={mapCenter}
        zoom={16}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={mapCenter} zoom={16} />

        {parcels.map((p) => {
          const positions: [number, number][] = p.geometry.coordinates[0].map(
            (c: number[]) => [c[1], c[0]]
          );

          return (
            <Polygon
              key={p.id || p.parcelId}
              positions={positions}
              pathOptions={getPolygonStyle(p)}
              eventHandlers={{
                click: () => {
                  setSelectedParcelId(p.parcelId);
                }
              }}
            >
              <Tooltip sticky>
                <div className="text-xs p-1 font-sans">
                  <div className="font-bold text-slate-900">Khasra #{p.khasraNo}</div>
                  <div className="text-slate-600">{p.owner}</div>
                  <div className="text-[10px] text-slate-500">{p.areaRoR} Acres (RoR) • Risk: {p.riskScore}/100</div>
                </div>
              </Tooltip>
            </Polygon>
          );
        })}
      </MapContainer>
    </div>
  );
};
