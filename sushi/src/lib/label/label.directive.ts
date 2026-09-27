import { booleanAttribute, Directive, input, InputSignalWithTransform } from '@angular/core';

@Directive({
  selector: '[suiLabel]',
  host: {
    class: 'sui-label min-w-0 whitespace-normal',
    '[class.label]': '!floating()',
    '[class.floating-label]': 'floating()',
  },
})
/** Styles a visible control label with wrapping text without prescribing its native or ARIA association. */
export class Label {
  /** Floats a native label above its wrapped control on focus or when a value is present. */
  public readonly floating: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
}
