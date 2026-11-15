import React from 'react';

export interface ExperimentFilterCriteria {
  searchTerm: string;
  fuel: 'ALL' | 'Methanol' | 'Heptane';
  outcome: 'ALL' | 'Extinction' | 'Disruption' | 'Completion';
}

interface ExperimentFiltersProps {
  filters: ExperimentFilterCriteria;
  onFilterChange: (newFilters: ExperimentFilterCriteria) => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export const ExperimentFilters: React.FC<ExperimentFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  filteredCount,
  totalCount,
}) => {
  const isFiltered =
    filters.searchTerm.trim() !== '' ||
    filters.fuel !== 'ALL' ||
    filters.outcome !== 'ALL';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      searchTerm: e.target.value,
    });
  };

  const handleFuelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      fuel: e.target.value as ExperimentFilterCriteria['fuel'],
    });
  };

  const handleOutcomeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      outcome: e.target.value as ExperimentFilterCriteria['outcome'],
    });
  };

  return (
    <div className="experiment-filters" role="search" aria-label="Filter NASA experiments">
      <div className="experiment-filters__row">
        {/* Search Input */}
        <div className="experiment-filters__group experiment-filters__group--search">
          <label htmlFor="filter-search-input" className="experiment-filters__label">
            Search Experiment
          </label>
          <div className="experiment-filters__input-wrapper">
            <span className="experiment-filters__icon" aria-hidden="true">
              🔍
            </span>
            <input
              id="filter-search-input"
              type="text"
              className="experiment-filters__input"
              placeholder="Search by Test # or Identifier (e.g. 20CAL08, 193F001)..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
              autoComplete="off"
            />
            {filters.searchTerm && (
              <button
                type="button"
                className="experiment-filters__clear-search"
                onClick={() => onFilterChange({ ...filters, searchTerm: '' })}
                aria-label="Clear search input"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Fuel Dropdown */}
        <div className="experiment-filters__group">
          <label htmlFor="filter-fuel-select" className="experiment-filters__label">
            Fuel Type
          </label>
          <select
            id="filter-fuel-select"
            className="experiment-filters__select"
            value={filters.fuel}
            onChange={handleFuelChange}
          >
            <option value="ALL">All Fuels (274)</option>
            <option value="Methanol">Methanol (157)</option>
            <option value="Heptane">Heptane (117)</option>
          </select>
        </div>

        {/* Outcome Dropdown */}
        <div className="experiment-filters__group">
          <label htmlFor="filter-outcome-select" className="experiment-filters__label">
            Test End Outcome
          </label>
          <select
            id="filter-outcome-select"
            className="experiment-filters__select"
            value={filters.outcome}
            onChange={handleOutcomeChange}
          >
            <option value="ALL">All Outcomes (274)</option>
            <option value="Extinction">Extinction (186)</option>
            <option value="Disruption">Disruption (61)</option>
            <option value="Completion">Completion (27)</option>
          </select>
        </div>

        {/* Reset Action */}
        <div className="experiment-filters__group experiment-filters__group--actions">
          <button
            type="button"
            className={`experiment-filters__reset-btn ${
              isFiltered ? 'experiment-filters__reset-btn--active' : ''
            }`}
            onClick={onResetFilters}
            disabled={!isFiltered}
            title={isFiltered ? 'Reset search and filters' : 'No active filters'}
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Match Count Bar */}
      <div className="experiment-filters__status-bar">
        <div className="experiment-filters__count-badge">
          Showing <span className="font-mono font-bold text-accent">{filteredCount}</span> of{' '}
          <span className="font-mono font-bold">{totalCount}</span> experiments
        </div>

        {isFiltered && (
          <div className="experiment-filters__active-tags" aria-live="polite">
            <span className="experiment-filters__tag-label">Active filters:</span>
            {filters.searchTerm && (
              <span className="filter-tag">
                Query: &ldquo;{filters.searchTerm}&rdquo;
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, searchTerm: '' })}
                  aria-label="Remove search filter"
                >
                  ×
                </button>
              </span>
            )}
            {filters.fuel !== 'ALL' && (
              <span className="filter-tag">
                Fuel: {filters.fuel}
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, fuel: 'ALL' })}
                  aria-label="Remove fuel filter"
                >
                  ×
                </button>
              </span>
            )}
            {filters.outcome !== 'ALL' && (
              <span className="filter-tag">
                Outcome: {filters.outcome}
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, outcome: 'ALL' })}
                  aria-label="Remove outcome filter"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
