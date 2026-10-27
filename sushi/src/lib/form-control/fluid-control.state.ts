import { booleanAttribute, Directive, input, type InputSignalWithTransform } from '@angular/core';
import { SelectionControlState } from './selection-control.state';

/** Shared full-width option for controls with severity and size inputs. */
@Directive()
export abstract class FluidControlState extends SelectionControlState {
  /** Expands the control to the available width. */
  public readonly fluid: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
}
