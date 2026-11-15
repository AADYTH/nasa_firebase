import React from 'react';

export interface StatusIndicatorProps {
  label: string;
  status?: 'active' | 'pending' | 'ready';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  label,
  status = 'ready',
}) => {
  return (
    <div className={`status-indicator status-indicator--${status}`}>
      <span className="status-indicator__dot" />
      <span className="status-indicator__label">{label}</span>
    </div>
  );
};
