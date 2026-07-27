import { booleanAttribute, Directive, input, InputSignalWithTransform } from '@angular/core';

@Directive()
export abstract class FormControlState {
  public readonly invalid: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly touched: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly dirty: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });

  protected isInvalid(): boolean {
    return this.invalid() && (this.touched() || this.dirty());
  }
}
