import { Directive } from '@angular/core';

@Directive({
  selector: 'ng-template[suiCodeButton]',
  standalone: true,
})
export class CodeButtonTemplate {}

@Directive({
  selector: 'ng-template[suiCodeButtonOff]',
  standalone: true,
})
export class CodeButtonOffTemplate {}

@Directive({
  selector: 'ng-template[suiCodeButtonOn]',
  standalone: true,
})
export class CodeButtonOnTemplate {}
