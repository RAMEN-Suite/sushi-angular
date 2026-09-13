import { FormControlSize } from '../form-control';

/** Context exposed to the complete input-number step-control template. */
export interface InputNumberButtonsContext {
  /** Current numeric value, available as the implicit template value. */
  readonly $implicit: number | null;
  /** Current numeric value. */
  readonly value: number | null;
  /** Whether the input and step controls are disabled. */
  readonly disabled: boolean;
  /** Configured form-control size. */
  readonly size: FormControlSize;
  /** Decreases the value by one configured step. */
  readonly decrement: () => void;
  /** Increases the value by one configured step. */
  readonly increment: () => void;
}
