/**
 * Project constants and official NASA Space Apps Challenge metadata.
 */

export const PROJECT_METADATA = {
  name: 'FIRETRACE',
  tagline: 'The Living Combustion Explorer',
  event: 'NASA Space Apps Challenge 2026',
  challengeTitle: 'Living in Space / Microgravity Fire Safety',
  officialPrompt:
    'Develop an AI-powered or data-driven dashboard that examines NASA microgravity combustion experiments and helps extract fire-safety insights.',
  officialDataSources: [
    {
      name: 'NASA Physical Sciences Informatics (PSI)',
      url: 'https://psi.nasa.gov/',
      description:
        'Repository for data from physical science experiments performed on the International Space Station and other microgravity research platforms.',
    },
    {
      name: 'NASA Open Science Data Repository (OSDR)',
      url: 'https://osdr.nasa.gov/',
      description:
        'NASA repository for spaceflight and analog biological and physical scientific datasets.',
    },
    {
      name: 'NASA Technical Reports Server (NTRS)',
      url: 'https://ntrs.nasa.gov/',
      description:
        'Access to NASA scientific and technical information including microgravity combustion publications.',
    },
  ],
  modules: [
    {
      id: 'combustion-explorer',
      title: '3D Combustion Explorer',
      description:
        'Interactive 3D microgravity flame geometry, spherical flame propagation, and extinction limits.',
      status: 'Foundation Ready (Three.js planned)',
    },
    {
      id: 'analytics',
      title: 'Experiment Telemetry & Analytics',
      description:
        'Multi-channel sensor time-series (temperature, radiant flux, chamber pressure, O2 level).',
      status: 'Foundation Ready (Charts planned)',
    },
    {
      id: 'datasets',
      title: 'NASA Dataset Ingestion & Validation',
      description:
        'Structured parsers for NASA PSI combustion experiments (CIR, BASS, FLEX, ACME, SoFIE).',
      status: 'Foundation Ready (Schema validated)',
    },
    {
      id: 'fire-safety',
      title: 'Spacecraft Fire-Safety Insights',
      description:
        'Exploration of NASA-STD-6001B standards, material flammability in microgravity, and suppression protocols.',
      status: 'Foundation Ready',
    },
    {
      id: 'ai-assistant',
      title: 'Evidence-Grounded AI Research Assistant',
      description:
        'Natural language queries backed by citations from verified NASA technical publications and PSI data.',
      status: 'Foundation Ready',
    },
  ],
} as const;
