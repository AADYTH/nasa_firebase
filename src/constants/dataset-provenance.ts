import type { DatasetProvenance } from '../types/dataset';

/**
 * Official NASA Physical Sciences Informatics (PSI) Dataset Provenance
 * Investigation: PSI-69 (Flame Extinguishment Experiment - FLEX)
 * Verified against NASA Open Science and Physical Sciences Repository.
 */
export const NASA_FLEX_PSI_69_PROVENANCE: DatasetProvenance = {
  datasetName: 'Flame Extinguishment Experiment (FLEX) Experimental Table',
  investigationId: 'PSI-69',
  sourceUrl: 'https://psi.nasa.gov/physci/repo/data/investigations/PSI-69',
  doi: '10.60555/mbq8-0451',
  facility: 'Combustion Integrated Rack (CIR)',
  platform: 'International Space Station (ISS)',
  flightInvestigation: 'FLEX (Flame Extinguishment Experiment)',
  verifiedGrounded: true,
};

export const EXPECTED_FLEX_HEADERS = [
  'FLEX Test #',
  'FLEX Identifier',
  'Test Date',
  'Test GMT',
  'Fuel',
  'Ambient pressure; mmHg',
  'O initial ambient composition; mole fraction',
  'N initial ambient composition; mole fraction',
  'CO initial ambient composition; mole fraction',
  'He initial ambient composition; mole fraction',
  'Droplet initial diameter; mm',
  'Visible flame extinction diameter; mm',
  'Burning rate; mm',
  'Burn time; s',
  'Test end',
] as const;
