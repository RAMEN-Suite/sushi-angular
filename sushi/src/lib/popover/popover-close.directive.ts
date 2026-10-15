import { Directive, input, type InputSignal } from '@angular/core';
import { type Popover } from './popover.component';

/** Closes a Popover from a native button. */
@Directive({ selector: 'button[suiPopoverClose]', host: { type: 'button', '(click)': 'popover().hide(true)' } })
export class PopoverClose {
  /** Popover closed by this button. */
  public readonly popover: InputSignal<Popover> = input.required<Popover>({ alias: 'suiPopoverClose' });
}
