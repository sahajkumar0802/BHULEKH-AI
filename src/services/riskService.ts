import { LandParcel, RiskAssessment, RiskFactor, RiskLevel } from '../types/landRecord';
import { runCrossRecordValidation } from './validationService';

export function calculateParcelRiskAssessment(
  parcel: LandParcel,
  allParcels: LandParcel[] = []
): RiskAssessment {
  const validation = runCrossRecordValidation(parcel, allParcels);
  const factors: RiskFactor[] = [];
  const topReasons: string[] = [];

  let calculatedScore = 5; // Baseline minimal risk

  // Factor 1: Ownership Conflict (+30 pts)
  const ownerConflict = validation.conflicts.find(c => c.category === 'Owner Consistency' && c.isMismatch);
  if (ownerConflict) {
    const points = ownerConflict.severity === 'Critical' ? 30 : 18;
    factors.push({
      factor: 'Ownership Name Conflict',
      weight: 30,
      points,
      reason: ownerConflict.explanation,
      source: 'Cross-Record Engine'
    });
    calculatedScore += points;
    topReasons.push(`Ownership discrepancy detected: ${ownerConflict.fieldName}`);
  }

  // Factor 2: Area Mismatch (+15 to +20 pts)
  const areaConflict = validation.conflicts.find(c => c.category === 'Area Consistency' && c.isMismatch);
  if (areaConflict) {
    const points = areaConflict.severity === 'Critical' ? 20 : 15;
    factors.push({
      factor: 'Area Mismatch (>2.5% Variance)',
      weight: 20,
      points,
      reason: areaConflict.explanation,
      source: 'GIS Spatial Matcher'
    });
    calculatedScore += points;
    topReasons.push(`Spatial area deviation between RoR text and Cadastral GIS polygon`);
  }

  // Factor 3: Duplicate Document Reference (+25 to +40 pts)
  const dupConflict = validation.conflicts.find(c => c.category === 'Duplicate Detection' && c.isMismatch);
  if (dupConflict) {
    factors.push({
      factor: 'Duplicate Document Reference',
      weight: 40,
      points: 40,
      reason: dupConflict.explanation,
      source: 'Sub-Registrar Registry Cross-Check'
    });
    calculatedScore += 40;
    topReasons.push('Duplicate registered deed serial number collision with external parcel');
  }

  // Factor 4: Spatial Encroachment / Overlap (+20 to +38 pts)
  const spatialConflict = validation.conflicts.find(c => c.category === 'Spatial Consistency' && c.isMismatch);
  if (spatialConflict) {
    factors.push({
      factor: 'Spatial Encroachment on Common Land',
      weight: 40,
      points: 38,
      reason: spatialConflict.explanation,
      source: 'Cadastral Topology Engine'
    });
    calculatedScore += 38;
    topReasons.push('Spatial polygon intersects protected government / community grazing land');
  }

  // Factor 5: Low OCR Confidence (+9 to +20 pts)
  const ocrConflict = validation.conflicts.find(c => c.fieldName === 'AI Text Transcription Quality' && c.isMismatch);
  if (ocrConflict) {
    factors.push({
      factor: 'Low Extraction Confidence',
      weight: 20,
      points: 15,
      reason: ocrConflict.explanation,
      source: 'OCR Quality Subsystem'
    });
    calculatedScore += 15;
    topReasons.push('Low OCR extraction confidence (< 80%) on vintage paper record');
  }

  // Cap score at 100
  const overallScore = Math.min(100, Math.max(5, calculatedScore));

  // Determine Risk Tier
  let riskLevel: RiskLevel = 'low';
  if (overallScore > 80) riskLevel = 'critical';
  else if (overallScore > 60) riskLevel = 'high';
  else if (overallScore > 30) riskLevel = 'medium';

  // Calculate Record Quality Score (0-100)
  // Higher is better: based on completeness, OCR confidence, lack of conflicts
  let qualityDeduction = 0;
  if (ownerConflict) qualityDeduction += 15;
  if (areaConflict) qualityDeduction += 10;
  if (dupConflict) qualityDeduction += 20;
  if (spatialConflict) qualityDeduction += 15;
  if (ocrConflict) qualityDeduction += 12;

  const avgOcr = parcel.documents.length > 0 
    ? parcel.documents.reduce((acc, d) => acc + d.ocrConfidence, 0) / parcel.documents.length 
    : 80;

  const qualityScore = Math.min(100, Math.max(35, Math.round(avgOcr * 0.5 + (50 - qualityDeduction * 0.7))));

  // Generate Explainable AI rationale
  let explainableSummary = '';
  let recommendedOfficerAction = '';

  if (riskLevel === 'critical') {
    explainableSummary = `This parcel requires verification because multiple authoritative records contain inconsistent information. Specifically, high-severity discrepancies were detected across ${topReasons.slice(0, 2).join(' and ')}.`;
    recommendedOfficerAction = 'Order immediate Field Verification by Revenue Karamchari and issue statutory notice before sanctioning any title changes.';
  } else if (riskLevel === 'high') {
    explainableSummary = `This parcel exhibits significant boundary or documentation anomalies that warrant physical survey confirmation before processing citizen applications.`;
    recommendedOfficerAction = 'Schedule DGPS ground demarcation and request certified copy of prior sale deed.';
  } else if (riskLevel === 'medium') {
    explainableSummary = `This parcel record is generally sound but requires routine administrative re-examination due to ${topReasons[0] || 'minor data completeness gaps'}.`;
    recommendedOfficerAction = 'Route to Data Entry Operator for high-resolution document rescanning.';
  } else {
    explainableSummary = `This land record is fully validated with complete lineage, synchronized mutation records, and exact GIS cadastral alignment.`;
    recommendedOfficerAction = 'Eligible for automated digital certificate issuance and instant collateral clearance.';
  }

  return {
    overallScore,
    qualityScore,
    riskLevel,
    factors,
    topReasons: topReasons.length > 0 ? topReasons : ['No discrepancies found. All cross-record validations passed successfully.'],
    explainableSummary,
    recommendedOfficerAction,
    lastAssessedAt: new Date().toISOString()
  };
}
