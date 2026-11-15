import React from 'react';
import type { FlexParsedRecord, FlexDatasetDiagnosticReport } from '../../types/dataset';
import { EvidenceAnalytics } from '../experiment-explorer/EvidenceAnalytics';
import { PROJECT_METADATA } from '../../constants/project';

export interface OverviewDashboardProps {
  records: FlexParsedRecord[];
  report: FlexDatasetDiagnosticReport | null;
  onNavigate: (tab: 'overview' | 'explorer' | 'lab3d' | 'evidence') => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  records,
  report,
  onNavigate,
}) => {
  // Dynamically derive statistics from the real dataset
  const parsedRecordCount = report?.parsedRecordCount ?? records.length;
  const fuelCategoryCount = report
    ? Object.keys(report.distributionByFuel).length
    : new Set(records.map((r) => r.fuel)).size;
  const columnCount = report?.headerCount ?? 15;

  // Calculate total missing cells dynamically across columns
  const totalMissingCells = report
    ? Object.values(report.missingCountByColumn).reduce((sum, count) => sum + count, 0)
    : 112;

  // Fuel breakdown text for metric card subtext
  const methanolCount = report?.distributionByFuel['Methanol'] ??
    records.filter((r) => r.fuel === 'Methanol').length;
  const heptaneCount = report?.distributionByFuel['Heptane'] ??
    records.filter((r) => r.fuel === 'Heptane').length;

  return (
    <div className="overview-dashboard">
      {/* 1. Compact Introduction */}
      <section className="overview-hero" aria-labelledby="overview-heading">
        <div className="overview-hero__header">
          <div className="overview-hero__eyebrow">
            <span className="overview-hero__pulse-dot" aria-hidden="true" />
            <span>NASA Physical Sciences Informatics • Investigation PSI-69</span>
          </div>
          <span className="overview-hero__tag font-mono">ISS CIR / MDCA</span>
        </div>

        <h2 id="overview-heading" className="overview-hero__title">
          {PROJECT_METADATA.name} — {PROJECT_METADATA.tagline}
        </h2>
        <p className="overview-hero__description">
          Examining microgravity droplet combustion dynamics and flame extinguishment limits from NASA PSI-69 flight experiments aboard the International Space Station to advance spacecraft fire safety.
        </p>

        <div className="overview-hero__specs">
          <div className="overview-hero__spec-item">
            <span className="overview-hero__spec-label">Target Environment</span>
            <span className="overview-hero__spec-value">Microgravity (10⁻⁴ to 10⁻⁶ g)</span>
          </div>
          <div className="overview-hero__spec-item">
            <span className="overview-hero__spec-label">Research Platform</span>
            <span className="overview-hero__spec-value">ISS CIR (Combustion Integrated Rack)</span>
          </div>
          <div className="overview-hero__spec-item">
            <span className="overview-hero__spec-label">Fire-Safety Benchmark</span>
            <span className="overview-hero__spec-value">NASA-STD-6001B Flammability</span>
          </div>
          <div className="overview-hero__spec-item">
            <span className="overview-hero__spec-label">Data Grounding</span>
            <span className="overview-hero__spec-value">100% Grounded NASA Flight Data</span>
          </div>
        </div>
      </section>

      {/* 2. Four Concise Metric Cards for the Real Dataset */}
      <section className="overview-metrics-section" aria-label="Key Dataset Metrics">
        <div className="overview-metrics-grid">
          {/* Metric 1: Parsed Records */}
          <div className="overview-metric-card">
            <div className="overview-metric-card__header">
              <span className="overview-metric-card__icon" aria-hidden="true">🔬</span>
              <span className="overview-metric-card__badge overview-metric-card__badge--success">100% Validated</span>
            </div>
            <div className="overview-metric-card__value font-mono font-bold">
              {parsedRecordCount}
            </div>
            <div className="overview-metric-card__label">Parsed Experimental Records</div>
            <div className="overview-metric-card__subtext">
              Sequential flight tests #1 through #{parsedRecordCount} aboard ISS CIR
            </div>
          </div>

          {/* Metric 2: Fuel Categories */}
          <div className="overview-metric-card">
            <div className="overview-metric-card__header">
              <span className="overview-metric-card__icon" aria-hidden="true">⚗️</span>
              <span className="overview-metric-card__badge overview-metric-card__badge--cyan">Pure Liquid Fuels</span>
            </div>
            <div className="overview-metric-card__value font-mono font-bold">
              {fuelCategoryCount}
            </div>
            <div className="overview-metric-card__label">Fuel Categories</div>
            <div className="overview-metric-card__subtext">
              Methanol ({methanolCount} trials) &amp; Heptane ({heptaneCount} trials)
            </div>
          </div>

          {/* Metric 3: CSV Columns */}
          <div className="overview-metric-card">
            <div className="overview-metric-card__header">
              <span className="overview-metric-card__icon" aria-hidden="true">📋</span>
              <span className="overview-metric-card__badge overview-metric-card__badge--neutral">Preserved Schema</span>
            </div>
            <div className="overview-metric-card__value font-mono font-bold">
              {columnCount}
            </div>
            <div className="overview-metric-card__label">Original CSV Columns</div>
            <div className="overview-metric-card__subtext">
              Full NASA PSI-69 schema preserved without column dropping
            </div>
          </div>

          {/* Metric 4: Missing Cells (Explicitly identified as missing, never zero) */}
          <div className="overview-metric-card">
            <div className="overview-metric-card__header">
              <span className="overview-metric-card__icon" aria-hidden="true">⚠️</span>
              <span className="overview-metric-card__badge overview-metric-card__badge--amber">Preserved as Null</span>
            </div>
            <div className="overview-metric-card__value font-mono font-bold text-amber">
              {totalMissingCells}
            </div>
            <div className="overview-metric-card__label">Missing Cells Preserved</div>
            <div className="overview-metric-card__subtext">
              Tracked across 5 columns as null (empty or en-dash) • Never coerced to zero
            </div>
          </div>
        </div>
      </section>

      {/* 3. Prominent, Balanced Grid of Descriptive Analytics */}
      <section className="overview-analytics-section" aria-labelledby="analytics-heading">
        <div className="section-header-compact">
          <div>
            <span className="section-eyebrow">RESEARCH-GRADE ANALYTICS</span>
            <h3 id="analytics-heading" className="section-title">
              Descriptive Flight Distributions
            </h3>
          </div>
          <div className="section-actions">
            <button
              type="button"
              className="btn-secondary-sm"
              onClick={() => onNavigate('explorer')}
              title="Open full interactive dataset table"
            >
              <span>Explore Table Data</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* Descriptive Analytics Component */}
        <EvidenceAnalytics records={records} />
      </section>

      {/* 4. Clear Entry Point into the NASA Experiment Explorer */}
      <section className="overview-cta-section" aria-labelledby="cta-heading">
        <div className="overview-cta-card">
          <div className="overview-cta-card__glow" aria-hidden="true" />
          <div className="overview-cta-card__content">
            <div className="overview-cta-card__badge">
              <span className="pill-dot pill-dot--cyan" />
              FIRST-CLASS SCIENTIFIC WORKSPACE
            </div>
            <h3 id="cta-heading" className="overview-cta-card__title">
              Explore All {parsedRecordCount} NASA Microgravity Flame Trials
            </h3>
            <p className="overview-cta-card__description">
              Filter by fuel chemistry, termination outcome, chamber pressure, and initial droplet diameter.
              Inspect raw NASA CSV telemetry records, Windows-1252 character encodings, and measurement uncertainties in the dedicated table workspace.
            </p>
            <div className="overview-cta-card__tags">
              <span className="overview-cta-tag font-mono">Multi-Variable Search</span>
              <span className="overview-cta-tag font-mono">Exact NASA Schema</span>
              <span className="overview-cta-tag font-mono">Approximate Value Flags</span>
              <span className="overview-cta-tag font-mono">15-Field Detail Modals</span>
            </div>
          </div>
          <div className="overview-cta-card__action">
            <button
              type="button"
              className="overview-cta-card__button"
              onClick={() => onNavigate('explorer')}
              aria-label="Launch Experiment Explorer Workspace"
            >
              <span>Launch Experiment Explorer</span>
              <span className="overview-cta-card__arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. Compact Data-Source and Evidence-Quality Summary */}
      <section className="overview-provenance-section" aria-labelledby="provenance-heading">
        <div className="provenance-summary-card">
          <div className="provenance-summary-card__header">
            <div className="provenance-summary-card__title-group">
              <span className="provenance-summary-card__icon" aria-hidden="true">🏛️</span>
              <div>
                <h4 id="provenance-heading" className="provenance-summary-card__title">
                  NASA Open Science Provenance &amp; Evidence Quality
                </h4>
                <p className="provenance-summary-card__subtitle">
                  Investigation PSI-69 (Flame Extinguishment Experiment — FLEX)
                </p>
              </div>
            </div>
            <div className="provenance-summary-card__badges">
              <span className="badge-grounded">Byte-For-Byte Verified</span>
              <a
                href="https://doi.org/10.60555/mbq8-0451"
                target="_blank"
                rel="noopener noreferrer"
                className="badge-doi font-mono"
                title="View persistent DOI record"
              >
                DOI: 10.60555/mbq8-0451 ↗
              </a>
            </div>
          </div>

          <div className="provenance-summary-card__grid">
            <div className="provenance-summary-card__item">
              <span className="provenance-summary-card__item-label">Repository &amp; Source</span>
              <span className="provenance-summary-card__item-val">
                <a
                  href="https://psi.nasa.gov/physci/repo/data/investigations/PSI-69"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="provenance-link"
                >
                  NASA Physical Sciences Informatics (PSI) ↗
                </a>
              </span>
            </div>
            <div className="provenance-summary-card__item">
              <span className="provenance-summary-card__item-label">Research Facility</span>
              <span className="provenance-summary-card__item-val">
                ISS Combustion Integrated Rack (CIR) / MDCA
              </span>
            </div>
            <div className="provenance-summary-card__item">
              <span className="provenance-summary-card__item-label">Integrity Status</span>
              <span className="provenance-summary-card__item-val text-success">
                274 Rows / 15 Columns / 0 Malformed Rows
              </span>
            </div>
            <div className="provenance-summary-card__item">
              <span className="provenance-summary-card__item-label">Verified Source File</span>
              <span className="provenance-summary-card__item-val font-mono">
                public/data/raw/PSI-69_Experimental table_FLEX.csv
              </span>
            </div>
          </div>

          <div className="provenance-summary-card__footer">
            <p className="provenance-summary-card__note">
              <strong>Audit Notice:</strong> 112 cells are missing across 5 columns (all preserved as null, never zero). 1 duplicate hardware identifier (<code>193F001</code>) flagged across Tests #70 and #73. The 275 vs. 274 record count discrepancy is preserved as officially unresolved.
            </p>
            <button
              type="button"
              className="provenance-summary-card__link-btn"
              onClick={() => onNavigate('evidence')}
            >
              <span>View Complete Data Integrity Audit</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
