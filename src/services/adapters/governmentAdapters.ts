// =========================================================================
// GOVERNMENT INTEGRATION ADAPTER INTERFACES
// Architected for clean replacement with actual state/central government APIs.
// =========================================================================

export interface LandRecordAdapter {
  fetchRoR(khasraNo: string, khataNo: string, village: string): Promise<{ success: boolean; data?: unknown; error?: string }>;
  fetchKhatiyan(khataNo: string, village: string): Promise<{ success: boolean; data?: unknown; error?: string }>;
}

export interface RegistrationAdapter {
  fetchRegisteredDeed(registrationNo: string, year: number): Promise<{ success: boolean; deedDetails?: unknown; error?: string }>;
  verifyStampDuty(stampCertificateNo: string): Promise<{ verified: boolean; stampAmount?: number }>;
}

export interface MutationAdapter {
  getMutationCaseStatus(mutationNo: string): Promise<{ status: string; stage: string; pendingWith: string }>;
  submitMutationNotice(mutationPayload: unknown): Promise<{ caseId: string; acknowledgementNo: string }>;
}

export interface GisCadastralAdapter {
  fetchCadastralPolygon(ulpin: string): Promise<{ geometry: unknown; areaSqMeters: number }>;
  checkBoundaryEncroachment(polygonGeoJson: unknown): Promise<{ hasEncroachment: boolean; overlappedLayers: string[] }>;
}

export interface DilrmpAdapter {
  syncNationalRegistry(parcelId: string): Promise<{ synchronized: boolean; nationalUlpin: string; timestamp: string }>;
}

// =========================================================================
// PROTOTYPE MOCK IMPLEMENTATIONS WITH HONEST LABELS
// =========================================================================

export const MockLandRecordAdapter: LandRecordAdapter = {
  async fetchRoR(khasraNo, khataNo, village) {
    await new Promise(r => setTimeout(r, 400));
    return {
      success: true,
      data: {
        source: 'JharBhoomi State LRMS (Prototype Connector)',
        khasraNo,
        khataNo,
        village,
        status: 'Active Jamabandi',
        lagaanAssessed: 48.50,
        syncTimestamp: new Date().toISOString()
      }
    };
  },
  async fetchKhatiyan(khataNo, village) {
    await new Promise(r => setTimeout(r, 350));
    return {
      success: true,
      data: {
        source: 'State Khatiyan Registry',
        khataNo,
        village,
        surveyType: 'Cadastral Survey 1968',
        tenureType: 'Raiyati'
      }
    };
  }
};

export const MockRegistrationAdapter: RegistrationAdapter = {
  async fetchRegisteredDeed(registrationNo, _year) {
    await new Promise(r => setTimeout(r, 450));
    return {
      success: true,
      deedDetails: {
        source: 'NGDRS Sub-Registrar Gateway (Prototype Connector)',
        registrationNo,
        status: 'Registered',
        executionDate: '2018-06-20',
        subRegistrar: 'Dumka Sadar'
      }
    };
  },
  async verifyStampDuty(_stampCertificateNo) {
    await new Promise(r => setTimeout(r, 300));
    return { verified: true, stampAmount: 42500 };
  }
};

export const MockMutationAdapter: MutationAdapter = {
  async getMutationCaseStatus(_mutationNo) {
    await new Promise(r => setTimeout(r, 300));
    return {
      status: 'Disputed / Under Scrutiny',
      stage: 'Quasi-Judicial Hearing Required',
      pendingWith: 'Circle Officer, Dumka Sadar'
    };
  },
  async submitMutationNotice(_payload) {
    await new Promise(r => setTimeout(r, 500));
    return {
      caseId: `MUT-CASE-${Date.now()}`,
      acknowledgementNo: `ACK-JH-DMK-${Math.floor(Math.random() * 10000)}`
    };
  }
};

export const MockGisAdapter: GisCadastralAdapter = {
  async fetchCadastralPolygon(_ulpin) {
    await new Promise(r => setTimeout(r, 400));
    return {
      geometry: { type: 'Polygon', coordinates: [] },
      areaSqMeters: 9995.7
    };
  },
  async checkBoundaryEncroachment(_polygonGeoJson) {
    await new Promise(r => setTimeout(r, 450));
    return {
      hasEncroachment: true,
      overlappedLayers: ['Protected Gochar Land (Plot 126)', 'Village Drainage Canal']
    };
  }
};

export const MockDilrmpAdapter: DilrmpAdapter = {
  async syncNationalRegistry(parcelId) {
    await new Promise(r => setTimeout(r, 600));
    return {
      synchronized: true,
      nationalUlpin: `12-JH-DMK-${parcelId.split('-').pop()}`,
      timestamp: new Date().toISOString()
    };
  }
};
