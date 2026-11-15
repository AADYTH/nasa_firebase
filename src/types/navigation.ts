export type DashboardTab = 'overview' | 'explorer' | 'lab3d' | 'evidence';

export interface NavItem {
  id: DashboardTab;
  label: string;
  icon: string;
  badge?: string;
  description?: string;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: '📊',
    description: 'Executive scientific summary and descriptive flight distributions',
  },
  {
    id: 'explorer',
    label: 'Experiment Explorer',
    icon: '🔬',
    badge: '274',
    description: 'Interactive table workspace with filters, pagination, and raw NASA fields',
  },
  {
    id: 'lab3d',
    label: '3D Combustion Lab',
    icon: '🪐',
    badge: 'Preview',
    description: 'ISS CIR chamber physics, spherical flame geometry, and d²-law parameters',
  },
  {
    id: 'evidence',
    label: 'Evidence & Data Quality',
    icon: '🛡️',
    badge: 'Audit',
    description: 'Comprehensive provenance, schema validation, and discrepancy audit',
  },
];
