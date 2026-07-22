import { Directive } from '@angular/core';

@Directive({
  selector: 'fieldset[suiFieldset]',
  standalone: true,
  host: { class: 'fieldset sui-fieldset' },
})
export class Fieldset {}

@Directive({
  selector: 'legend[suiFieldsetLegend]',
  standalone: true,
  host: { class: 'fieldset-legend sui-fieldset__legend' },
})
export class FieldsetLegend {}

@Directive({
  selector: '[suiFieldsetLabel]',
  standalone: true,
  host: { class: 'label fieldset-label sui-fieldset__label' },
})
export class FieldsetLabel {}
