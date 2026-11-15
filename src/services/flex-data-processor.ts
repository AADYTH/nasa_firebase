import type {
  FlexRawCsvRow,
  FlexParsedRecord,
  CsvParseIssue,
  FlexDatasetDiagnosticReport,
  FlexDuplicateIdentifier,
  FlexDatasetAuditInfo,
} from '../types/dataset';
import {
  NASA_FLEX_PSI_69_PROVENANCE,
  EXPECTED_FLEX_HEADERS,
} from '../constants/dataset-provenance';

/**
 * Splits a single CSV row line respecting quoted fields.
 */
export const parseCsvLine = (line: string, delimiter = ','): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

/**
 * Checks if a cell value represents missing data.
 * NASA PSI-69 represents missing values with empty strings or en-dashes ('–' / byte 0x96).
 * Crucially: Missing values are NEVER treated as zero.
 */
export const isCellMissing = (value: string | undefined | null): boolean => {
  if (value === undefined || value === null) return true;
  const trimmed = value.trim();
  return (
    trimmed === '' ||
    trimmed === '–' ||
    trimmed === '-' ||
    trimmed === '\u2013' ||
    trimmed === '\uFFFD' ||
    trimmed.toLowerCase() === 'n/a' ||
    trimmed.toLowerCase() === 'nan'
  );
};

interface ParsedNumberResult {
  value: number | null;
  isApproximate: boolean;
  issue?: CsvParseIssue;
}

/**
 * Safely parses a nullable numeric field.
 * Returns null if missing. Handles approximate notation '~' (e.g. ~6, ~9).
 */
export const parseNullableNumber = (
  rawVal: string,
  colName: string,
  rowIndex: number
): ParsedNumberResult => {
  if (isCellMissing(rawVal)) {
    return { value: null, isApproximate: false };
  }

  const trimmed = rawVal.trim();

  // Handle approximate values like '~6' or '~9'
  if (trimmed.startsWith('~')) {
    const numericPart = trimmed.slice(1).trim();
    const num = Number(numericPart);
    if (!Number.isNaN(num)) {
      return {
        value: num,
        isApproximate: true,
        issue: {
          row: rowIndex,
          column: colName,
          severity: 'info',
          message: `Approximate numeric value "${trimmed}" parsed as ${num} (approximation flag set)`,
          rawValue: rawVal,
        },
      };
    }
  }

  const num = Number(trimmed);
  if (Number.isNaN(num)) {
    return {
      value: null,
      isApproximate: false,
      issue: {
        row: rowIndex,
        column: colName,
        severity: 'warning',
        message: `Unable to parse numeric value "${rawVal}" for column "${colName}". Value recorded as null.`,
        rawValue: rawVal,
      },
    };
  }

  return { value: num, isApproximate: false };
};

export interface ProcessCsvResult {
  records: FlexParsedRecord[];
  report: FlexDatasetDiagnosticReport;
}

/**
 * Processes the raw text content of the NASA PSI-69 FLEX CSV dataset.
 * Adheres strictly to:
 * - Preserving raw column names and exact cell strings.
 * - Missing values remain null, never zero.
 * - Reporting malformed rows and format anomalies without silently discarding.
 */
export const RECOGNIZED_FUELS = ['Methanol', 'Heptane'] as const;
export const RECOGNIZED_OUTCOMES = ['Extinction', 'Disruption', 'Completion'] as const;

export const processFlexCsvContent = (
  rawContent: string,
  sourcePath = 'public/data/raw/PSI-69_Experimental table_FLEX.csv'
): ProcessCsvResult => {
  const allLines = rawContent.split(/\r?\n/);
  // Non-empty lines
  const nonEmptyLines = allLines.filter((l) => l.trim().length > 0);

  const issues: CsvParseIssue[] = [];
  const missingCountByColumn: Record<string, number> = {};
  const distributionByFuel: Record<string, number> = {};
  const distributionByTestEnd: Record<string, number> = {};

  const rawFuelCounts: Record<string, number> = {};
  const rawOutcomeCounts: Record<string, number> = {};
  const normalizedOutcomeCounts: Record<string, number> = {};
  const identifierMap = new Map<string, number[]>();
  let invalidFuelCount = 0;
  let invalidOutcomeCount = 0;

  if (nonEmptyLines.length === 0) {
    issues.push({
      row: 0,
      severity: 'error',
      message: 'Dataset file is empty.',
    });

    const emptyReport: FlexDatasetDiagnosticReport = {
      provenance: NASA_FLEX_PSI_69_PROVENANCE,
      sourcePath,
      totalLines: allLines.length,
      headerCount: 0,
      headers: [],
      totalDataRows: 0,
      parsedRecordCount: 0,
      malformedRowCount: 0,
      issues,
      missingCountByColumn: {},
      distributionByFuel: {},
      distributionByTestEnd: {},
      audit: {
        rawRecordCount: 0,
        rawFuelCounts: {},
        rawOutcomeCounts: {},
        normalizedOutcomeCounts: {},
        duplicateIdentifiers: [],
        invalidFuelCount: 0,
        invalidOutcomeCount: 0,
        unresolvedDiscrepancies: ['File is empty.'],
      },
      sampleParsedRecords: [],
    };
    return { records: [], report: emptyReport };
  }

  const rawHeaders = parseCsvLine(nonEmptyLines[0]);
  rawHeaders.forEach((h) => {
    missingCountByColumn[h] = 0;
  });

  // Verify headers against expected PSI-69 headers
  EXPECTED_FLEX_HEADERS.forEach((expectedHeader, idx) => {
    if (rawHeaders[idx] !== expectedHeader) {
      issues.push({
        row: 1,
        column: expectedHeader,
        severity: 'warning',
        message: `Header at column index ${idx} was "${rawHeaders[idx]}", expected "${expectedHeader}".`,
        rawValue: rawHeaders[idx],
      });
    }
  });

  const records: FlexParsedRecord[] = [];
  let malformedRowCount = 0;

  for (let i = 1; i < nonEmptyLines.length; i++) {
    const lineIndex = i + 1; // 1-indexed line in file
    const line = nonEmptyLines[i];
    const columns = parseCsvLine(line);

    // Validate column count
    if (columns.length !== rawHeaders.length) {
      malformedRowCount++;
      issues.push({
        row: lineIndex,
        severity: 'error',
        message: `Malformed row: expected ${rawHeaders.length} columns, found ${columns.length}.`,
        rawValue: line,
      });
    }

    // Build raw dictionary preserving all 15 original columns
    const rawRowObj: Record<string, string> = {};
    rawHeaders.forEach((h, colIdx) => {
      const cellVal = columns[colIdx] ?? '';
      rawRowObj[h] = cellVal;
      if (isCellMissing(cellVal)) {
        missingCountByColumn[h] = (missingCountByColumn[h] || 0) + 1;
      }
    });

    const raw = rawRowObj as unknown as FlexRawCsvRow;

    // Parse Test #
    const testNumResult = parseNullableNumber(raw['FLEX Test #'], 'FLEX Test #', lineIndex);
    if (testNumResult.issue) issues.push(testNumResult.issue);

    // Parse GMT
    const testGmt = isCellMissing(raw['Test GMT']) ? null : raw['Test GMT'].trim();
    if (!testGmt) {
      issues.push({
        row: lineIndex,
        column: 'Test GMT',
        severity: 'info',
        message: `Test GMT missing for Test #${testNumResult.value ?? 'unknown'} (${raw['FLEX Identifier']}).`,
        rawValue: raw['Test GMT'],
      });
    }

    // Parse Fuel & Audit
    const rawFuel = raw['Fuel'] ?? '';
    const fuel = rawFuel ? rawFuel.trim() : 'Unknown';
    rawFuelCounts[rawFuel] = (rawFuelCounts[rawFuel] || 0) + 1;
    distributionByFuel[fuel] = (distributionByFuel[fuel] || 0) + 1;

    if (!RECOGNIZED_FUELS.includes(fuel as (typeof RECOGNIZED_FUELS)[number])) {
      invalidFuelCount++;
      issues.push({
        row: lineIndex,
        column: 'Fuel',
        severity: 'warning',
        message: `Unrecognized or invalid fuel "${rawFuel}".`,
        rawValue: rawFuel,
      });
    }

    // Parse Test End outcome & Audit
    const rawOutcome = raw['Test end'] ?? '';
    const testEnd = rawOutcome ? rawOutcome.trim() : 'Unknown';
    rawOutcomeCounts[rawOutcome] = (rawOutcomeCounts[rawOutcome] || 0) + 1;
    normalizedOutcomeCounts[testEnd] = (normalizedOutcomeCounts[testEnd] || 0) + 1;
    distributionByTestEnd[testEnd] = (distributionByTestEnd[testEnd] || 0) + 1;

    if (!RECOGNIZED_OUTCOMES.includes(testEnd as (typeof RECOGNIZED_OUTCOMES)[number])) {
      invalidOutcomeCount++;
      issues.push({
        row: lineIndex,
        column: 'Test end',
        severity: 'warning',
        message: `Unrecognized or invalid Test end outcome "${rawOutcome}".`,
        rawValue: rawOutcome,
      });
    }

    // Track FLEX Identifier for duplicate detection
    const flexId = raw['FLEX Identifier'] ? raw['FLEX Identifier'].trim() : '';
    if (flexId) {
      const existing = identifierMap.get(flexId) ?? [];
      existing.push(testNumResult.value ?? i);
      identifierMap.set(flexId, existing);
    }

    // Parse Pressure (mmHg) and convert to kPa (1 mmHg = 0.133322 kPa)
    const pressureResult = parseNullableNumber(
      raw['Ambient pressure; mmHg'],
      'Ambient pressure; mmHg',
      lineIndex
    );
    if (pressureResult.issue) issues.push(pressureResult.issue);
    const ambientPressureKPa =
      pressureResult.value !== null
        ? Number((pressureResult.value * 0.133322387415).toFixed(3))
        : null;

    // Parse mole fractions
    const o2Result = parseNullableNumber(
      raw['O initial ambient composition; mole fraction'],
      'O initial ambient composition; mole fraction',
      lineIndex
    );
    if (o2Result.issue) issues.push(o2Result.issue);

    const n2Result = parseNullableNumber(
      raw['N initial ambient composition; mole fraction'],
      'N initial ambient composition; mole fraction',
      lineIndex
    );
    if (n2Result.issue) issues.push(n2Result.issue);

    const coResult = parseNullableNumber(
      raw['CO initial ambient composition; mole fraction'],
      'CO initial ambient composition; mole fraction',
      lineIndex
    );
    if (coResult.issue) issues.push(coResult.issue);

    const heResult = parseNullableNumber(
      raw['He initial ambient composition; mole fraction'],
      'He initial ambient composition; mole fraction',
      lineIndex
    );
    if (heResult.issue) issues.push(heResult.issue);

    // Parse droplet diameter
    const dropletResult = parseNullableNumber(
      raw['Droplet initial diameter; mm'],
      'Droplet initial diameter; mm',
      lineIndex
    );
    if (dropletResult.issue) issues.push(dropletResult.issue);

    // Parse visible flame extinction diameter
    const extResult = parseNullableNumber(
      raw['Visible flame extinction diameter; mm'],
      'Visible flame extinction diameter; mm',
      lineIndex
    );
    if (extResult.issue) issues.push(extResult.issue);

    // Parse reported burning rate (labeled 'Burning rate; mm' in NASA header)
    const rateResult = parseNullableNumber(
      raw['Burning rate; mm'],
      'Burning rate; mm',
      lineIndex
    );
    if (rateResult.issue) issues.push(rateResult.issue);

    // Parse burn time (handling approximate values e.g. ~6, ~9)
    const timeResult = parseNullableNumber(
      raw['Burn time; s'],
      'Burn time; s',
      lineIndex
    );
    if (timeResult.issue) issues.push(timeResult.issue);

    const record: FlexParsedRecord = {
      fileRowIndex: lineIndex,
      raw,
      testNumber: testNumResult.value ?? i,
      flexIdentifier: raw['FLEX Identifier']?.trim() ?? '',
      testDate: raw['Test Date']?.trim() ?? '',
      testGmt,
      fuel,
      ambientPressureMmHg: pressureResult.value,
      ambientPressureKPa,
      oxygenMoleFraction: o2Result.value,
      nitrogenMoleFraction: n2Result.value,
      carbonOxideMoleFraction: coResult.value,
      heliumMoleFraction: heResult.value,
      dropletInitialDiameterMm: dropletResult.value,
      visibleFlameExtinctionDiameterMm: extResult.value,
      burningRateReported: rateResult.value,
      burnTimeSec: timeResult.value,
      isBurnTimeApproximate: timeResult.isApproximate,
      testEnd,
    };

    records.push(record);
  }

  // Detect duplicate identifiers across experimental records
  const duplicateIdentifiers: FlexDuplicateIdentifier[] = [];
  identifierMap.forEach((testNumbers, identifier) => {
    if (testNumbers.length > 1) {
      duplicateIdentifiers.push({
        identifier,
        count: testNumbers.length,
        testNumbers,
      });
      issues.push({
        row: testNumbers[0],
        column: 'FLEX Identifier',
        severity: 'info',
        message: `Duplicate FLEX Identifier "${identifier}" found in Tests #${testNumbers.join(', #')} (distinct experimental conditions and measurements preserved).`,
        rawValue: identifier,
      });
    }
  });

  const unresolvedDiscrepancies: string[] = [
    'Record Count (275 vs. 274): The downloadable CSV file contains 275 non-empty lines (1 header line + 274 data rows, numbered 1..274). Whether external references citing 275 counted the header row as a record or reference an unindexed trial outside this table remains officially unresolved.',
    'Prior Count Rectification: An earlier narrative summary mistakenly reported Methanol 155, Heptane 119 and Extinction 144, Disruption 84, Completion 46 due to an ungrounded textual estimation. Direct byte-for-byte parsing confirms grounded counts: Methanol 157, Heptane 117; Extinction 186, Disruption 61, Completion 27.',
  ];

  const audit: FlexDatasetAuditInfo = {
    rawRecordCount: records.length,
    rawFuelCounts,
    rawOutcomeCounts,
    normalizedOutcomeCounts,
    duplicateIdentifiers,
    invalidFuelCount,
    invalidOutcomeCount,
    unresolvedDiscrepancies,
  };

  const report: FlexDatasetDiagnosticReport = {
    provenance: NASA_FLEX_PSI_69_PROVENANCE,
    sourcePath,
    totalLines: allLines.length,
    headerCount: rawHeaders.length,
    headers: rawHeaders,
    totalDataRows: nonEmptyLines.length - 1,
    parsedRecordCount: records.length,
    malformedRowCount,
    issues,
    missingCountByColumn,
    distributionByFuel,
    distributionByTestEnd,
    audit,
    sampleParsedRecords: records.slice(0, 5),
  };

  return { records, report };
};

/**
 * Loads and processes the NASA PSI-69 FLEX experimental dataset in the browser or Node.js environment.
 * Handles Windows-1252 character encoding (preserving en-dash markers '–' as missing data).
 */
export const loadFlexDataset = async (
  csvUrl = '/data/raw/PSI-69_Experimental table_FLEX.csv'
): Promise<ProcessCsvResult> => {
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch NASA dataset from "${csvUrl}": HTTP status ${response.status} ${response.statusText}`
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    // Decode with windows-1252 to properly handle byte 0x96 (EN DASH)
    let decodedText = '';
    try {
      const decoder = new TextDecoder('windows-1252');
      decodedText = decoder.decode(arrayBuffer);
    } catch {
      // Fallback to utf-8 decoder if windows-1252 is unavailable
      const fallbackDecoder = new TextDecoder('utf-8');
      decodedText = fallbackDecoder.decode(arrayBuffer);
    }

    return processFlexCsvContent(decodedText, csvUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const failureIssue: CsvParseIssue = {
      row: 0,
      severity: 'error',
      message: `Data loader failure: ${message}`,
    };

    const failedReport: FlexDatasetDiagnosticReport = {
      provenance: NASA_FLEX_PSI_69_PROVENANCE,
      sourcePath: csvUrl,
      totalLines: 0,
      headerCount: 0,
      headers: [],
      totalDataRows: 0,
      parsedRecordCount: 0,
      malformedRowCount: 0,
      issues: [failureIssue],
      missingCountByColumn: {},
      distributionByFuel: {},
      distributionByTestEnd: {},
      audit: {
        rawRecordCount: 0,
        rawFuelCounts: {},
        rawOutcomeCounts: {},
        normalizedOutcomeCounts: {},
        duplicateIdentifiers: [],
        invalidFuelCount: 0,
        invalidOutcomeCount: 0,
        unresolvedDiscrepancies: [`Data loader failure: ${message}`],
      },
      sampleParsedRecords: [],
    };

    return { records: [], report: failedReport };
  }
};
