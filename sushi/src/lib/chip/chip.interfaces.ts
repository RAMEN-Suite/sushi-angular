import { ComponentSize } from '../sushi.types';
import { BadgeSeverity, BadgeVariant } from '../badge';

/** Size scale available to chips. */
export type ChipSize = ComponentSize;
/** Semantic colors available to chips. */
export type ChipSeverity = BadgeSeverity;
/** Visual treatments available to chips. */
export type ChipVariant = BadgeVariant;

/** Context exposed to a chip content template. */
export interface ChipContentContext {
  readonly $implicit: string | null;
  readonly label: string | null;
  readonly removable: boolean;
  readonly disabled: boolean;
}
