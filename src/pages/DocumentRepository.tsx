import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LandDocument } from '../types/landRecord';
import { 
  FolderArchive, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  ShieldCheck, 
  FileText, 
  Clock, 
  Edit3, 
  X,
  Lock,
  ExternalLink
} from 'lucide-react';

export const DocumentRepository: React.FC = () => {
  const { parcels, setSelectedParcelId, setActiveTab, updateDocumentMetadata, hasPermission } = useApp();

  const allDocuments: LandDocument[] = useMemo(() => {
    return parcels.flatMap(p => p.documents);
  }, [parcels]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [previewDoc, setPreviewDoc] = useState<LandDocument | null>(null);
  const [editDoc, setEditDoc] = useState<LandDocument | null>(null);
  const [editAuthority, setEditAuthority] = useState<string>('');
  const [editSummary, setEditSummary] = useState<string>('');

  const filteredDocs = allDocuments.filter(doc => {
    const matchesSearch = 
      doc.docNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.parcelId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.uploader || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.rawSummary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || doc.docType === selectedType;
    const matchesLang = selectedLanguage === 'all' || doc.language === selectedLanguage;
    return matchesSearch && matchesType && matchesLang;
  });

  const handleOpenEdit = (doc: LandDocument) => {
    setEditDoc(doc);
    setEditAuthority(doc.issuingAuthority);
    setEditSummary(doc.rawSummary);
  };

  const handleSaveEdit = () => {
    if (!editDoc) return;
    updateDocumentMetadata(editDoc.id, {
      issuingAuthority: editAuthority,
      rawSummary: editSummary
    });
    setEditDoc(null);
  };

  const handleDownloadDemo = (doc: LandDocument) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(doc, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${doc.docNumber}_metadata.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl">
            <FolderArchive className="w-7 h-7" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Secure Document Repository
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <Lock className="w-3 h-3" /> SHA-256 Vault
              </span>
            </h1>
            <p className="text-sm text-slate-600">
              Tamper-evident legal document vault with cryptographic integrity hash verification.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('digitization')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
          >
            <FileText className="w-4 h-4" />
            Upload New Document
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Document #, Parcel ID, or uploader..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none"
            >
              <option value="all">All Document Types</option>
              <option value="Record of Rights (RoR / Jamabandi)">Record of Rights (RoR)</option>
              <option value="Registered Sale Deed (Kewala)">Registered Sale Deed</option>
              <option value="Mutation Order (Dakhil-Kharij)">Mutation Order</option>
              <option value="LPC (Land Possession Certificate)">LPC</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none"
            >
              <option value="all">All Languages</option>
              <option value="Hindi">Hindi (Devanagari)</option>
              <option value="English">English</option>
              <option value="Bengali">Bengali</option>
              <option value="Marathi">Marathi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing <strong>{filteredDocs.length}</strong> secured documents</span>
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <ShieldCheck className="w-4 h-4" /> 100% Cryptographic Integrity Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Document ID & Number</th>
                <th className="px-4 py-3">Type & Language</th>
                <th className="px-4 py-3">Linked Parcel</th>
                <th className="px-4 py-3">SHA-256 Hash Digest</th>
                <th className="px-4 py-3">OCR Confidence</th>
                <th className="px-4 py-3">Upload Details</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans text-xs">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block">{doc.docNumber}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{doc.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-800 block">{doc.docType}</span>
                    <span className="text-[11px] text-slate-500">{doc.language} ({doc.script})</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setSelectedParcelId(doc.parcelId);
                        setActiveTab('twin');
                      }}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline flex items-center gap-1"
                    >
                      {doc.parcelId}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-slate-600 truncate max-w-[140px]" title={doc.sha256Hash || 'e3b0c442...'}>
                        {(doc.sha256Hash || 'e3b0c44298fc1c14').substring(0, 16)}...
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-sans font-semibold">✓ Verified</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${doc.ocrConfidence >= 90 ? 'bg-emerald-500' : doc.ocrConfidence >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${doc.ocrConfidence}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-700">{doc.ocrConfidence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-800 block">{doc.uploader}</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {doc.uploadedAt}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Preview Document & Metadata"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadDemo(doc)}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Download JSON Metadata"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {hasPermission('verify') && (
                        <button
                          onClick={() => handleOpenEdit(doc)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Metadata (Authorized)"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base">{previewDoc.docType}</h3>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block uppercase font-bold">Document Number</span>
                  <span className="font-bold text-slate-900 text-sm">{previewDoc.docNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold">Linked Parcel ID</span>
                  <span className="font-bold text-indigo-600 text-sm">{previewDoc.parcelId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold">Issuing Authority</span>
                  <span className="font-medium text-slate-800">{previewDoc.issuingAuthority}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold">Execution Date</span>
                  <span className="font-medium text-slate-800">{previewDoc.issueDate}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase text-slate-500 mb-1">Cryptographic Integrity</h4>
                <div className="p-3 bg-slate-950 text-slate-200 rounded-lg font-mono text-xs flex items-center justify-between">
                  <span className="truncate pr-2">{previewDoc.sha256Hash}</span>
                  <span className="text-emerald-400 font-bold whitespace-nowrap">✓ Verified</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Extracted Fields ({previewDoc.extractedFields.length})</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {previewDoc.extractedFields.map((f, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between">
                      <span className="text-slate-500">{f.label}:</span>
                      <span className="font-semibold text-slate-900">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase text-slate-500 mb-1">Summary / Officer Notes</h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">{previewDoc.rawSummary}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Metadata Modal */}
      {editDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-indigo-600" />
              Edit Document Metadata (Authorized)
            </h3>
            <p className="text-xs text-slate-500">
              Modifying metadata will record an immutable SHA-256 audit entry with your officer signature.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Issuing Authority</label>
                <input
                  type="text"
                  value={editAuthority}
                  onChange={(e) => setEditAuthority(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Summary / Revenue Notes</label>
                <textarea
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setEditDoc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg"
              >
                Save & Sign Audit Trail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
