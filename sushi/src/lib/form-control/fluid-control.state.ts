import { booleanAttribute, Directive, input, InputSignalWithTransform } from '@angular/core';
import { SelectionControlState } from './selection-control.state';

@Directive()
export abstract class FluidControlState extends SelectionControlState {
  /** Expands the control to the available width. */
  public readonly fluid: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
}
