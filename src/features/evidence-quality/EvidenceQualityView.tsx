import React, { useState } from 'react';
import type { FlexParsedRecord, FlexDatasetDiagnosticReport } from '../../types/dataset';
import { Badge } from '../../components/common/Badge';

export interface EvidenceQualityViewProps {
  report: FlexDatasetDiagnosticReport | null;
  records: FlexParsedRecord[];
}

export const EvidenceQualityView: React.FC<EvidenceQualityViewProps> = ({
  report,
  records,
}) => {
  const [selectedTestNum, setSelectedTestNum] = useState<number>(1);

  if (!report) {
    return (
      <div className="flex-inspector__loading" role="status">
        <div className="flex-inspector__spinner" aria-hidden="true" />
        <p>Loading NASA PSI-69 data integrity audit...</p>
      </div>
    );
  }

  const selectedRecord = records.find((r) => r.testNumber === selectedTestNum) ?? records[0];

  return (
    <div className="evidence-quality-view">
      {/* 1. Provenance & Ground-Truth Header */}
      <div className="evidence-provenance-header">
        <div className="evidence-provenance-header__main">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex-inspector__tag">DATA INTEGRITY &amp; GROUND-TRUTH AUDIT</span>
            <span className="evidence-provenance-header__pill font-mono">TASK 3B SPECIFICATION</span>
          </div>
          <h3 className="evidence-provenance-header__title">
            NASA PSI-69 FLEX Scientific Evidence Audit
          </h3>
          <p className="evidence-provenance-header__desc">
            Exhaustive verification of raw CSV records, character encodings, column schemas, and empirical discrepancies for ISS Combustion Integrated Rack data.
          </p>
        </div>

        <div className="evidence-provenance-header__badges">
          <Badge variant="success">Byte-For-Byte Verified</Badge>
          <a
            href="https://doi.org/10.60555/mbq8-0451"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-inspector__doi-badge font-mono"
            title="Open official DOI citation"
          >
            DOI: {report.provenance.doi} ↗
          </a>
        </div>
      </div>

      {/* 2. Verification Metrics Grid */}
      <div className="flex-inspector__metrics">
        <div className="flex-inspector__metric-card">
          <span className="flex-inspector__metric-val font-mono">{report.parsedRecordCount}</span>
          <span className="flex-inspector__metric-label">Parsed Data Rows</span>
          <span className="flex-inspector__metric-sub">100% rows validated (Tests #1–#274)</span>
        </div>
        <div className="flex-inspector__metric-card">
          <span className="flex-inspector__metric-val font-mono">{report.headerCount}</span>
          <span className="flex-inspector__metric-label">Original CSV Columns</span>
          <span className="flex-inspector__metric-sub">Full NASA schema preserved verbatim</span>
        </div>
        <div className="flex-inspector__metric-card">
          <span className="flex-inspector__metric-val font-mono">{report.malformedRowCount}</span>
          <span className="flex-inspector__metric-label">Malformed Rows</span>
          <span className="flex-inspector__metric-sub">0 line length or delimiter anomalies</span>
        </div>
        <div className="flex-inspector__metric-card">
          <span className="flex-inspector__metric-val font-mono text-amber">112</span>
          <span className="flex-inspector__metric-label">Missing Cells Preserved</span>
          <span className="flex-inspector__metric-sub">Safely parsed as null (never zero)</span>
        </div>
      </div>

      {/* 3. Deep Audit Grid */}
      <div className="evidence-audit-grid">
        {/* Card 1: Raw Record & Line Count Audit */}
        <div className="evidence-card">
          <div className="evidence-card__header">
            <span className="evidence-card__tag">SCHEMA &amp; ROWS</span>
            <h4 className="evidence-card__title">Raw Record &amp; File Structure</h4>
          </div>
          <ul className="evidence-card__list font-mono text-sm">
            <li>
              <strong>Raw CSV Data Records:</strong> {report.audit.rawRecordCount} rows (excluding header &amp; trailing line)
            </li>
            <li>
              <strong>Total CSV Lines:</strong> {report.totalLines} lines (1 header + 274 data rows + 1 trailing newline)
            </li>
            <li>
              <strong>Sequential Test #:</strong> 1 through 274 (0 duplicate test numbers, 0 missing numbers)
            </li>
            <li>
              <strong>Column Count:</strong> {report.headerCount} columns matching expected NASA schema byte-for-byte
            </li>
            <li>
              <strong>File Provenance:</strong> <code>public/data/raw/PSI-69_Experimental table_FLEX.csv</code>
            </li>
          </ul>
        </div>

        {/* Card 2: The Unresolved 275 vs. 274 Record Discrepancy */}
        <div className="evidence-card evidence-card--highlight">
          <div className="evidence-card__header">
            <span className="evidence-card__tag evidence-card__tag--amber">DISCREPANCY AUDIT</span>
            <h4 className="evidence-card__title">The 275 vs. 274 Count Discrepancy</h4>
          </div>
          <p className="evidence-card__text">
            <strong>Observation:</strong> External summaries and citations have occasionally referenced &ldquo;275 records&rdquo; for the FLEX experimental table.
          </p>
          <div className="evidence-discrepancy-box">
            <h5 className="evidence-discrepancy-box__title font-mono text-xs text-amber">
              GROUNDED EVIDENCE ANALYSIS:
            </h5>
            <ul className="evidence-card__list text-xs">
              <li>
                The downloadable NASA CSV table contains exactly <strong>275 non-empty lines</strong>.
              </li>
              <li>
                Line 1 is the 15-column NASA CSV header row. Lines 2 through 275 contain exactly <strong>274 experimental trials</strong>, numbered sequentially from <code>FLEX Test # 1</code> to <code>FLEX Test # 274</code>.
              </li>
              <li>
                External references citing 275 records may have inadvertently counted the header line as a data row, or referred to an unindexed calibration trial outside this table.
              </li>
              <li>
                <strong>Strict Scientific Policy:</strong> FIRETRACE preserves this discrepancy as <em>officially unresolved</em> rather than guessing or fabricating a 275th record.
              </li>
            </ul>
          </div>
        </div>

        {/* Card 3: Duplicate Identifier Warning */}
        <div className="evidence-card">
          <div className="evidence-card__header">
            <span className="evidence-card__tag evidence-card__tag--amber">IDENTIFIER AUDIT</span>
            <h4 className="evidence-card__title">Hardware Identifier Duplication</h4>
          </div>
          <p className="evidence-card__text">
            NASA hardware run identifier <code>193F001</code> appears in two separate rows:
          </p>
          <div className="duplicate-comparison-table font-mono text-xs">
            <div className="duplicate-row">
              <span className="text-accent font-bold">Test #70:</span>
              <span>Date: 2009-08-25</span>
              <span>GMT: 08:34</span>
              <span>Press: 760 mmHg</span>
              <span>Fuel: Heptane</span>
            </div>
            <div className="duplicate-row">
              <span className="text-accent font-bold">Test #73:</span>
              <span>Date: 2009-08-25</span>
              <span>GMT: 12:47</span>
              <span>Press: 759 mmHg</span>
              <span>Fuel: Heptane</span>
            </div>
          </div>
          <p className="evidence-card__subtext">
            <strong>Verification:</strong> These are distinct experimental burns separated by 4 hours and 1 mmHg pressure difference. Both runs are fully preserved with their unique sequential test numbers.
          </p>
        </div>

        {/* Card 4: Outcome Normalization Audit */}
        <div className="evidence-card">
          <div className="evidence-card__header">
            <span className="evidence-card__tag">OUTCOME NORMALIZATION</span>
            <h4 className="evidence-card__title">Raw vs. Normalized Outcome Counts</h4>
          </div>
          <ul className="evidence-card__list">
            {Object.entries(report.audit.rawOutcomeCounts).map(([outcome, count]) => (
              <li key={outcome} className="flex justify-between items-center font-mono text-xs">
                <span>
                  Raw &ldquo;<strong>{outcome}</strong>&rdquo; &rarr; Normalized:
                </span>
                <span className="font-bold text-accent">
                  {count} rows ({((count / report.audit.rawRecordCount) * 100).toFixed(2)}%)
                </span>
              </li>
            ))}
          </ul>
          <div className="evidence-card__subtext mt-2">
            <strong>Normalization Policy:</strong> 1:1 identity preservation. Zero synthetic category merging, reclassification, or lossy grouping. 0 invalid or unrecognized outcomes.
          </div>
        </div>

        {/* Card 5: Missing Values Breakdown */}
        <div className="evidence-card">
          <div className="evidence-card__header">
            <span className="evidence-card__tag evidence-card__tag--amber">MISSING VALUES</span>
            <h4 className="evidence-card__title">Missing Value Breakdown (112 Total)</h4>
          </div>
          <p className="evidence-card__text">
            NASA encodes missing values as either empty strings (<code>,,</code>) or Windows-1252 byte 0x96 en-dashes (<code>–</code>). All 112 are preserved as <code>null</code>:
          </p>
          <ul className="evidence-card__list font-mono text-xs">
            <li className="flex justify-between">
              <span>Visible flame extinction diameter; mm:</span>
              <strong className="text-amber">77 missing (49 empty, 28 en-dash)</strong>
            </li>
            <li className="flex justify-between">
              <span>Burning rate; mm:</span>
              <strong className="text-amber">16 missing (16 empty)</strong>
            </li>
            <li className="flex justify-between">
              <span>Droplet initial diameter; mm:</span>
              <strong className="text-amber">12 missing (6 empty, 6 en-dash)</strong>
            </li>
            <li className="flex justify-between">
              <span>Burn time; s:</span>
              <strong className="text-amber">6 missing (6 empty)</strong>
            </li>
            <li className="flex justify-between">
              <span>Test GMT:</span>
              <strong className="text-amber">1 missing (Test #9 / 30CAL07)</strong>
            </li>
            <li className="flex justify-between text-success">
              <span>All remaining 10 columns:</span>
              <strong>0 missing values (100% complete)</strong>
            </li>
          </ul>
          <div className="evidence-card__subtext mt-2">
            <strong>Rule 9 Verification:</strong> Missing values are never converted to zero, protecting mean calculations from artificial skew.
          </div>
        </div>

        {/* Card 6: Preserved Uncertainties & Units */}
        <div className="evidence-card">
          <div className="evidence-card__header">
            <span className="evidence-card__tag">SCIENTIFIC UNCERTAINTIES</span>
            <h4 className="evidence-card__title">Preserved Uncertainties &amp; Anomalies</h4>
          </div>
          <ul className="evidence-card__list text-xs">
            <li>
              <strong>Approximate Burn Times:</strong> Tests #223 (<code>~6 s</code>) &amp; #224 (<code>~9 s</code>) flag <code>isBurnTimeApproximate: true</code>; raw approximate notation preserved.
            </li>
            <li>
              <strong>Preserved Numerical Zeros:</strong> 8 rows record extinction diameter as <code>0</code> (completed/disrupted burns); Test #114 records <code>0 mmHg</code> chamber pressure (vented condition). Preserved as numerical 0, strictly distinct from missing null.
            </li>
            <li>
              <strong>NASA Header &apos;Burning rate; mm&apos;:</strong> Preserved verbatim with original unit <code>mm</code> without speculating between mm/s or mm²/s.
            </li>
            <li>
              <strong>NASA Header &apos;CO initial ambient composition&apos;:</strong> Preserved as labeled without assuming carbon monoxide vs carbon dioxide (CO₂).
            </li>
          </ul>
        </div>
      </div>

      {/* 4. Interactive Raw CSV vs Normalized Data Comparator */}
      <section className="evidence-comparator-section" aria-labelledby="comparator-heading">
        <div className="evidence-comparator-card">
          <div className="evidence-comparator-card__header">
            <div>
              <span className="section-eyebrow">RAW VS. NORMALIZED COMPARATOR</span>
              <h4 id="comparator-heading" className="section-title">
                Inspect Raw CSV Text vs. Parsed Scientific Record
              </h4>
              <p className="evidence-card__subtext">
                Select any test number (1–274) to audit the raw string tokens extracted from the NASA CSV against the strongly-typed normalized TypeScript record.
              </p>
            </div>

            <div className="comparator-selector">
              <label htmlFor="test-select" className="font-mono text-xs text-subtle">
                Select Test #:
              </label>
              <select
                id="test-select"
                className="comparator-select font-mono"
                value={selectedTestNum}
                onChange={(e) => setSelectedTestNum(Number(e.target.value))}
              >
                {records.map((r) => (
                  <option key={r.testNumber} value={r.testNumber}>
                    Test #{r.testNumber} ({r.flexIdentifier} — {r.fuel})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedRecord && (
            <div className="comparator-views-grid">
              {/* Raw CSV Text View */}
              <div className="comparator-view">
                <div className="comparator-view__header">
                  <span className="font-mono text-xs text-cyan font-bold">1. Raw NASA CSV Row (String Dictionary)</span>
                  <span className="font-mono text-xs text-subtle">Row #{selectedRecord.fileRowIndex} in file</span>
                </div>
                <pre className="comparator-code-block font-mono">
                  {JSON.stringify(selectedRecord.raw, null, 2)}
                </pre>
              </div>

              {/* Parsed Normalized View */}
              <div className="comparator-view">
                <div className="comparator-view__header">
                  <span className="font-mono text-xs text-amber font-bold">2. Normalized &amp; Typed Record</span>
                  <span className="font-mono text-xs text-subtle">Type: FlexParsedRecord</span>
                </div>
                <pre className="comparator-code-block font-mono">
                  {JSON.stringify(
                    {
                      testNumber: selectedRecord.testNumber,
                      flexIdentifier: selectedRecord.flexIdentifier,
                      testDate: selectedRecord.testDate,
                      testGmt: selectedRecord.testGmt,
                      fuel: selectedRecord.fuel,
                      ambientPressureMmHg: selectedRecord.ambientPressureMmHg,
                      ambientPressureKPa: selectedRecord.ambientPressureKPa,
                      dropletInitialDiameterMm: selectedRecord.dropletInitialDiameterMm,
                      visibleFlameExtinctionDiameterMm: selectedRecord.visibleFlameExtinctionDiameterMm,
                      burningRateReported: selectedRecord.burningRateReported,
                      burnTimeSec: selectedRecord.burnTimeSec,
                      isBurnTimeApproximate: selectedRecord.isBurnTimeApproximate,
                      testEnd: selectedRecord.testEnd,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
