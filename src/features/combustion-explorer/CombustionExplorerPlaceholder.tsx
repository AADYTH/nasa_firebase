import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const CombustionExplorerPlaceholder: React.FC = () => {
  return (
    <Card
      title="3D Microgravity Combustion Explorer"
      subtitle="Interactive 3D simulation of spherical flame geometry & soot shells"
      badge={<Badge variant="accent">Three.js Ready</Badge>}
    >
      <div className="feature-placeholder">
        <div className="feature-placeholder__visual">
          <svg viewBox="0 0 120 120" className="feature-placeholder__illustration">
            <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
            <circle cx="60" cy="60" r="34" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.6" />
            <circle cx="60" cy="60" r="18" fill="#38bdf8" opacity="0.75" />
            <circle cx="60" cy="60" r="6" fill="#ffffff" />
          </svg>
        </div>
        <p className="feature-placeholder__desc">
          Foundation ready for Three.js WebGL canvas. Awaiting 3D rendering setup for spherical microgravity flame envelopes and droplet combustion simulations.
        </p>
      </div>
    </Card>
  );
};
