import { Directive, inject } from '@angular/core';
import { Fieldset } from './fieldset.directive';

@Directive({
  selector: '[suiFieldsetContent]',
  host: {
    class: 'sui-fieldset__content',
    '[attr.aria-hidden]': 'fieldset.collapsible() && !fieldset.expanded() ? "true" : null',
    '[attr.inert]': 'fieldset.collapsible() && !fieldset.expanded() ? "" : null',
  },
})
export class FieldsetContent {
  protected readonly fieldset: Fieldset = inject(Fieldset);
}
