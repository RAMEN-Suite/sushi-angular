import { booleanAttribute, Directive, input, InputSignal, InputSignalWithTransform } from '@angular/core';
import { FormControlSeverity, FormControlSize } from '../form-control';

@Directive({
  selector: 'div[suiInputSurface]',
  host: {
    class: 'input sui-input-surface',
    '[class.input-primary]': 'severity() === "primary"',
    '[class.input-secondary]': 'severity() === "secondary"',
    '[class.input-accent]': 'severity() === "accent"',
    '[class.input-neutral]': 'severity() === "neutral"',
    '[class.input-info]': 'severity() === "info"',
    '[class.input-success]': 'severity() === "success"',
    '[class.input-warning]': 'severity() === "warning"',
    '[class.input-error]': 'severity() === "error" || invalid()',
    '[class.input-xs]': 'size() === "xs"',
    '[class.input-sm]': 'size() === "sm"',
    '[class.input-md]': 'size() === "md"',
    '[class.input-lg]': 'size() === "lg"',
    '[class.input-xl]': 'size() === "xl"',
    '[class.w-full]': 'fluid()',
  },
})
/** Creates one input surface for a native control and inline prefixes or suffixes. */
export class InputSurface {
  /** Applies a semantic border color. */
  public readonly severity: InputSignal<FormControlSeverity | null> = input<FormControlSeverity | null>(null);
  /** Sets the surface dimensions. */
  public readonly size: InputSignal<FormControlSize> = input<FormControlSize>('md');
  /** Expands the surface to the available width. */
  public readonly fluid: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Applies the invalid appearance to the complete field surface. */
  public readonly invalid: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
}
