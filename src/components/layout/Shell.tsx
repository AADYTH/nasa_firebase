import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import type { DashboardTab } from '../../types/navigation';

export interface ShellProps {
  children: React.ReactNode;
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  recordCount?: number;
}

export const Shell: React.FC<ShellProps> = ({
  children,
  activeTab,
  onSelectTab,
  recordCount,
}) => {
  return (
    <div className="app-shell">
      <Header
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        recordCount={recordCount}
      />
      <main className="app-shell__content" role="main">
        {children}
      </main>
      <Footer />
    </div>
  );
};
