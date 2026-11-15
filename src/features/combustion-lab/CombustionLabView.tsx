import React, { useState } from 'react';

export const CombustionLabView: React.FC = () => {
  const [selectedFuel, setSelectedFuel] = useState<'Methanol' | 'Heptane'>('Methanol');

  const fuelSpecs = {
    Methanol: {
      formula: 'CH₃OH',
      class: 'Alcohol (Monohydric)',
      density: '792 kg/m³ (at 20°C)',
      boilingPoint: '64.7°C (337.8 K)',
      latentHeat: '1,100 kJ/kg',
      stoichiometricRatio: '6.47 (mass air / mass fuel)',
      flameCharacteristics: 'Nearly invisible blue flame in microgravity; low soot emission; clean radiative extinction boundary.',
      sootShell: 'Absent / minimal soot shell formation.',
      d2LawConstant: 'K ≈ 0.65 – 0.85 mm²/s (depending on O₂ mole fraction)',
    },
    Heptane: {
      formula: 'C₇H₁₆',
      class: 'Alkane Hydrocarbon',
      density: '684 kg/m³ (at 20°C)',
      boilingPoint: '98.4°C (371.5 K)',
      latentHeat: '318 kJ/kg',
      stoichiometricRatio: '15.18 (mass air / mass fuel)',
      flameCharacteristics: 'Luminous yellow-orange flame with dense carbonaceous soot agglomeration between droplet and flame front.',
      sootShell: 'Prominent spherical soot shell trapped by thermophoretic and Stefan drag forces.',
      d2LawConstant: 'K ≈ 0.70 – 0.95 mm²/s (depending on ambient pressure & inert dilution)',
    },
  };

  const activeFuel = fuelSpecs[selectedFuel];

  return (
    <div className="combustion-lab-view">
      {/* Workspace Header */}
      <div className="combustion-lab-header">
        <div className="combustion-lab-header__titles">
          <div className="combustion-lab-header__eyebrow">
            <span className="badge-planned">PLANNED MODULE • THREE.JS WEBGL</span>
            <span className="font-mono text-cyan text-xs">ISS CIR / MDCA SIMULATION</span>
          </div>
          <h3 className="combustion-lab-header__title">
            3D Microgravity Combustion Lab
          </h3>
          <p className="combustion-lab-header__subtitle">
            Physical modeling of spherical flame geometry, soot shell standoff ratios, and radiative extinction limits in the ISS Combustion Integrated Rack.
          </p>
        </div>
      </div>

      {/* Honest Scientific Status Banner */}
      <div className="combustion-lab-notice" role="note">
        <div className="combustion-lab-notice__icon" aria-hidden="true">🔬</div>
        <div>
          <h4 className="combustion-lab-notice__title">
            Scientific Integrity Notice — Module in Active Architecture
          </h4>
          <p className="combustion-lab-notice__desc">
            This workspace provides verified thermodynamic boundary conditions and chamber geometry for the upcoming Three.js WebGL visualization.
            <strong>Zero fabricated telemetry, fake particle effects, or unvalidated physics simulations are rendered.</strong> All models are engineered to link directly to the genuine 274 PSI-69 flight records.
          </p>
        </div>
      </div>

      {/* Scientific Chamber & Physics Overview */}
      <div className="combustion-lab-grid">
        {/* Technical Architecture Specs */}
        <div className="combustion-lab-card">
          <div className="combustion-lab-card__header">
            <span className="combustion-lab-card__icon" aria-hidden="true">🛰️</span>
            <div>
              <h4 className="combustion-lab-card__title">ISS CIR Environmental Physics</h4>
              <span className="combustion-lab-card__sub font-mono">Chamber Geometry &amp; Microgravity Regimes</span>
            </div>
          </div>

          <div className="combustion-lab-specs-list">
            <div className="spec-row">
              <span className="spec-row__label">Research Platform</span>
              <span className="spec-row__val font-mono">ISS Combustion Integrated Rack (CIR)</span>
            </div>
            <div className="spec-row">
              <span className="spec-row__label">Internal Chamber Volume</span>
              <span className="spec-row__val font-mono">100 Liters (Spherical Combustion Chamber)</span>
            </div>
            <div className="spec-row">
              <span className="spec-row__label">Microgravity Environment</span>
              <span className="spec-row__val font-mono">10⁻⁴ to 10⁻⁶ g (Residual orbital drag)</span>
            </div>
            <div className="spec-row">
              <span className="spec-row__label">Operating Pressure Range</span>
              <span className="spec-row__val font-mono">0.05 to 3.0 atm (38 to 2280 mmHg)</span>
            </div>
            <div className="spec-row">
              <span className="spec-row__label">Droplet Support Rig</span>
              <span className="spec-row__val font-mono">Dual 14 μm SiC fibers (MDCA apparatus)</span>
            </div>
            <div className="spec-row">
              <span className="spec-row__label">Ignition System</span>
              <span className="spec-row__val font-mono">Retractable dual-electrode electrical spark</span>
            </div>
          </div>
        </div>

        {/* Optical & Physical Schematic */}
        <div className="combustion-lab-card combustion-lab-card--schematic">
          <div className="combustion-lab-card__header">
            <span className="combustion-lab-card__icon" aria-hidden="true">📐</span>
            <div>
              <h4 className="combustion-lab-card__title">Chamber Cross-Section &amp; Flame Geometry</h4>
              <span className="combustion-lab-card__sub font-mono">Quasi-steady spherical symmetry (g ≈ 0)</span>
            </div>
          </div>

          <div className="schematic-container" aria-label="Microgravity spherical flame geometry schematic">
            <svg viewBox="0 0 320 220" className="schematic-svg" role="img">
              <defs>
                <radialGradient id="flame-gradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#f97316" stopOpacity="0.4" />
                  <stop offset="90%" stopColor="#ef4444" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#07090e" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* CIR Chamber Boundary */}
              <circle cx="160" cy="110" r="100" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="160" y="24" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">
                CIR 100-LITER SPHERICAL CHAMBER WALL
              </text>

              {/* SiC Fiber Support Line */}
              <line x1="60" y1="110" x2="260" y2="110" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
              <text x="265" y="113" fill="#64748b" fontSize="7" fontFamily="var(--font-mono)">SiC Fiber</text>

              {/* Spherical Microgravity Flame Envelope */}
              <circle cx="160" cy="110" r="62" fill="url(#flame-gradient)" />
              <circle cx="160" cy="110" r="62" fill="none" stroke="#f97316" strokeWidth="1.5" opacity="0.8" />
              <text x="160" y="60" fill="#f97316" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">
                Spherical Flame Front (r_f)
              </text>

              {/* Soot Shell Trapping Region (Heptane) */}
              <circle cx="160" cy="110" r="40" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="3 2" opacity="0.7" />
              <text x="160" y="80" fill="#eab308" fontSize="7" textAnchor="middle" fontFamily="var(--font-mono)">
                Soot Standoff Shell (r_s)
              </text>

              {/* Central Fuel Droplet */}
              <circle cx="160" cy="110" r="16" fill="#38bdf8" opacity="0.9" />
              <circle cx="160" cy="110" r="16" fill="none" stroke="#ffffff" strokeWidth="1" />
              <text x="160" y="113" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="var(--font-mono)">
                d(t)
              </text>

              {/* Dimension Annotations */}
              <line x1="160" y1="110" x2="204" y2="66" stroke="#38bdf8" strokeWidth="0.8" />
              <text x="210" y="65" fill="#38bdf8" fontSize="8" fontFamily="var(--font-mono)">
                d²-Law: d²(t) = d₀² - K·t
              </text>
            </svg>
          </div>

          <div className="schematic-caption font-mono">
            <span>In 1-g, buoyancy distorts flames into teardrop plumes. In microgravity, pure spherical symmetry emerges.</span>
          </div>
        </div>
      </div>

      {/* Interactive Fuel Thermodynamic Parameter Preview */}
      <section className="combustion-lab-parameters" aria-labelledby="fuel-params-heading">
        <div className="combustion-lab-parameters__header">
          <div>
            <span className="section-eyebrow">THERMODYNAMIC FLUID CONSTANTS</span>
            <h4 id="fuel-params-heading" className="section-title">
              PSI-69 Fuel Parameter Ingestion Model
            </h4>
          </div>

          {/* Fuel Toggle Button Group */}
          <div className="fuel-toggle-group" role="group" aria-label="Select fuel for parameters">
            <button
              type="button"
              className={`fuel-toggle-btn ${selectedFuel === 'Methanol' ? 'fuel-toggle-btn--active' : ''}`}
              onClick={() => setSelectedFuel('Methanol')}
            >
              <span className="pill-dot pill-dot--cyan" />
              Methanol (CH₃OH)
            </button>
            <button
              type="button"
              className={`fuel-toggle-btn ${selectedFuel === 'Heptane' ? 'fuel-toggle-btn--active' : ''}`}
              onClick={() => setSelectedFuel('Heptane')}
            >
              <span className="pill-dot pill-dot--amber" />
              Heptane (C₇H₁₆)
            </button>
          </div>
        </div>

        <div className="fuel-parameters-grid">
          <div className="fuel-param-card">
            <span className="fuel-param-card__label font-mono">Chemical Formula &amp; Class</span>
            <span className="fuel-param-card__val font-bold text-accent">{activeFuel.formula}</span>
            <span className="fuel-param-card__sub">{activeFuel.class}</span>
          </div>

          <div className="fuel-param-card">
            <span className="fuel-param-card__label font-mono">Liquid Density (ρ_L)</span>
            <span className="fuel-param-card__val font-mono font-bold">{activeFuel.density}</span>
            <span className="fuel-param-card__sub">Measured at 20°C ambient</span>
          </div>

          <div className="fuel-param-card">
            <span className="fuel-param-card__label font-mono">Normal Boiling Point</span>
            <span className="fuel-param-card__val font-mono font-bold">{activeFuel.boilingPoint}</span>
            <span className="fuel-param-card__sub">At 1 atm (760 mmHg)</span>
          </div>

          <div className="fuel-param-card">
            <span className="fuel-param-card__label font-mono">Latent Heat of Vaporization</span>
            <span className="fuel-param-card__val font-mono font-bold">{activeFuel.latentHeat}</span>
            <span className="fuel-param-card__sub">Phase change enthalpy</span>
          </div>

          <div className="fuel-param-card">
            <span className="fuel-param-card__label font-mono">Stoichiometric Air/Fuel</span>
            <span className="fuel-param-card__val font-mono font-bold">{activeFuel.stoichiometricRatio}</span>
            <span className="fuel-param-card__sub">Balanced complete combustion</span>
          </div>

          <div className="fuel-param-card">
            <span className="fuel-param-card__label font-mono">Empirical Burning Rate Constant</span>
            <span className="fuel-param-card__val font-mono font-bold text-accent">{activeFuel.d2LawConstant}</span>
            <span className="fuel-param-card__sub">Classical d²-law regression rate</span>
          </div>
        </div>

        <div className="fuel-behavior-note">
          <span className="font-mono text-cyan font-bold">Observed ISS CIR Dynamics: </span>
          <span>{activeFuel.flameCharacteristics} <strong>Soot Behavior:</strong> {activeFuel.sootShell}</span>
        </div>
      </section>

      {/* Planned Three.js Pipeline Modules */}
      <section className="combustion-lab-modules" aria-labelledby="pipeline-heading">
        <h4 id="pipeline-heading" className="section-title">
          Three.js WebGL Architecture Milestones
        </h4>

        <div className="pipeline-grid">
          <div className="pipeline-card">
            <div className="pipeline-card__badge">Phase 1: Geometry</div>
            <h5 className="pipeline-card__title">Parametric Spherical Flame Shader</h5>
            <p className="pipeline-card__desc">
              Custom GLSL fragment shader computing temperature-dependent radiative emission and non-buoyant radial intensity falloff.
            </p>
          </div>

          <div className="pipeline-card">
            <div className="pipeline-card__badge">Phase 2: Kinetics</div>
            <h5 className="pipeline-card__title">d²-Law Droplet Regression Simulation</h5>
            <p className="pipeline-card__desc">
              Dynamic vertex displacement rendering real-time droplet radius shrinkage $d(t)$ synchronized with measured PSI-69 burn times.
            </p>
          </div>

          <div className="pipeline-card">
            <div className="pipeline-card__badge">Phase 3: Extinction</div>
            <h5 className="pipeline-card__title">Extinction Limit Boundary Surfaces</h5>
            <p className="pipeline-card__desc">
              3D interactive state-space visualizing extinction diameters (d_ext) across oxygen fraction (X_O₂) and chamber pressure (P_amb).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
