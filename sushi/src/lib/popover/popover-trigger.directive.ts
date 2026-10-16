import {
  booleanAttribute,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  type InputSignal,
  type InputSignalWithTransform,
  type Signal,
} from '@angular/core';
import { type Popover } from './popover.component';
import { OVERLAY_TRIGGER_OPEN } from '../internal/overlay-trigger-state';

/** Opens a Popover from a native button. */
@Directive({
  selector: 'button[suiPopoverTrigger]',
  providers: [
    {
      provide: OVERLAY_TRIGGER_OPEN,
      useFactory: (): Signal<boolean> => {
        const trigger: PopoverTrigger = inject(PopoverTrigger);
        return computed((): boolean => trigger.popover().open());
      },
    },
  ],
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
