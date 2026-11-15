import React, { useEffect, useRef } from 'react';
import type { FlexParsedRecord } from '../../types/dataset';
import { NASA_FLEX_PSI_69_PROVENANCE } from '../../constants/dataset-provenance';

interface ExperimentDetailModalProps {
  record: FlexParsedRecord | null;
  onClose: () => void;
}

export const ExperimentDetailModal: React.FC<ExperimentDetailModalProps> = ({
  record,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (record) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [record]);

  if (!record) return null;

  const isDuplicateId = record.flexIdentifier === '193F001';

  // 15 fields mapping with exact NASA CSV headers
  const fieldRows = [
    {
      num: 1,
      header: 'FLEX Test #',
      raw: record.raw['FLEX Test #'],
      parsed: `#${record.testNumber}`,
      isMissing: false,
      isZero: false,
      isApprox: false,
      note: 'Unique sequential test index (1–274).',
    },
    {
      num: 2,
      header: 'FLEX Identifier',
      raw: record.raw['FLEX Identifier'],
      parsed: record.flexIdentifier,
      isMissing: false,
      isZero: false,
      isApprox: false,
      note: isDuplicateId
        ? 'Duplicate identifier: Shared with Test #70 and Test #73.'
        : 'NASA hardware test run identifier.',
    },
    {
      num: 3,
      header: 'Test Date',
      raw: record.raw['Test Date'],
      parsed: record.testDate,
      isMissing: false,
      isZero: false,
      isApprox: false,
      note: 'Date of trial aboard ISS CIR.',
    },
    {
      num: 4,
      header: 'Test GMT',
      raw: record.raw['Test GMT'],
      parsed: record.testGmt ?? 'Not reported',
      isMissing: record.testGmt === null,
      isZero: false,
      isApprox: false,
      note: record.testGmt === null ? 'Empty in original NASA CSV table.' : 'Greenwich Mean Time of burn.',
    },
    {
      num: 5,
      header: 'Fuel',
      raw: record.raw['Fuel'],
      parsed: record.fuel,
      isMissing: false,
      isZero: false,
      isApprox: false,
      note: 'Pure liquid hydrocarbon / alcohol fuel.',
    },
    {
      num: 6,
      header: 'Ambient pressure; mmHg',
      raw: record.raw['Ambient pressure; mmHg'],
      parsed:
        record.ambientPressureMmHg !== null
          ? `${record.ambientPressureMmHg} mmHg (${record.ambientPressureKPa ?? '—'} kPa)`
          : 'Not reported',
      isMissing: record.ambientPressureMmHg === null,
      isZero: record.ambientPressureMmHg === 0,
      isApprox: false,
      note:
        record.ambientPressureMmHg === 0
          ? 'Genuine zero value in NASA record (Test #114).'
          : 'Chamber ambient pressure. Converted to kPa via standard conversion (1 mmHg = 0.133322 kPa).',
    },
    {
      num: 7,
      header: 'O initial ambient composition; mole fraction',
      raw: record.raw['O initial ambient composition; mole fraction'],
      parsed: record.oxygenMoleFraction !== null ? String(record.oxygenMoleFraction) : 'Not reported',
      isMissing: record.oxygenMoleFraction === null,
      isZero: false,
      isApprox: false,
      note: 'Initial chamber oxygen mole fraction (O₂).',
    },
    {
      num: 8,
      header: 'N initial ambient composition; mole fraction',
      raw: record.raw['N initial ambient composition; mole fraction'],
      parsed: record.nitrogenMoleFraction !== null ? String(record.nitrogenMoleFraction) : 'Not reported',
      isMissing: record.nitrogenMoleFraction === null,
      isZero: false,
      isApprox: false,
      note: 'Initial chamber nitrogen mole fraction (N₂).',
    },
    {
      num: 9,
      header: 'CO initial ambient composition; mole fraction',
      raw: record.raw['CO initial ambient composition; mole fraction'],
      parsed: record.carbonOxideMoleFraction !== null ? String(record.carbonOxideMoleFraction) : 'Not reported',
      isMissing: record.carbonOxideMoleFraction === null,
      isZero: record.carbonOxideMoleFraction === 0,
      isApprox: false,
      note: 'NASA header specifies "CO". Microgravity fire-suppression experiments commonly employ CO₂ diluent; preserved verbatim without chemical assumption.',
    },
    {
      num: 10,
      header: 'He initial ambient composition; mole fraction',
      raw: record.raw['He initial ambient composition; mole fraction'],
      parsed: record.heliumMoleFraction !== null ? String(record.heliumMoleFraction) : 'Not reported',
      isMissing: record.heliumMoleFraction === null,
      isZero: record.heliumMoleFraction === 0,
      isApprox: false,
      note: 'Initial chamber helium mole fraction (He).',
    },
    {
      num: 11,
      header: 'Droplet initial diameter; mm',
      raw: record.raw['Droplet initial diameter; mm'],
      parsed: record.dropletInitialDiameterMm !== null ? `${record.dropletInitialDiameterMm} mm` : 'Not reported',
      isMissing: record.dropletInitialDiameterMm === null,
      isZero: false,
      isApprox: false,
      note: record.dropletInitialDiameterMm === null ? 'Missing in NASA source data (never treated as 0).' : 'Ignition diameter d₀ of fuel droplet.',
    },
    {
      num: 12,
      header: 'Visible flame extinction diameter; mm',
      raw: record.raw['Visible flame extinction diameter; mm'],
      parsed:
        record.visibleFlameExtinctionDiameterMm !== null
          ? `${record.visibleFlameExtinctionDiameterMm} mm`
          : 'Not reported',
      isMissing: record.visibleFlameExtinctionDiameterMm === null,
      isZero: record.visibleFlameExtinctionDiameterMm === 0,
      isApprox: false,
      note:
        record.visibleFlameExtinctionDiameterMm === 0
          ? 'Genuine zero: Droplet burned completely to zero or disrupted without extinguishing at residual size.'
          : record.visibleFlameExtinctionDiameterMm === null
          ? 'Missing/unrecorded extinction diameter (never treated as 0).'
          : 'Residual droplet diameter at visible extinction.',
    },
    {
      num: 13,
      header: 'Burning rate; mm',
      raw: record.raw['Burning rate; mm'],
      parsed: record.burningRateReported !== null ? `${record.burningRateReported} mm` : 'Not reported',
      isMissing: record.burningRateReported === null,
      isZero: false,
      isApprox: false,
      note: 'Unit is labeled "mm" in NASA header (droplet combustion literature often uses mm²/s or mm/s). Preserved verbatim.',
    },
    {
      num: 14,
      header: 'Burn time; s',
      raw: record.raw['Burn time; s'],
      parsed: record.burnTimeSec !== null ? `${record.burnTimeSec} s` : 'Not reported',
      isMissing: record.burnTimeSec === null,
      isZero: false,
      isApprox: record.isBurnTimeApproximate,
      note: record.isBurnTimeApproximate
        ? `Approximate burn time in NASA source data (raw string "${record.raw['Burn time; s']}").`
        : 'Observed droplet combustion duration.',
    },
    {
      num: 15,
      header: 'Test end',
      raw: record.raw['Test end'],
      parsed: record.testEnd,
      isMissing: false,
      isZero: false,
      isApprox: false,
      note: 'Observed experimental termination classification (Extinction, Disruption, or Completion).',
    },
  ];

  return (
    <dialog
      ref={dialogRef}
      className="experiment-modal"
      aria-labelledby="experiment-modal-title"
      onCancel={onClose}
    >
      <div className="experiment-modal__container">
        {/* Modal Header */}
        <div className="experiment-modal__header">
          <div>
            <div className="experiment-modal__eyebrow">
              NASA PSI-69 FLEX Experiment Details
            </div>
            <h3 id="experiment-modal-title" className="experiment-modal__title">
              Test #{record.testNumber} &mdash; {record.flexIdentifier}
            </h3>
          </div>
          <button
            type="button"
            className="experiment-modal__close-btn"
            onClick={onClose}
            aria-label="Close experiment detail modal"
          >
            ✕
          </button>
        </div>

        {/* Provenance Banner */}
        <div className="experiment-modal__provenance">
          <div className="experiment-modal__provenance-item">
            <span className="experiment-modal__provenance-label">Investigation</span>
            <span className="experiment-modal__provenance-val">
              {NASA_FLEX_PSI_69_PROVENANCE.flightInvestigation}
            </span>
          </div>
          <div className="experiment-modal__provenance-item">
            <span className="experiment-modal__provenance-label">DOI</span>
            <span className="experiment-modal__provenance-val font-mono">
              {NASA_FLEX_PSI_69_PROVENANCE.doi}
            </span>
          </div>
          <div className="experiment-modal__provenance-item">
            <span className="experiment-modal__provenance-label">Official Source</span>
            <a
              href={NASA_FLEX_PSI_69_PROVENANCE.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-inspector__meta-link"
            >
              NASA PSI-69 Repository ↗
            </a>
          </div>
        </div>

        {/* Duplicate Identifier Notice if applicable */}
        {isDuplicateId && (
          <div className="experiment-modal__alert" role="status">
            <span className="experiment-modal__alert-icon">⚠️</span>
            <div>
              <strong>Duplicate FLEX Identifier Detected:</strong> Identifier <code>193F001</code> is shared by both Test #70 and Test #73 in NASA&apos;s published table (same date and timestamp 3/23/2010 7:25:43, but distinct droplet measurements). Both records are strictly preserved without deletion.
            </div>
          </div>
        )}

        {/* All 15 Fields Table */}
        <div className="experiment-modal__table-wrapper">
          <table className="experiment-modal__table">
            <thead>
              <tr>
                <th scope="col" style={{ width: '4%' }}>#</th>
                <th scope="col" style={{ width: '28%' }}>NASA Column Name (Original Header)</th>
                <th scope="col" style={{ width: '16%' }}>Raw Cell Value</th>
                <th scope="col" style={{ width: '22%' }}>Parsed / Interpreted Value</th>
                <th scope="col" style={{ width: '30%' }}>Scientific &amp; Source Notes</th>
              </tr>
            </thead>
            <tbody>
              {fieldRows.map((row) => (
                <tr
                  key={row.num}
                  className={
                    row.isMissing
                      ? 'experiment-modal__row--missing'
                      : row.isZero
                      ? 'experiment-modal__row--zero'
                      : row.isApprox
                      ? 'experiment-modal__row--approx'
                      : ''
                  }
                >
                  <td className="font-mono text-subtle">{row.num}</td>
                  <td className="font-mono font-bold text-bright">{row.header}</td>
                  <td className="font-mono">
                    {row.raw === '' ? (
                      <span className="text-muted italic">[empty cell]</span>
                    ) : row.raw === '–' || row.raw === '-' ? (
                      <span className="text-muted font-bold">&ldquo;–&rdquo; (dash)</span>
                    ) : (
                      <code className="raw-cell-code">{row.raw}</code>
                    )}
                  </td>
                  <td>
                    {row.isMissing ? (
                      <span className="badge-not-reported">Not reported</span>
                    ) : row.isZero ? (
                      <span className="badge-genuine-zero">{row.parsed} (Genuine 0)</span>
                    ) : row.isApprox ? (
                      <span className="badge-approx">{row.parsed} (approx)</span>
                    ) : (
                      <span className="font-mono font-bold text-accent">{row.parsed}</span>
                    )}
                  </td>
                  <td className="experiment-modal__note-cell">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="experiment-modal__footer">
          <div className="experiment-modal__footer-info text-muted">
            Raw NASA experimental table row index: <code>{record.fileRowIndex}</code>.
            Missing values are preserved strictly as <code>null</code>.
          </div>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onClose}
          >
            Close Record View
          </button>
        </div>
      </div>
    </dialog>
  );
};
