import React from 'react';
import { PROJECT_METADATA } from '../../constants/project';
import { StatusIndicator } from '../common/StatusIndicator';
import { NAVIGATION_ITEMS, type DashboardTab } from '../../types/navigation';

export interface HeaderProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  recordCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  recordCount = 274,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % NAVIGATION_ITEMS.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + NAVIGATION_ITEMS.length) % NAVIGATION_ITEMS.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = NAVIGATION_ITEMS.length - 1;
    }

    if (nextIndex >= 0) {
      onSelectTab(NAVIGATION_ITEMS[nextIndex].id);
      const nextBtn = document.getElementById(`nav-tab-${NAVIGATION_ITEMS[nextIndex].id}`);
      nextBtn?.focus();
    }
  };

  return (
    <header className="app-header">
      {/* Top Branding Row */}
      <div className="app-header__top">
        <div className="app-header__branding">
          <div className="app-header__logo-mark" aria-hidden="true">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="app-header__icon"
            >
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
              <circle cx="16" cy="16" r="9" fill="url(#core-glow)" opacity="0.85" />
              <circle cx="16" cy="16" r="4.5" fill="#ffffff" />
              <defs>
                <radialGradient id="core-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(16 16) rotate(90) scale(9)">
                  <stop stopColor="#38bdf8" />
                  <stop offset="0.6" stopColor="#f97316" />
                  <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          <div>
            <div className="app-header__title-row">
              <h1 className="app-header__title">{PROJECT_METADATA.name}</h1>
              <span className="app-header__tagline">{PROJECT_METADATA.tagline}</span>
            </div>
            <p className="app-header__subtitle">
              {PROJECT_METADATA.event} • ISS CIR Investigation PSI-69
            </p>
          </div>
        </div>

        <div className="app-header__status">
          <div className="app-header__dataset-pill font-mono">
            <span className="pill-dot pill-dot--cyan" />
            <span>NASA PSI-69 FLEX: <strong>{recordCount} Trials</strong> Ingested</span>
          </div>
          <StatusIndicator label="Validated" status="ready" />
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="app-header__nav" aria-label="Main scientific dashboard navigation">
        <div className="app-header__tabs" role="tablist" aria-label="Dashboard sections">
          {NAVIGATION_ITEMS.map((item, index) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${item.id}`}
                tabIndex={isActive ? 0 : -1}
                className={`app-header__tab-btn ${isActive ? 'app-header__tab-btn--active' : ''}`}
                onClick={() => onSelectTab(item.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                <span className="app-header__tab-icon" aria-hidden="true">{item.icon}</span>
                <span className="app-header__tab-label">{item.label}</span>
                {item.badge && (
                  <span
                    className={`app-header__tab-badge font-mono ${
                      isActive ? 'app-header__tab-badge--active' : ''
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <div className="app-header__tab-indicator" layout-id="active-indicator" />}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
