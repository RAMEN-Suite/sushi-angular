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
  /** Chip label, available as the implicit template value. */
  readonly $implicit: string | null;
  /** Chip label. */
  readonly label: string | null;
  /** Whether the chip exposes its remove action. */
  readonly removable: boolean;
  /** Whether removal is currently unavailable. */
  readonly disabled: boolean;
}
