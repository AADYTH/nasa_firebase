import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const AIAssistantPlaceholder: React.FC = () => {
  return (
    <Card
      title="Evidence-Grounded AI Research Assistant"
      subtitle="Scientific queries strictly grounded in NASA documentation & PSI records"
      badge={<Badge variant="neutral">Architecture Ready</Badge>}
    >
      <div className="feature-placeholder">
        <p className="feature-placeholder__desc">
          AI assistant interface interface architecture prepared. Designed for strictly cited answers from official NASA microgravity combustion papers and flight experiment archives. No API keys or mock hallucinated responses are embedded.
        </p>
      </div>
    </Card>
  );
};
