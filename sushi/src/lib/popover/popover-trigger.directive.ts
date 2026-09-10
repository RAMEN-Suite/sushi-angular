import { booleanAttribute, Directive, ElementRef, inject, input, InputSignal, InputSignalWithTransform } from '@angular/core';
import { Popover } from './popover.component';

/** Opens a Popover from a native button. */
@Directive({
  selector: 'button[suiPopoverTrigger]',
  host: {
    type: 'button',
    '[attr.aria-controls]': 'popover().popoverId',
    '[attr.aria-expanded]': 'popover().open()',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-disabled]': 'disabled() || null',
    '(click)': 'handleClick($event)',
  },
})
export class PopoverTrigger {
  /** Popover controlled by this button. */
  public readonly popover: InputSignal<Popover> = input.required<Popover>({ alias: 'suiPopoverTrigger' });
  /** Prevents activation while keeping the action discoverable. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  private readonly element: ElementRef<HTMLButtonElement> = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  protected handleClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this.popover().toggle(this.element.nativeElement);
  }
}
