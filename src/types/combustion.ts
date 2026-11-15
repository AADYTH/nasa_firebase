/**
 * Microgravity Combustion Science and 3D Visualization Types
 * Formulated for spherical flame propagation, extinction limits, and soot formation under near-zero buoyancy.
 */

export type FlameRegime =
  | 'SPHERICAL_DIFFUSION'
  | 'COOL_FLAME'
  | 'PREMIXED_GAS'
  | 'SOLID_SURFACE_SPREAD'
  | 'DROPLET_COMBUSTION';

export interface FlameGeometry3D {
  apparentRadiusMm: number;
  standoffDistanceMm?: number;
  sphericityIndex: number; // 1.0 = perfect microgravity sphere
  sootShellRadiusMm?: number;
}

export interface CombustionExperimentState {
  experimentId: string;
  regime: FlameRegime;
  burningRateMmPerSec?: number;
  extinctionDiameterMm?: number;
  geometry: FlameGeometry3D;
  isExtinguished: boolean;
}
