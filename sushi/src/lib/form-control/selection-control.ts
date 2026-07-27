import { Directive, input, InputSignal } from '@angular/core';
import { FormControlState } from './form-control-state';
import { FormControlSeverity, FormControlSize } from './form-control.interfaces';

@Directive()
export abstract class SelectionControl extends FormControlState {
  public readonly severity: InputSignal<FormControlSeverity | null> = input<FormControlSeverity | null>(null);
  public readonly size: InputSignal<FormControlSize> = input<FormControlSize>('md');
}
