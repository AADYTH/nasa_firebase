import React from 'react';
import type { FlexParsedRecord } from '../../types/dataset';

interface ExperimentTableProps {
  records: FlexParsedRecord[];
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSelectRecord: (record: FlexParsedRecord) => void;
  selectedRecordNumber?: number;
}

export const ExperimentTable: React.FC<ExperimentTableProps> = ({
  records,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSelectRecord,
  selectedRecordNumber,
}) => {
  const totalRecords = records.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const currentRecords = records.slice(startIndex, endIndex);

  // Generate page numbers with smart ellipsis window
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) pages.push('...');
      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safeCurrentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  if (totalRecords === 0) {
    return (
      <div className="experiment-table__empty" role="status">
        <div className="experiment-table__empty-icon">🔬</div>
        <h4 className="experiment-table__empty-title">No matching experiments found</h4>
        <p className="experiment-table__empty-desc">
          No records in NASA PSI-69 match your current search query and filter combination.
        </p>
      </div>
    );
  }

  return (
    <div className="experiment-table-container">
      {/* Table responsive scroll wrapper with sticky headers */}
      <div className="table-wrapper" tabIndex={0} aria-label="NASA FLEX Experiments Table">
        <table className="flex-table">
          <thead>
            <tr>
              <th scope="col">Test #</th>
              <th scope="col">Identifier</th>
              <th scope="col">Date &amp; GMT</th>
              <th scope="col">Fuel</th>
              <th scope="col">Pressure (mmHg / kPa)</th>
              <th scope="col">Droplet d₀ (mm)</th>
              <th scope="col">Extinction d (mm)</th>
              <th scope="col">Burn Time (s)</th>
              <th scope="col">Test End</th>
              <th scope="col" className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((rec) => {
              const isSelected = selectedRecordNumber === rec.testNumber;
              const isDuplicateId = rec.flexIdentifier === '193F001';

              return (
                <tr
                  key={rec.testNumber}
                  className={`experiment-row ${isSelected ? 'experiment-row--selected' : ''}`}
                  onClick={() => onSelectRecord(rec)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for Test #${rec.testNumber}, Identifier ${rec.flexIdentifier}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectRecord(rec);
                    }
                  }}
                >
                  {/* Test # */}
                  <th scope="row" className="font-mono">
                    #{rec.testNumber}
                  </th>

                  {/* Identifier */}
                  <td className="font-mono font-bold text-accent">
                    {rec.flexIdentifier}
                    {isDuplicateId && (
                      <span className="badge-duplicate" title="FLEX Identifier shared by Test #70 and Test #73">
                        Duplicate ID
                      </span>
                    )}
                  </td>

                  {/* Date & GMT */}
                  <td>
                    <span>{rec.testDate}</span>
                    <span className="block-sub">
                      {rec.testGmt ?? <span className="text-muted">(GMT not reported)</span>}
                    </span>
                  </td>

                  {/* Fuel */}
                  <td>
                    <span className={`pill-badge ${rec.fuel === 'Methanol' ? 'pill-methanol' : 'pill-heptane'}`}>
                      {rec.fuel}
                    </span>
                  </td>

                  {/* Pressure */}
                  <td className="font-mono">
                    {rec.ambientPressureMmHg === null ? (
                      <span className="badge-not-reported">Not reported</span>
                    ) : rec.ambientPressureMmHg === 0 ? (
                      <span className="badge-genuine-zero">0 mmHg (0 kPa)</span>
                    ) : (
                      <>
                        {rec.ambientPressureMmHg} mmHg
                        <span className="block-sub">({rec.ambientPressureKPa ?? '—'} kPa)</span>
                      </>
                    )}
                  </td>

                  {/* Droplet Initial Diameter */}
                  <td className="font-mono">
                    {rec.dropletInitialDiameterMm !== null ? (
                      `${rec.dropletInitialDiameterMm} mm`
                    ) : (
                      <span className="badge-not-reported">Not reported</span>
                    )}
                  </td>

                  {/* Extinction Diameter */}
                  <td className="font-mono">
                    {rec.visibleFlameExtinctionDiameterMm === null ? (
                      <span className="badge-not-reported">Not reported</span>
                    ) : rec.visibleFlameExtinctionDiameterMm === 0 ? (
                      <span className="badge-genuine-zero">0 mm</span>
                    ) : (
                      `${rec.visibleFlameExtinctionDiameterMm} mm`
                    )}
                  </td>

                  {/* Burn Time */}
                  <td className="font-mono">
                    {rec.burnTimeSec === null ? (
                      <span className="badge-not-reported">Not reported</span>
                    ) : rec.isBurnTimeApproximate ? (
                      <span className="badge-approx">~{rec.burnTimeSec}s (approx)</span>
                    ) : (
                      `${rec.burnTimeSec}s`
                    )}
                  </td>

                  {/* Test End Outcome */}
                  <td>
                    <span className={`outcome-badge outcome-${rec.testEnd.toLowerCase()}`}>
                      {rec.testEnd}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="btn-view-detail"
                      onClick={() => onSelectRecord(rec)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="experiment-pagination" aria-label="Table pagination navigation">
        <div className="experiment-pagination__info">
          Showing <strong>{startIndex + 1}</strong> &ndash; <strong>{endIndex}</strong> of{' '}
          <strong>{totalRecords}</strong> matching records
        </div>

        <div className="experiment-pagination__controls">
          <div className="experiment-pagination__page-size">
            <label htmlFor="pagination-page-size-select" className="experiment-pagination__label">
              Per page:
            </label>
            <select
              id="pagination-page-size-select"
              className="experiment-pagination__select"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <nav className="experiment-pagination__nav" aria-label="Pagination">
            {/* First Page */}
            <button
              type="button"
              className="experiment-pagination__btn"
              onClick={() => onPageChange(1)}
              disabled={safeCurrentPage === 1}
              aria-label="Go to first page"
            >
              «
            </button>

            {/* Prev Page */}
            <button
              type="button"
              className="experiment-pagination__btn"
              onClick={() => onPageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              aria-label="Go to previous page"
            >
              ‹
            </button>

            {/* Page number buttons */}
            {getPageNumbers().map((p, idx) =>
              typeof p === 'number' ? (
                <button
                  key={idx}
                  type="button"
                  className={`experiment-pagination__btn ${
                    safeCurrentPage === p ? 'experiment-pagination__btn--active' : ''
                  }`}
                  onClick={() => onPageChange(p)}
                  aria-current={safeCurrentPage === p ? 'page' : undefined}
                >
                  {p}
                </button>
              ) : (
                <span key={idx} className="experiment-pagination__ellipsis">
                  &hellip;
                </span>
              )
            )}

            {/* Next Page */}
            <button
              type="button"
              className="experiment-pagination__btn"
              onClick={() => onPageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              aria-label="Go to next page"
            >
              ›
            </button>

            {/* Last Page */}
            <button
              type="button"
              className="experiment-pagination__btn"
              onClick={() => onPageChange(totalPages)}
              disabled={safeCurrentPage === totalPages}
              aria-label="Go to last page"
            >
              »
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
