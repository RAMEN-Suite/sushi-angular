import { Directive } from '@angular/core';

@Directive({
  selector: 'ng-template[suiCodeButton]',
})
export class CodeButtonTemplate {}

@Directive({
  selector: 'ng-template[suiCodeButtonOff]',
})
export class CodeButtonOffTemplate {}

@Directive({
  selector: 'ng-template[suiCodeButtonOn]',
})
export class CodeButtonOnTemplate {}
