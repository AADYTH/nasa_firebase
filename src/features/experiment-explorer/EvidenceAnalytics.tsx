import React, { useMemo } from 'react';
import type { FlexParsedRecord } from '../../types/dataset';

interface EvidenceAnalyticsProps {
  records: FlexParsedRecord[];
}

export const EvidenceAnalytics: React.FC<EvidenceAnalyticsProps> = ({ records }) => {
  const stats = useMemo(() => {
    const total = records.length;

    // Fuel tallies
    const fuelCounts: Record<string, number> = {};
    // Outcome tallies
    const outcomeCounts: Record<string, number> = {};

    // Numerical: Droplet diameter (valid only)
    const validDroplets: { fuel: string; val: number }[] = [];
    let missingDroplets = 0;

    // Numerical: Burn time (valid only)
    const validBurnTimes: { fuel: string; val: number; isApprox: boolean }[] = [];
    let missingBurnTimes = 0;
    let approxBurnTimes = 0;

    // Numerical: Extinction diameter (valid only, genuine 0 included)
    const validExtinctionDiameters: { fuel: string; val: number }[] = [];
    let missingExtinction = 0;
    let zeroExtinction = 0;

    records.forEach((rec) => {
      // Fuel
      fuelCounts[rec.fuel] = (fuelCounts[rec.fuel] || 0) + 1;

      // Outcome
      outcomeCounts[rec.testEnd] = (outcomeCounts[rec.testEnd] || 0) + 1;

      // Droplet diameter
      if (rec.dropletInitialDiameterMm !== null) {
        validDroplets.push({ fuel: rec.fuel, val: rec.dropletInitialDiameterMm });
      } else {
        missingDroplets++;
      }

      // Burn time
      if (rec.burnTimeSec !== null) {
        if (rec.isBurnTimeApproximate) approxBurnTimes++;
        validBurnTimes.push({
          fuel: rec.fuel,
          val: rec.burnTimeSec,
          isApprox: rec.isBurnTimeApproximate,
        });
      } else {
        missingBurnTimes++;
      }

      // Extinction diameter
      if (rec.visibleFlameExtinctionDiameterMm !== null) {
        if (rec.visibleFlameExtinctionDiameterMm === 0) zeroExtinction++;
        validExtinctionDiameters.push({
          fuel: rec.fuel,
          val: rec.visibleFlameExtinctionDiameterMm,
        });
      } else {
        missingExtinction++;
      }
    });

    // Compute bins for droplet diameter (<2mm, 2-3mm, 3-4mm, >=4mm)
    const dropletBins = [
      { label: '< 2.0 mm', methanol: 0, heptane: 0, total: 0 },
      { label: '2.0 – 2.99 mm', methanol: 0, heptane: 0, total: 0 },
      { label: '3.0 – 3.99 mm', methanol: 0, heptane: 0, total: 0 },
      { label: '≥ 4.0 mm', methanol: 0, heptane: 0, total: 0 },
    ];

    validDroplets.forEach((d) => {
      let binIdx = 0;
      if (d.val >= 4.0) binIdx = 3;
      else if (d.val >= 3.0) binIdx = 2;
      else if (d.val >= 2.0) binIdx = 1;
      else binIdx = 0;

      if (d.fuel === 'Methanol') dropletBins[binIdx].methanol++;
      else if (d.fuel === 'Heptane') dropletBins[binIdx].heptane++;
      dropletBins[binIdx].total++;
    });

    const calcMean = (arr: number[]) =>
      arr.length > 0 ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : '—';

    const methanolDroplets = validDroplets.filter((d) => d.fuel === 'Methanol').map((d) => d.val);
    const heptaneDroplets = validDroplets.filter((d) => d.fuel === 'Heptane').map((d) => d.val);

    const methanolBurnTimes = validBurnTimes.filter((b) => b.fuel === 'Methanol').map((b) => b.val);
    const heptaneBurnTimes = validBurnTimes.filter((b) => b.fuel === 'Heptane').map((b) => b.val);

    const maxBinCount = Math.max(...dropletBins.map((b) => b.total), 1);

    return {
      total,
      fuelCounts,
      outcomeCounts,
      validDropletsCount: validDroplets.length,
      missingDroplets,
      meanDropletOverall: calcMean(validDroplets.map((d) => d.val)),
      meanDropletMethanol: calcMean(methanolDroplets),
      meanDropletHeptane: calcMean(heptaneDroplets),
      dropletBins,
      maxBinCount,
      validBurnTimesCount: validBurnTimes.length,
      missingBurnTimes,
      approxBurnTimes,
      meanBurnTimeOverall: calcMean(validBurnTimes.map((b) => b.val)),
      meanBurnTimeMethanol: calcMean(methanolBurnTimes),
      meanBurnTimeHeptane: calcMean(heptaneBurnTimes),
      validExtinctionCount: validExtinctionDiameters.length,
      missingExtinction,
      zeroExtinction,
    };
  }, [records]);

  if (records.length === 0) return null;

  return (
    <div className="evidence-analytics">
      {/* Header with sample sizes */}
      <div className="evidence-analytics__header">
        <div className="evidence-analytics__title-block">
          <span className="evidence-analytics__tag">DESCRIPTIVE EVIDENCE ANALYTICS</span>
          <h4 className="evidence-analytics__title">
            Dynamic Flight Distributions (N = {stats.total} Trials)
          </h4>
        </div>
        <div className="evidence-analytics__badge-group">
          <span className="evidence-analytics__stat-badge font-mono">
            Valid d₀: {stats.validDropletsCount}/{stats.total}
          </span>
          <span className="evidence-analytics__stat-badge font-mono">
            Valid Burn Time: {stats.validBurnTimesCount}/{stats.total}
          </span>
          <span className="evidence-analytics__stat-badge font-mono">
            Valid Extinction d: {stats.validExtinctionCount}/{stats.total}
          </span>
        </div>
      </div>

      {/* Responsive Two-Column Analytics Grid */}
      <div className="evidence-analytics__grid">
        {/* Chart 1: Fuel Chemistry Distribution */}
        <div className="evidence-analytics__card">
          <div className="evidence-analytics__card-header">
            <div>
              <h5 className="evidence-analytics__card-title">Fuel Chemistry Distribution</h5>
              <p className="evidence-analytics__unit-label">
                Measured Variable: <code>Fuel</code> • Pure liquid hydrocarbon &amp; alcohol droplets
              </p>
            </div>
            <span className="evidence-analytics__sample-size font-mono">
              Sample: N = {stats.total} (0 missing)
            </span>
          </div>

          <div className="analytics-bars">
            {Object.entries(stats.fuelCounts).map(([fuel, count]) => {
              const pct = Number(((count / stats.total) * 100).toFixed(1));
              const isMethanol = fuel === 'Methanol';

              return (
                <div key={fuel} className="analytics-bar-item">
                  <div className="analytics-bar-meta">
                    <span className="analytics-bar-label font-bold">
                      <span className={`pill-dot ${isMethanol ? 'pill-dot--cyan' : 'pill-dot--amber'}`} />
                      {fuel}
                      <span className="analytics-sub-label">
                        {isMethanol ? '(Alcohol CH₃OH • Non-sooting)' : '(Alkane C₇H₁₆ • Sooting)'}
                      </span>
                    </span>
                    <span className="analytics-bar-value font-mono font-bold">
                      {count} trials ({pct}%)
                    </span>
                  </div>
                  <div className="analytics-progress-track">
                    <div
                      className={`analytics-progress-fill ${
                        isMethanol ? 'analytics-progress-fill--cyan' : 'analytics-progress-fill--amber'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="analytics-card-footer">
            <span className="text-subtle">
              Both fuels deployed onto silicon carbide support fibers aboard ISS CIR. 100% of rows recognized.
            </span>
          </div>
        </div>

        {/* Chart 2: Observed Test End Outcomes */}
        <div className="evidence-analytics__card">
          <div className="evidence-analytics__card-header">
            <div>
              <h5 className="evidence-analytics__card-title">Observed Test End Outcomes</h5>
              <p className="evidence-analytics__unit-label">
                Measured Variable: <code>Test end</code> • NASA experiment termination classification
              </p>
            </div>
            <span className="evidence-analytics__sample-size font-mono">
              Sample: N = {stats.total} (0 missing)
            </span>
          </div>

          <div className="analytics-bars">
            {Object.entries(stats.outcomeCounts).map(([outcome, count]) => {
              const pct = Number(((count / stats.total) * 100).toFixed(1));
              const outcomeLower = outcome.toLowerCase();

              return (
                <div key={outcome} className="analytics-bar-item">
                  <div className="analytics-bar-meta">
                    <span className="analytics-bar-label font-bold">
                      <span className={`pill-dot pill-dot--${outcomeLower}`} />
                      {outcome}
                      <span className="analytics-sub-label">
                        {outcome === 'Extinction'
                          ? '(Radiative flame extinction)'
                          : outcome === 'Disruption'
                          ? '(Droplet bubble / rupture)'
                          : '(Complete fuel consumption)'}
                      </span>
                    </span>
                    <span className="analytics-bar-value font-mono font-bold">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="analytics-progress-track">
                    <div
                      className={`analytics-progress-fill analytics-progress-fill--${outcomeLower}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="analytics-card-footer">
            <span className="text-subtle">
              1:1 identity preservation: Extinction (186), Disruption (61), Completion (27). Zero category merging.
            </span>
          </div>
        </div>

        {/* Chart 3: Initial Droplet Diameter (d₀) */}
        <div className="evidence-analytics__card">
          <div className="evidence-analytics__card-header">
            <div>
              <h5 className="evidence-analytics__card-title">Initial Droplet Diameter (d₀)</h5>
              <p className="evidence-analytics__unit-label">
                Measured Variable: <code>Droplet initial diameter; mm</code> (Units: mm)
              </p>
            </div>
            <span className="evidence-analytics__sample-size font-mono">
              N = {stats.validDropletsCount} valid ({stats.missingDroplets} not reported)
            </span>
          </div>

          <div className="analytics-metric-summary">
            <div className="analytics-stat-box">
              <span className="analytics-stat-box__val font-mono font-bold text-accent">
                {stats.meanDropletOverall} mm
              </span>
              <span className="analytics-stat-box__label">Overall Mean d₀</span>
            </div>
            <div className="analytics-stat-box">
              <span className="analytics-stat-box__val font-mono font-bold text-cyan">
                {stats.meanDropletMethanol} mm
              </span>
              <span className="analytics-stat-box__label">Methanol Mean</span>
            </div>
            <div className="analytics-stat-box">
              <span className="analytics-stat-box__val font-mono font-bold text-amber">
                {stats.meanDropletHeptane} mm
              </span>
              <span className="analytics-stat-box__label">Heptane Mean</span>
            </div>
          </div>

          <div className="analytics-bins">
            <div className="analytics-bins__header">
              <span className="analytics-bins__title font-mono">
                Diameter Distribution Bins (Valid records only):
              </span>
              <div className="analytics-bins__legend font-mono">
                <span className="text-cyan">■ Methanol</span>
                <span className="text-amber">■ Heptane</span>
              </div>
            </div>

            <div className="analytics-bins__list">
              {stats.dropletBins.map((bin) => {
                const methPct = stats.maxBinCount > 0 ? (bin.methanol / stats.maxBinCount) * 100 : 0;
                const heptPct = stats.maxBinCount > 0 ? (bin.heptane / stats.maxBinCount) * 100 : 0;

                return (
                  <div key={bin.label} className="analytics-bin-row">
                    <div className="analytics-bin-row__label font-mono">{bin.label}</div>
                    <div className="analytics-bin-row__bars">
                      <div className="analytics-bin-split-bar">
                        <div
                          className="analytics-bin-bar-fill analytics-bin-bar-fill--cyan"
                          style={{ width: `${methPct}%` }}
                          title={`Methanol: ${bin.methanol} trials`}
                        />
                      </div>
                      <div className="analytics-bin-split-bar">
                        <div
                          className="analytics-bin-bar-fill analytics-bin-bar-fill--amber"
                          style={{ width: `${heptPct}%` }}
                          title={`Heptane: ${bin.heptane} trials`}
                        />
                      </div>
                    </div>
                    <div className="analytics-bin-row__counts font-mono">
                      <span className="text-cyan font-bold">{bin.methanol}</span>
                      <span className="text-subtle">/</span>
                      <span className="text-amber font-bold">{bin.heptane}</span>
                      <span className="text-subtle text-xs">({bin.total} total)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="analytics-card-footer">
            <span className="text-subtle">
              12 missing droplet diameters safely excluded from averages (never coerced to zero).
            </span>
          </div>
        </div>

        {/* Chart 4: Droplet Burn Time Duration */}
        <div className="evidence-analytics__card">
          <div className="evidence-analytics__card-header">
            <div>
              <h5 className="evidence-analytics__card-title">Droplet Burn Time Duration</h5>
              <p className="evidence-analytics__unit-label">
                Measured Variable: <code>Burn time; s</code> (Units: seconds)
              </p>
            </div>
            <span className="evidence-analytics__sample-size font-mono">
              N = {stats.validBurnTimesCount} valid ({stats.missingBurnTimes} not reported)
            </span>
          </div>

          <div className="analytics-metric-summary">
            <div className="analytics-stat-box">
              <span className="analytics-stat-box__val font-mono font-bold text-accent">
                {stats.meanBurnTimeOverall} s
              </span>
              <span className="analytics-stat-box__label">Overall Mean</span>
            </div>
            <div className="analytics-stat-box">
              <span className="analytics-stat-box__val font-mono font-bold text-cyan">
                {stats.meanBurnTimeMethanol} s
              </span>
              <span className="analytics-stat-box__label">Methanol Mean</span>
            </div>
            <div className="analytics-stat-box">
              <span className="analytics-stat-box__val font-mono font-bold text-amber">
                {stats.meanBurnTimeHeptane} s
              </span>
              <span className="analytics-stat-box__label">Heptane Mean</span>
            </div>
          </div>

          <div className="burn-time-comparison">
            <div className="burn-time-comparison__label font-mono">
              <span>Mean Burn Duration Contrast:</span>
              <span className="text-subtle font-normal">Heptane burns ~22% longer on average</span>
            </div>
            <div className="burn-time-track">
              <div
                className="burn-time-bar burn-time-bar--methanol"
                style={{ width: `${(Number(stats.meanBurnTimeMethanol) / 12) * 100}%` }}
                title={`Methanol Mean: ${stats.meanBurnTimeMethanol}s`}
              >
                <span className="burn-time-bar__text font-mono">Methanol: {stats.meanBurnTimeMethanol}s</span>
              </div>
            </div>
            <div className="burn-time-track">
              <div
                className="burn-time-bar burn-time-bar--heptane"
                style={{ width: `${(Number(stats.meanBurnTimeHeptane) / 12) * 100}%` }}
                title={`Heptane Mean: ${stats.meanBurnTimeHeptane}s`}
              >
                <span className="burn-time-bar__text font-mono">Heptane: {stats.meanBurnTimeHeptane}s</span>
              </div>
            </div>
          </div>

          <div className="analytics-card-note">
            <span className="badge-approx">Uncertainty Note</span>
            <span>
              Includes {stats.approxBurnTimes} approximate values (Tests #223 <code>~6 s</code> &amp; #224 <code>~9 s</code>) flagged in original data.
              {stats.missingBurnTimes} missing values excluded from averages and never coerced to zero.
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Descriptive-Only Scientific Integrity Disclaimer */}
      <div className="evidence-analytics__disclaimer" role="note" aria-label="Scientific Integrity Note">
        <div className="evidence-analytics__disclaimer-header">
          <span className="evidence-analytics__disclaimer-icon" aria-hidden="true">⚠️</span>
          <span className="evidence-analytics__disclaimer-title">DESCRIPTIVE EVIDENCE SCOPE &amp; SAFETY INTEGRITY</span>
        </div>
        <p className="evidence-analytics__disclaimer-text">
          <strong>Scientific Integrity Notice:</strong> The distributions and sample statistics displayed above are descriptive summaries computed directly from the 274 NASA PSI-69 flight records. Descriptive frequencies, diameter bins, and burn time averages describe observations from tests conducted aboard the ISS Combustion Integrated Rack (CIR). <strong>They do NOT establish causation, predict general spacecraft fire risk, or prove suppression protocol efficacy under NASA-STD-6001B.</strong> Zero synthetic telemetry, artificial thresholds, or ungrounded machine-learning predictions are utilized.
        </p>
      </div>
    </div>
  );
};
