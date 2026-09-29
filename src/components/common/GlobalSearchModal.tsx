import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, MapPin, FileText, ArrowRight, Layers, AlertTriangle } from 'lucide-react';
import { RiskBadge } from './RiskBadge';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, parcels, setSelectedParcelId, setActiveTab } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return { parcels: [], documents: [], mutations: [] };

    const q = query.toLowerCase().trim();

    const matchedParcels = parcels.filter(p =>
      p.owner.toLowerCase().includes(q) ||
      p.khasraNo.includes(q) ||
      p.parcelId.toLowerCase().includes(q) ||
      p.village.toLowerCase().includes(q) ||
      p.fatherHusbandName.toLowerCase().includes(q)
    );

    const matchedDocs: { parcel: typeof parcels[0]; doc: typeof parcels[0]['documents'][0] }[] = [];
    parcels.forEach(p => {
      p.documents.forEach(d => {
        if (
          d.docNumber.toLowerCase().includes(q) ||
          d.docType.toLowerCase().includes(q) ||
          d.rawSummary.toLowerCase().includes(q)
        ) {
          matchedDocs.push({ parcel: p, doc: d });
        }
      });
    });

    const matchedMutations: { parcel: typeof parcels[0]; mut: typeof parcels[0]['mutations'][0] }[] = [];
    parcels.forEach(p => {
      p.mutations.forEach(m => {
        if (
          m.mutationNo.toLowerCase().includes(q) ||
          m.transferor.toLowerCase().includes(q) ||
          m.transferee.toLowerCase().includes(q) ||
          m.remarks.toLowerCase().includes(q)
        ) {
          matchedMutations.push({ parcel: p, mut: m });
        }
      });
    });

    return {
      parcels: matchedParcels,
      documents: matchedDocs,
      mutations: matchedMutations
    };
  }, [query, parcels]);

  if (!isSearchOpen) return null;

  const handleSelectParcel = (parcelId: string, targetTab = 'twin') => {
    setSelectedParcelId(parcelId);
    setActiveTab(targetTab);
    setIsSearchOpen(false);
    setQuery('');
  };

  const totalHits = searchResults.parcels.length + searchResults.documents.length + searchResults.mutations.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/70">
          <Search className="w-5 h-5 text-gov-600 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search by Owner (Rajesh Kumar), Khasra (125), Parcel ID, Village, or Deed # (REG-2018)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-slate-900 placeholder-slate-400 focus:outline-none text-base font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-xs px-2 py-1 bg-slate-200 text-slate-600 rounded font-mono">ESC</span>
        </div>

        {/* Quick suggestions when query is empty */}
        {!query && (
          <div className="p-6 text-sm text-slate-500">
            <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
              Popular Quick Searches
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { label: 'Khasra 125 (Rajesh Kumar)', q: '125' },
                { label: 'Khasra 218 (Duplicate Deed)', q: '218' },
                { label: 'Khasra 341 (Anita Devi)', q: '341' },
                { label: 'Rampur Village', q: 'Rampur' },
                { label: 'Deed REG-2018-8831', q: 'REG-2018-8831' }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(chip.q)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-gov-50 hover:text-gov-700 text-slate-700 text-xs font-medium transition-colors border border-slate-200"
                >
                  {chip.label}
                </button>
              ))}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Multi-Registry search querying RoR Jamabandi, Bhu-Naksha GIS, Mutation Registers, and Sub-Registrar Deeds.</span>
            </div>
          </div>
        )}

        {/* Search Results */}
        {query && (
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
            {totalHits === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <p className="text-base font-semibold text-slate-700">No matching revenue records found</p>
                <p className="text-xs mt-1">Try searching by Khasra number (e.g. 125), owner name, or village.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                  <span>Found {totalHits} result(s)</span>
                  <span className="font-semibold text-gov-700">
                    {searchResults.parcels.length} Parcels • {searchResults.documents.length} Documents • {searchResults.mutations.length} Mutations
                  </span>
                </div>

                {searchResults.parcels.length > 0 && (
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Land Parcels ({searchResults.parcels.length})</span>
                    </div>
                    <div className="space-y-2">
                      {searchResults.parcels.map(p => (
                        <div
                          key={p.id}
                          onClick={() => handleSelectParcel(p.parcelId, 'twin')}
                          className="p-3 rounded-xl border border-slate-200 hover:border-gov-400 hover:bg-gov-50/50 cursor-pointer transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gov-100 text-gov-700 flex items-center justify-center font-bold text-sm">
                              {p.khasraNo}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 group-hover:text-gov-700">
                                  Khasra {p.khasraNo} — {p.owner}
                                </span>
                                <span className="text-xs text-slate-500">Khata {p.khataNo}</span>
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                                <span>{p.village}, {p.district}</span>
                                <span>•</span>
                                <span>{p.areaRoR} Acre ({p.landType})</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <RiskBadge score={p.riskScore} size="sm" />
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-gov-600 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.documents.length > 0 && (
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Land Documents & Deeds ({searchResults.documents.length})</span>
                    </div>
                    <div className="space-y-2">
                      {searchResults.documents.map(({ parcel, doc }) => (
                        <div
                          key={doc.id}
                          onClick={() => handleSelectParcel(parcel.parcelId, 'twin')}
                          className="p-3 rounded-xl border border-slate-200 hover:border-gov-400 hover:bg-gov-50/50 cursor-pointer transition-all flex items-center justify-between group text-xs"
                        >
                          <div>
                            <div className="font-semibold text-slate-900 group-hover:text-gov-700 flex items-center gap-2">
                              <span>{doc.docType}</span>
                              <span className="font-mono text-gov-700 bg-gov-50 px-1.5 py-0.5 rounded border border-gov-200">
                                {doc.docNumber}
                              </span>
                            </div>
                            <div className="text-slate-500 mt-1">
                              Linked to Khasra {parcel.khasraNo} ({parcel.owner}, {parcel.village})
                            </div>
                          </div>
                          <span className="text-slate-400 group-hover:text-gov-600 font-medium">View Twin →</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.mutations.length > 0 && (
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Mutation Records ({searchResults.mutations.length})</span>
                    </div>
                    <div className="space-y-2">
                      {searchResults.mutations.map(({ parcel, mut }) => (
                        <div
                          key={mut.id}
                          onClick={() => handleSelectParcel(parcel.parcelId, 'validation')}
                          className="p-3 rounded-xl border border-slate-200 hover:border-gov-400 hover:bg-gov-50/50 cursor-pointer transition-all flex items-center justify-between group text-xs"
                        >
                          <div>
                            <div className="font-semibold text-slate-900 group-hover:text-gov-700">
                              Mutation #{mut.mutationNo} ({mut.natureOfTransfer})
                            </div>
                            <div className="text-slate-500 mt-0.5">
                              {mut.transferor} → <span className="font-semibold text-slate-800">{mut.transferee}</span> (Khasra {parcel.khasraNo})
                            </div>
                          </div>
                          <span className="text-slate-400 group-hover:text-gov-600 font-medium">Validate →</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono">↓</kbd> to navigate</span>
            <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono">ENTER</kbd> to open</span>
          </div>
          <span className="font-medium text-gov-700">BHULEKH AI Global Registry</span>
        </div>
      </div>
    </div>
  );
};
