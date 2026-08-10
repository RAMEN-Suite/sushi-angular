import { FormControlSize } from '../form-control';

export interface InputNumberButtonsContext {
  readonly $implicit: number | null;
  readonly value: number | null;
  readonly disabled: boolean;
  readonly size: FormControlSize;
  readonly decrement: () => void;
  readonly increment: () => void;
}
