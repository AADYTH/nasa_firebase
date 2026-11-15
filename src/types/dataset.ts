/**
 * NASA Microgravity Combustion Experiment Dataset Types
 * Grounded in NASA Physical Sciences Informatics (PSI) system and Open Science Data Repository (OSDR).
 */

export type NASAExperimentFacility =
  | 'CIR' // Combustion Integrated Rack (ISS)
  | 'BASS' // Burning and Suppression of Solids
  | 'FLEX' // Flame Extinguishment Experiment
  | 'ACME' // Advanced Combustion via Microgravity Experiments
  | 'SoFIE' // Solid Fuel Ignition and Extinction
  | 'GROUND_DROP_TOWER' // NASA Glenn 2.2s / 5.18s Zero-G Drop Towers
  | 'OTHER';

export interface ExperimentMetadata {
  id: string;
  mission: string;
  facility: NASAExperimentFacility;
  title: string;
  description: string;
  publicationReference?: string;
  psiRecordId?: string;
  dateConducted?: string;
  investigators: string[];
}

export interface MicrogravityEnvironment {
  gravityLevelG: number; // e.g., 1e-4 to 1e-6 g
  ambientPressureKPa: number;
  oxygenConcentrationPercent: number;
  diluentGas: 'N2' | 'CO2' | 'He' | 'Xe' | 'Ar' | string;
  flowVelocityMmPerSec?: number;
}

export interface RawTelemetryPoint {
  timestampSec: number;
  temperatureKelvin?: number;
  radiantHeatFluxWattsPerCm2?: number;
  chamberPressureKPa?: number;
  cameraFrameIndex?: number;
}

export interface DatasetRecord {
  metadata: ExperimentMetadata;
  environment: MicrogravityEnvironment;
  telemetry: RawTelemetryPoint[];
  provenance: {
    sourceUrl?: string;
    license: string;
    verifiedGrounded: boolean;
  };
}

/**
 * NASA PSI-69 FLEX Experimental Table Raw CSV Row
 * Preserves exact original column headers and raw string values as published by NASA.
 */
export interface FlexRawCsvRow {
  'FLEX Test #': string;
  'FLEX Identifier': string;
  'Test Date': string;
  'Test GMT': string;
  'Fuel': string;
  'Ambient pressure; mmHg': string;
  'O initial ambient composition; mole fraction': string;
  'N initial ambient composition; mole fraction': string;
  'CO initial ambient composition; mole fraction': string;
  'He initial ambient composition; mole fraction': string;
  'Droplet initial diameter; mm': string;
  'Visible flame extinction diameter; mm': string;
  'Burning rate; mm': string;
  'Burn time; s': string;
  'Test end': string;
}

export type FlexFuelType = 'Methanol' | 'Heptane' | string;
export type FlexTestEndOutcome = 'Extinction' | 'Disruption' | 'Completion' | string;

/**
 * Normalized and parsed record for NASA FLEX experimental trials.
 * Missing values are strictly preserved as null (never zero).
 */
export interface FlexParsedRecord {
  fileRowIndex: number;
  raw: FlexRawCsvRow;

  // Experiment Identifiers
  testNumber: number;
  flexIdentifier: string;

  // Temporal Metadata
  testDate: string;
  testGmt: string | null;

  // Experimental Conditions
  fuel: FlexFuelType;
  ambientPressureMmHg: number | null;
  ambientPressureKPa: number | null; // Converted from mmHg: 1 mmHg = 0.133322 kPa
  oxygenMoleFraction: number | null;
  nitrogenMoleFraction: number | null;
  carbonOxideMoleFraction: number | null; // Labeled 'CO' in NASA table
  heliumMoleFraction: number | null;
  dropletInitialDiameterMm: number | null;

  // Measurements / Kinetic Observations
  visibleFlameExtinctionDiameterMm: number | null;
  burningRateReported: number | null; // Column labeled 'Burning rate; mm' in NASA header
  burnTimeSec: number | null;
  isBurnTimeApproximate: boolean; // Flagged true when value was prefixed with '~' in raw data (e.g. ~6, ~9)

  // Observed Outcome
  testEnd: FlexTestEndOutcome;
}

export interface DatasetProvenance {
  datasetName: string;
  investigationId: string;
  sourceUrl: string;
  doi: string;
  facility: string;
  platform: string;
  flightInvestigation: string;
  verifiedGrounded: boolean;
}

export interface CsvParseIssue {
  row: number;
  column?: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  rawValue?: string;
}

export interface FlexDuplicateIdentifier {
  identifier: string;
  count: number;
  testNumbers: number[];
}

export interface FlexDatasetAuditInfo {
  rawRecordCount: number;
  rawFuelCounts: Record<string, number>;
  rawOutcomeCounts: Record<string, number>;
  normalizedOutcomeCounts: Record<string, number>;
  duplicateIdentifiers: FlexDuplicateIdentifier[];
  invalidFuelCount: number;
  invalidOutcomeCount: number;
  unresolvedDiscrepancies: string[];
}

export interface FlexDatasetDiagnosticReport {
  provenance: DatasetProvenance;
  sourcePath: string;
  totalLines: number;
  headerCount: number;
  headers: string[];
  totalDataRows: number;
  parsedRecordCount: number;
  malformedRowCount: number;
  issues: CsvParseIssue[];
  missingCountByColumn: Record<string, number>;
  distributionByFuel: Record<string, number>;
  distributionByTestEnd: Record<string, number>;
  audit: FlexDatasetAuditInfo;
  sampleParsedRecords: FlexParsedRecord[];
}


