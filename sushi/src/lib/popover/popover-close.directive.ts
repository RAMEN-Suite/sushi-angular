import { Directive, input, InputSignal } from '@angular/core';
import { Popover } from './popover.component';

/** Closes a Popover from a native button. */
@Directive({ selector: 'button[suiPopoverClose]', host: { type: 'button', '(click)': 'popover().hide(true)' } })
export class PopoverClose {
  /** Popover closed by this button. */
  public readonly popover: InputSignal<Popover> = input.required<Popover>({ alias: 'suiPopoverClose' });
}
