import { Directive } from '@angular/core';
import { ToggleButtonContext } from './toggle-button.interfaces';

/** Replaces the complete control while preserving the toggle state and handlers. */
@Directive({
  selector: 'ng-template[suiToggleButton]',
})
export class ToggleButtonTemplate {
  public static ngTemplateContextGuard(_directive: ToggleButtonTemplate, _context: unknown): _context is ToggleButtonContext {
    return true;
  }
}

/** Replaces content rendered while the button is not pressed. */
@Directive({
  selector: 'ng-template[suiToggleButtonOff]',
})
export class ToggleButtonOffTemplate {}

/** Replaces content rendered while the button is pressed. */
@Directive({
  selector: 'ng-template[suiToggleButtonOn]',
})
export class ToggleButtonOnTemplate {}
