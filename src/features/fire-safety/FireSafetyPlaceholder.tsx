import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const FireSafetyPlaceholder: React.FC = () => {
  return (
    <Card
      title="Spacecraft Fire-Safety Insights"
      subtitle="NASA-STD-6001B standard analysis & suppression regimes"
      badge={<Badge variant="warning">Awaiting Ingestion</Badge>}
    >
      <div className="feature-placeholder">
        <p className="feature-placeholder__desc">
          Structured around NASA standard flammability test methods and atmospheric safety limits (oxygen index, ventilation effects on low-speed flame spread, and vacuum venting dynamics).
        </p>
      </div>
    </Card>
  );
};
