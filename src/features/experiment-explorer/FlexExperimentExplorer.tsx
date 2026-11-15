import React, { useState, useMemo, useEffect } from 'react';
import type { FlexParsedRecord, FlexDatasetDiagnosticReport } from '../../types/dataset';
import { loadFlexDataset } from '../../services/flex-data-processor';
import { ExperimentFilters, type ExperimentFilterCriteria } from './ExperimentFilters';
import { ExperimentTable } from './ExperimentTable';
import { ExperimentDetailModal } from './ExperimentDetailModal';
import { EvidenceAnalytics } from './EvidenceAnalytics';

interface FlexExperimentExplorerProps {
  initialRecords?: FlexParsedRecord[];
  report?: FlexDatasetDiagnosticReport;
  defaultShowAnalytics?: boolean;
}

const DEFAULT_FILTERS: ExperimentFilterCriteria = {
  searchTerm: '',
  fuel: 'ALL',
  outcome: 'ALL',
};

export const FlexExperimentExplorer: React.FC<FlexExperimentExplorerProps> = ({
  initialRecords,
  defaultShowAnalytics = false,
}) => {
  const [loadedRecords, setLoadedRecords] = useState<FlexParsedRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(!initialRecords || initialRecords.length === 0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(defaultShowAnalytics);

  const allRecords = initialRecords && initialRecords.length > 0 ? initialRecords : loadedRecords;

  const [filters, setFilters] = useState<ExperimentFilterCriteria>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedRecord, setSelectedRecord] = useState<FlexParsedRecord | null>(null);

  // If no initialRecords provided, load dataset via existing processor
  useEffect(() => {
    if (initialRecords && initialRecords.length > 0) {
      return;
    }

    let isMounted = true;
    const fetchRecords = async () => {
      try {
        setIsLoading(true);
        const { records, report: loadedReport } = await loadFlexDataset();
        if (isMounted) {
          if (records.length === 0 && loadedReport.issues.length > 0) {
            setErrorMessage(loadedReport.issues[0].message);
          } else {
            setLoadedRecords(records);
          }
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRecords();
    return () => {
      isMounted = false;
    };
  }, [initialRecords]);

  // Handle filter changes and reset to page 1
  const handleFilterChange = (newFilters: ExperimentFilterCriteria) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  // Filter records based on active criteria
  const filteredRecords = useMemo(() => {
    const term = filters.searchTerm.trim().toLowerCase();

    return allRecords.filter((rec) => {
      // Search term matching: test number or FLEX identifier
      if (term) {
        const matchesTestNum = rec.testNumber.toString().includes(term);
        const matchesId = rec.flexIdentifier.toLowerCase().includes(term);
        const matchesDate = rec.testDate.toLowerCase().includes(term);
        if (!matchesTestNum && !matchesId && !matchesDate) return false;
      }

      // Fuel filter
      if (filters.fuel !== 'ALL' && rec.fuel !== filters.fuel) {
        return false;
      }

      // Outcome filter
      if (filters.outcome !== 'ALL' && rec.testEnd !== filters.outcome) {
        return false;
      }

      return true;
    });
  }, [allRecords, filters]);

  if (isLoading) {
    return (
      <div className="flex-explorer__loading" role="status">
        <div className="flex-inspector__spinner" aria-hidden="true" />
        <p>Loading interactive experiment explorer...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex-inspector__error" role="alert">
        <p className="flex-inspector__error-title">Error Loading NASA Experiments</p>
        <p className="flex-inspector__error-desc">{errorMessage}</p>
      </div>
    );
  }

  return (
    <section className="flex-explorer" aria-labelledby="explorer-main-heading">
      {/* Explorer Workspace Header */}
      <div className="flex-explorer__header">
        <div className="flex-explorer__titles">
          <div className="flex-explorer__eyebrow">
            <span className="flex-inspector__tag">FIRST-CLASS SCIENTIFIC WORKSPACE</span>
            <span className="flex-explorer__header-badge font-mono">ISS CIR / MDCA</span>
          </div>
          <h3 id="explorer-main-heading" className="flex-explorer__title">
            NASA PSI-69 FLEX Experiment Explorer
          </h3>
          <p className="flex-explorer__subtitle">
            Search, filter, and inspect all {allRecords.length} microgravity droplet combustion trials conducted aboard the ISS Combustion Integrated Rack.
          </p>
        </div>

        <div className="flex-explorer__header-actions">
          <button
            type="button"
            className={`btn-analytics-toggle ${showAnalytics ? 'btn-analytics-toggle--active' : ''}`}
            onClick={() => setShowAnalytics((prev) => !prev)}
            aria-expanded={showAnalytics}
            aria-controls="explorer-analytics-drawer"
          >
            <span>{showAnalytics ? 'Hide Analytics Grid' : 'Show Analytics Summary'}</span>
            <span aria-hidden="true">{showAnalytics ? '▴' : '▾'}</span>
          </button>
          <a
            href="https://doi.org/10.60555/mbq8-0451"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-explorer__doi-link font-mono"
            title="View official NASA DOI"
          >
            DOI: 10.60555/mbq8-0451 ↗
          </a>
        </div>
      </div>

      {/* Optional Visual Analytics Drawer */}
      {showAnalytics && (
        <div id="explorer-analytics-drawer" className="flex-explorer__analytics-wrapper">
          <EvidenceAnalytics records={allRecords} />
        </div>
      )}

      {/* Interactive Filters Bar */}
      <ExperimentFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        filteredCount={filteredRecords.length}
        totalCount={allRecords.length}
      />

      {/* Paginated Full Table */}
      <ExperimentTable
        records={filteredRecords}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
        onSelectRecord={(rec) => setSelectedRecord(rec)}
        selectedRecordNumber={selectedRecord?.testNumber}
      />

      {/* Modal Dialog for Record Details */}
      <ExperimentDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </section>
  );
};
