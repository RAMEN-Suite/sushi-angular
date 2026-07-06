import { Directive } from '@angular/core';

@Directive({
  selector: '[suiCode]',
  standalone: true,
  host: {
    class: 'mockup-code sui-code-control',
  },
})
export class SuiCode {}
