import { Directive, input, type InputSignal } from '@angular/core';
import { FormControlState } from './form-control-state';
import { type FormControlSeverity, type FormControlSize } from './form-control.interfaces';

/** Shared severity and size inputs for selection controls. */
@Directive()
export abstract class SelectionControlState extends FormControlState {
  /** Applies a semantic color to the control. */
  public readonly severity: InputSignal<FormControlSeverity | null> = input<FormControlSeverity | null>(null);
  /** Sets the control dimensions. */
  public readonly size: InputSignal<FormControlSize> = input<FormControlSize>('md');
}
