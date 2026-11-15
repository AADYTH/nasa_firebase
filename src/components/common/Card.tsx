import React from 'react';

export interface CardProps {
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  badge,
  children,
  className = '',
}) => {
  return (
    <div className={`card ${className}`}>
      {(title || subtitle || badge) && (
        <div className="card__header">
          <div className="card__headings">
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
          {badge && <div className="card__badge">{badge}</div>}
        </div>
      )}
      <div className="card__body">{children}</div>
    </div>
  );
};
