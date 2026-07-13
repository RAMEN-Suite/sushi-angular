import { Directive } from '@angular/core';

@Directive({
  selector: 'ng-template[suiToggleButton]',
  standalone: true,
})
export class SuiToggleButtonTemplate {}

@Directive({
  selector: 'ng-template[suiToggleButtonOff]',
  standalone: true,
})
export class SuiToggleButtonOffTemplate {}

@Directive({
  selector: 'ng-template[suiToggleButtonOn]',
  standalone: true,
})
export class SuiToggleButtonOnTemplate {}
