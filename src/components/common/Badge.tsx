import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'accent' | 'warning' | 'success';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral' }) => {
  return <span className={`badge badge--${variant}`}>{children}</span>;
};
