/**
 * Spacecraft Fire Safety and Material Flammability Types
 * Based on NASA-STD-6001B: Flammability, Odor, Offgassing, and Compatibility Requirements
 * and Spacecraft Fire Safety Demonstration Project guidelines.
 */

export type NASAStandardTest =
  | 'TEST_1_UPWARD_FLAME_PROPAGATION'
  | 'TEST_2_HEAT_AND_SMOKE_RELEASE'
  | 'TEST_4_ELECTRICAL_WIRE_INSULATION'
  | 'MICROGRAVITY_BURNING_SUPPRESSION';

export interface SpacecraftAtmosphereLimits {
  maximumOxygenPercentage: number;
  minimumExtinguisherConcentrationPercent: number;
  ventilationAirflowVelocityMPerSec: number;
}

export interface MaterialSafetyInsight {
  materialName: string;
  testedOxygenIndex?: number; // Limiting Oxygen Index (LOI)
  applicableStandard: NASAStandardTest;
  microgravityBehaviorNote: string;
  sourcePsiCitation?: string;
}
