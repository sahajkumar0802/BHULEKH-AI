import { SYNTHETIC_LAND_PARCELS, API_ROUTES_DOCUMENTATION } from '../data/syntheticLandData';
import { LandParcel, ApiRouteDoc } from '../types/landRecord';
import { detectDocumentLanguage } from './languageOcrService';
import { classifyLandDocument } from './documentClassifierService';
import { extractRevenueFields } from './fieldExtractionService';

export class BhulekhApiClient {
  private parcels: LandParcel[] = [...SYNTHETIC_LAND_PARCELS];

  public getApiRoutes(): ApiRouteDoc[] {
    return API_ROUTES_DOCUMENTATION;
  }

  public async executeEndpoint(path: string, method: string, requestBody?: Record<string, unknown>): Promise<unknown> {
    // Simulate network latency
    await new Promise(r => setTimeout(r, 200));

    // 1. GET /api/parcels
    if (path === '/api/parcels' && method === 'GET') {
      return {
        total: this.parcels.length,
        parcels: this.parcels.slice(0, 10).map(p => ({
          parcelId: p.parcelId,
          khasraNo: p.khasraNo,
          khataNo: p.khataNo,
          village: p.village,
          owner: p.owner,
          areaRoR: p.areaRoR,
          riskScore: p.riskScore,
          status: p.status
        }))
      };
    }

    // 2. GET /api/parcels/:id
    if (path.startsWith('/api/parcels/') && method === 'GET') {
      const id = path.split('/').pop();
      const parcel = this.parcels.find(p => p.id === id || p.parcelId === id || p.khasraNo === id);
      if (parcel) return parcel;
      return { error: 'Parcel not found', status: 404 };
    }

    // 3. GET /api/documents
    if (path === '/api/documents' && method === 'GET') {
      const allDocs = this.parcels.flatMap(p => p.documents);
      return { total: allDocs.length, documents: allDocs.slice(0, 15) };
    }

    // 4. POST /api/documents/upload
    if (path === '/api/documents/upload' && method === 'POST') {
      return {
        success: true,
        documentId: `DOC-UPLOAD-${Date.now().toString().slice(-4)}`,
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        status: 'uploaded',
        message: 'Document uploaded and registered in temporary secure staging.'
      };
    }

    // 5. POST /api/ocr/process
    if (path === '/api/ocr/process' && method === 'POST') {
      const lang = detectDocumentLanguage();
      const classify = classifyLandDocument('Jamabandi Form II Khata 42 Khasra 125');
      return {
        success: true,
        language: lang.detectedLanguage,
        script: lang.script,
        confidence: lang.confidence,
        classification: classify.classifiedType,
        classificationConfidence: classify.confidence,
        ocrEngine: lang.ocrEngine,
        mode: 'Demo OCR'
      };
    }

    // 6. POST /api/extraction
    if (path === '/api/extraction' && method === 'POST') {
      const extracted = extractRevenueFields('sample-1', 'sample-1');
      return {
        success: true,
        overallConfidence: extracted.overallFieldConfidence,
        extractedFields: extracted.fields,
        uncertainFields: extracted.uncertainFields
      };
    }

    // 7. POST /api/validation/run
    if (path === '/api/validation/run' && method === 'POST') {
      const p125 = this.parcels.find(p => p.khasraNo === '125');
      return {
        success: true,
        parcelId: p125?.parcelId,
        conflictsFound: p125?.validationResults.length || 0,
        conflicts: p125?.validationResults
      };
    }

    // 8. GET /api/risk
    if (path === '/api/risk' && method === 'GET') {
      const p125 = this.parcels.find(p => p.khasraNo === '125');
      return p125?.riskAssessment;
    }

    // 9. GET /api/mutations
    if (path === '/api/mutations' && method === 'GET') {
      return this.parcels.flatMap(p => p.mutations);
    }

    // 10. GET /api/registrations
    if (path === '/api/registrations' && method === 'GET') {
      return this.parcels.flatMap(p => p.registrations || []);
    }

    // 11. GET /api/gis/parcels
    if (path === '/api/gis/parcels' && method === 'GET') {
      return {
        type: 'FeatureCollection',
        features: this.parcels.slice(0, 30).map(p => ({
          type: 'Feature',
          properties: {
            parcelId: p.parcelId,
            khasraNo: p.khasraNo,
            owner: p.owner,
            village: p.village,
            riskScore: p.riskScore,
            status: p.status
          },
          geometry: p.geometry
        }))
      };
    }

    // 12. GET /api/dashboard
    if (path === '/api/dashboard' && method === 'GET') {
      return {
        documentsProcessed: 125430,
        extractionAccuracy: 91.4,
        validated: 98220,
        pendingVerification: 21510,
        errors: 4832,
        highRisk: 3210
      };
    }

    // 13. POST /api/verification
    if (path === '/api/verification' && method === 'POST') {
      return {
        success: true,
        actionRecorded: requestBody?.action || 'Approved',
        integrityHash: '8f4c2810a9b3c4d5e6f7a8b9c0d1e2f3',
        message: 'Quasi-judicial action recorded and cryptographically sealed.'
      };
    }

    // 14. POST /api/feedback
    if (path === '/api/feedback' && method === 'POST') {
      return {
        success: true,
        feedbackId: `FB-${Date.now().toString().slice(-4)}`,
        recordedForRetraining: true,
        message: 'AI correction recorded for future model fine-tuning dataset.'
      };
    }

    return { message: `Simulated response for ${method} ${path}`, timestamp: new Date().toISOString() };
  }
}

export const bhulekhApiClient = new BhulekhApiClient();
export const bhumiApiClient = bhulekhApiClient;
export const BhumiApiClient = BhulekhApiClient;
