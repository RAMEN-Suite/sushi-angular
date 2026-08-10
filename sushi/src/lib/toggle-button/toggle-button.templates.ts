import { Directive } from '@angular/core';
import { ToggleButtonContext } from './toggle-button.interfaces';

@Directive({
  selector: 'ng-template[suiToggleButton]',
})
export class ToggleButtonTemplate {
  public static ngTemplateContextGuard(_directive: ToggleButtonTemplate, _context: unknown): _context is ToggleButtonContext {
    return true;
  }
}

@Directive({
  selector: 'ng-template[suiToggleButtonOff]',
})
export class ToggleButtonOffTemplate {}

@Directive({
  selector: 'ng-template[suiToggleButtonOn]',
})
export class ToggleButtonOnTemplate {}
