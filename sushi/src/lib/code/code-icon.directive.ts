import { Directive } from '@angular/core';

@Directive({
  selector: 'ng-template[suiCodeCopyButton]',
  standalone: true,
})
export class SuiCodeCopyButton {}

@Directive({
  selector: 'ng-template[suiCodeCopyIcon]',
  standalone: true,
})
export class SuiCodeCopyIcon {}

@Directive({
  selector: 'ng-template[suiCodeCopiedIcon]',
  standalone: true,
})
export class SuiCodeCopiedIcon {}
