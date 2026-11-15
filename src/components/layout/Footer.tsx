import React from 'react';
import { PROJECT_METADATA } from '../../constants/project';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="app-footer__sources">
        <span className="app-footer__label">NASA Open Science Repositories:</span>
        <div className="app-footer__links">
          {PROJECT_METADATA.officialDataSources.map((source) => (
            <a
              key={source.name}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="app-footer__link"
            >
              {source.name}
            </a>
          ))}
        </div>
      </div>
      <p className="app-footer__note">
        Built for the NASA Space Apps Challenge 2026. Designed for verified microgravity combustion scientific data and spacecraft fire safety.
      </p>
    </footer>
  );
};
