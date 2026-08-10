import { booleanAttribute, Directive, input, InputSignalWithTransform } from '@angular/core';

@Directive()
export abstract class FormControlState {
  /** Marks the control value as invalid. The invalid style appears after touch or modification. */
  public readonly invalid: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  /** Indicates that the user has left or completed an interaction with the control. */
  public readonly touched: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  /** Indicates that the control value has changed from its initial value. */
  public readonly dirty: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  protected isInvalid(): boolean {
    return this.invalid() && (this.touched() || this.dirty());
  }
}
