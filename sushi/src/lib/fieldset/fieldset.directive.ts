import { booleanAttribute, Directive, input, InputSignalWithTransform, model, ModelSignal } from '@angular/core';

@Directive({
  selector: 'fieldset[suiFieldset]',
  host: {
    class: 'fieldset sui-fieldset',
    '[class.sui-fieldset--collapsible]': 'collapsible()',
    '[class.sui-fieldset--collapsed]': 'collapsible() && !expanded()',
  },
})
/** Styles a native fieldset and optionally controls collapsible content. */
export class Fieldset {
  /** Controls and reports whether collapsible content is visible. */
  public readonly expanded: ModelSignal<boolean> = model<boolean>(true);
  /** Enables toggling of the fieldset content. */
  public readonly collapsible: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  /** Toggles the expanded state when the fieldset is collapsible. */
  public toggle(): void {
    if (!this.collapsible()) return;
    this.expanded.update((expanded: boolean): boolean => !expanded);
  }
}
