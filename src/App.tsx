import React, { useState, useEffect } from 'react';
import { Shell } from './components/layout/Shell';
import type { FlexParsedRecord, FlexDatasetDiagnosticReport } from './types/dataset';
import type { DashboardTab } from './types/navigation';
import { loadFlexDataset } from './services/flex-data-processor';
import { OverviewDashboard } from './features/overview/OverviewDashboard';
import { FlexExperimentExplorer } from './features/experiment-explorer/FlexExperimentExplorer';
import { CombustionLabView } from './features/combustion-lab/CombustionLabView';
import { EvidenceQualityView } from './features/evidence-quality/EvidenceQualityView';
import './App.css';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [records, setRecords] = useState<FlexParsedRecord[]>([]);
  const [report, setReport] = useState<FlexDatasetDiagnosticReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Ingest and validate the NASA PSI-69 dataset once at application root
  useEffect(() => {
    let isMounted = true;

    const fetchDataset = async () => {
      try {
        setIsLoading(true);
        const { records: parsedRecords, report: parsedReport } = await loadFlexDataset();
        if (isMounted) {
          if (parsedRecords.length === 0 && parsedReport.issues.length > 0) {
            setErrorMessage(parsedReport.issues[0].message);
          } else {
            setRecords(parsedRecords);
            setReport(parsedReport);
          }
        }
      } catch (err) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : String(err);
          setErrorMessage(msg);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDataset();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Shell
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      recordCount={records.length || 274}
    >
      {isLoading ? (
        <div className="app-loading-state" role="status" aria-live="polite">
          <div className="flex-inspector__spinner" aria-hidden="true" />
          <h3 className="app-loading-state__title font-mono">
            Ingesting NASA PSI-69 FLEX Flight Dataset...
          </h3>
          <p className="app-loading-state__desc">
            Decoding Windows-1252 byte characters, verifying 274 sequential experiment runs, and validating 15 original CSV columns.
          </p>
        </div>
      ) : errorMessage ? (
        <div className="flex-inspector__error" role="alert">
          <p className="flex-inspector__error-title">NASA Dataset Ingestion Error</p>
          <p className="flex-inspector__error-desc">{errorMessage}</p>
          <button
            type="button"
            className="btn-secondary-sm mt-3"
            onClick={() => window.location.reload()}
          >
            Retry Dataset Ingestion
          </button>
        </div>
      ) : (
        <div className="tab-content-container">
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div
              role="tabpanel"
              id="panel-overview"
              aria-labelledby="nav-tab-overview"
              tabIndex={0}
              className="tab-panel animate-fade-in"
            >
              <OverviewDashboard
                records={records}
                report={report}
                onNavigate={setActiveTab}
              />
            </div>
          )}

          {/* Tab 2: Experiment Explorer */}
          {activeTab === 'explorer' && (
            <div
              role="tabpanel"
              id="panel-explorer"
              aria-labelledby="nav-tab-explorer"
              tabIndex={0}
              className="tab-panel animate-fade-in"
            >
              <FlexExperimentExplorer
                initialRecords={records}
                report={report ?? undefined}
                defaultShowAnalytics={false}
              />
            </div>
          )}

          {/* Tab 3: 3D Combustion Lab */}
          {activeTab === 'lab3d' && (
            <div
              role="tabpanel"
              id="panel-lab3d"
              aria-labelledby="nav-tab-lab3d"
              tabIndex={0}
              className="tab-panel animate-fade-in"
            >
              <CombustionLabView />
            </div>
          )}

          {/* Tab 4: Evidence & Data Quality */}
          {activeTab === 'evidence' && (
            <div
              role="tabpanel"
              id="panel-evidence"
              aria-labelledby="nav-tab-evidence"
              tabIndex={0}
              className="tab-panel animate-fade-in"
            >
              <EvidenceQualityView
                report={report}
                records={records}
              />
            </div>
          )}
        </div>
      )}
    </Shell>
  );
};

export default App;
