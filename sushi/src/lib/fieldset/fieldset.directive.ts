import { booleanAttribute, Directive, input, InputSignalWithTransform, model, ModelSignal } from '@angular/core';

@Directive({
  selector: 'fieldset[suiFieldset]',
  host: {
    class: 'fieldset sui-fieldset',
    '[class.sui-fieldset--collapsible]': 'collapsible()',
    '[class.sui-fieldset--collapsed]': 'collapsible() && !expanded()',
  },
})
export class Fieldset {
  public readonly expanded: ModelSignal<boolean> = model<boolean>(true);
  public readonly collapsible: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });

  public toggle(): void {
    if (!this.collapsible()) return;
    this.expanded.update((expanded: boolean): boolean => !expanded);
  }
}
