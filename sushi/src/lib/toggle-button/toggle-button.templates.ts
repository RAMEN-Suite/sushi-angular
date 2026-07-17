import { Directive } from '@angular/core';

@Directive({
  selector: 'ng-template[suiToggleButton]',
  standalone: true,
})
export class ToggleButtonTemplate {}

@Directive({
  selector: 'ng-template[suiToggleButtonOff]',
  standalone: true,
})
export class ToggleButtonOffTemplate {}

@Directive({
  selector: 'ng-template[suiToggleButtonOn]',
  standalone: true,
})
export class ToggleButtonOnTemplate {}
