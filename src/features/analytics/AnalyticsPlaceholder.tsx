import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const AnalyticsPlaceholder: React.FC = () => {
  return (
    <Card
      title="Experiment Telemetry & Sensor Analytics"
      subtitle="Multi-channel time-series for chamber pressure, temperature & radiant heat flux"
      badge={<Badge variant="neutral">Charts Ready</Badge>}
    >
      <div className="feature-placeholder">
        <div className="feature-placeholder__visual">
          <svg viewBox="0 0 160 80" className="feature-placeholder__chart-skeleton">
            <line x1="10" y1="70" x2="150" y2="70" stroke="currentColor" opacity="0.3" strokeWidth="1" />
            <line x1="10" y1="10" x2="10" y2="70" stroke="currentColor" opacity="0.3" strokeWidth="1" />
            <path
              d="M10,60 Q40,20 80,45 T150,15"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="4 2"
              opacity="0.8"
            />
          </svg>
        </div>
        <p className="feature-placeholder__desc">
          Telemetry plotting engine architecture configured. Ready for integration with high-performance charting libraries once experiment datasets are connected.
        </p>
      </div>
    </Card>
  );
};
