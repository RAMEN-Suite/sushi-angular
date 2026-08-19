import { Directive } from '@angular/core';
import { CodeButtonContext } from './code.interfaces';

/** Replaces the complete copy control and exposes copy state and behavior. */
@Directive({
  selector: 'ng-template[suiCodeButton]',
})
export class CodeButtonTemplate {
  public static ngTemplateContextGuard(_directive: CodeButtonTemplate, _context: unknown): _context is CodeButtonContext {
    return true;
  }
}

/** Replaces the default copy control content before copying. */
@Directive({
  selector: 'ng-template[suiCodeButtonOff]',
})
export class CodeButtonOffTemplate {}

/** Replaces the default copy control content after copying. */
@Directive({
  selector: 'ng-template[suiCodeButtonOn]',
})
export class CodeButtonOnTemplate {}
