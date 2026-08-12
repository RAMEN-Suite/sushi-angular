import { ComponentSize } from '../sushi.types';
import { BadgeSeverity, BadgeVariant } from '../badge/badge.interfaces';

export type ChipSize = ComponentSize;
export type ChipSeverity = BadgeSeverity;
export type ChipVariant = BadgeVariant;

export interface ChipContentContext {
  readonly $implicit: string | null;
  readonly label: string | null;
  readonly removable: boolean;
  readonly disabled: boolean;
}
