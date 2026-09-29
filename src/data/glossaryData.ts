export interface GlossaryTerm {
  term: string;
  hindiTerm: string;
  category: 'Document' | 'Administrative' | 'Measurement' | 'Legal';
  definition: string;
  significance: string;
}

export const LAND_GLOSSARY: Record<string, GlossaryTerm> = {
  RoR: {
    term: 'RoR (Record of Rights)',
    hindiTerm: 'अधिकार अभिलेख / जमाबंदी (Jamabandi)',
    category: 'Document',
    definition: 'The official public record containing ownership, tenancy rights, land revenue liabilities, and survey plot numbers for every landholder in a village.',
    significance: 'Primary authoritative baseline for proving who is liable to pay land revenue and who holds legitimate possession rights.'
  },
  Khasra: {
    term: 'Khasra Number',
    hindiTerm: 'खसरा संख्या / प्लॉट नंबर',
    category: 'Measurement',
    definition: 'A unique identifying number assigned to a specific geographical parcel/plot of agricultural or rural land during a cadastral survey.',
    significance: 'Serves as the spatial coordinate unit on the village cadastral map (Bhu-Naksha).'
  },
  Khata: {
    term: 'Khata Number',
    hindiTerm: 'खाता संख्या / खेवट',
    category: 'Administrative',
    definition: 'An account number allocated to a landholder or family holding one or more Khasra parcels within the village revenue boundary.',
    significance: 'Groups all land parcels belonging to a single ownership ledger under the State Revenue Department.'
  },
  Khatiyan: {
    term: 'Khatiyan',
    hindiTerm: 'खतियान (सर्वे रिकॉर्ड)',
    category: 'Document',
    definition: 'The foundational historical record prepared during Cadastral Survey (CS) or Revisional Survey (RS) documenting hereditary rights and rent payable.',
    significance: 'Crucial for establishing uninterrupted root-of-title history in eastern states including Jharkhand, Bihar, and West Bengal.'
  },
  Mutation: {
    term: 'Mutation (Dakhil-Kharij)',
    hindiTerm: 'दाखिल-खारिज / नामांतरण',
    category: 'Legal',
    definition: 'The formal legal process of substituting the name of the new owner in place of the previous owner in the RoR upon sale, gift, or inheritance.',
    significance: 'Crucial step to update tax liability; without sanctioned mutation, title remains ambiguous in revenue registries.'
  },
  Cadastral: {
    term: 'Cadastral Map (Bhu-Naksha)',
    hindiTerm: 'भू-नक्शा / शजरा',
    category: 'Document',
    definition: 'A large-scale, georeferenced boundary map illustrating exact dimensions, topography, and boundaries of all individual Khasras in a revenue village.',
    significance: 'Provides the spatial ground-truth used by BHULEKH AI to validate reported area against satellite/GIS polygon area.'
  },
  Patwari: {
    term: 'Patwari / Revenue Karamchari',
    hindiTerm: 'पटवारी / राजस्व कर्मचारी',
    category: 'Administrative',
    definition: 'The frontline village-level revenue official responsible for maintaining crop inspection registers, village maps, and field verifications.',
    significance: 'Conducts ground-level physical inspection orders initiated through the BHULEKH AI Officer Queue.'
  },
  Tehsildar: {
    term: 'Tehsildar / Circle Officer (CO)',
    hindiTerm: 'तहसीलदार / अंचल अधिकारी',
    category: 'Administrative',
    definition: 'Sub-district revenue magistrate with statutory authority to sanction mutations, resolve boundary disputes, and issue certificates.',
    significance: 'Authorized approver for high-risk flags, field survey approvals, and title reconciliations.'
  },
  LPC: {
    term: 'LPC (Land Possession Certificate)',
    hindiTerm: 'भू-स्वामित्व प्रमाण पत्र',
    category: 'Document',
    definition: 'An official certificate issued by the Circle Officer certifying that the applicant is in actual peaceful physical possession of the land.',
    significance: 'Frequently required for institutional bank loans and agricultural subsidies.'
  }
};
