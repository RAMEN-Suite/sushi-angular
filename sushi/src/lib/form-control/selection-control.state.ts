import { Directive, input, InputSignal } from '@angular/core';
import { FormControlState } from './form-control-state';
import { FormControlSeverity, FormControlSize } from './form-control.interfaces';

@Directive()
export abstract class SelectionControlState extends FormControlState {
  /** Applies a semantic color to the control. */
  public readonly severity: InputSignal<FormControlSeverity | null> = input<FormControlSeverity | null>(null);
  /** Sets the control dimensions. */
  public readonly size: InputSignal<FormControlSize> = input<FormControlSize>('md');
}
