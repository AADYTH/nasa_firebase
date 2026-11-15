import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { FlexDatasetInspector } from './FlexDatasetInspector';

export const DatasetManagerPlaceholder: React.FC = () => {
  return (
    <Card
      title="NASA Dataset Ingestion & Validation"
      subtitle="PSI-69 FLEX microgravity droplet combustion experiment table"
      badge={<Badge variant="success">FLEX Dataset Ingested</Badge>}
      className="dataset-inspector-card"
    >
      <FlexDatasetInspector />
    </Card>
  );
};

