import { booleanAttribute, Directive, ElementRef, inject, input, InputSignal, InputSignalWithTransform } from '@angular/core';
import { Drawer } from './drawer.component';

@Directive({
  selector: 'button[suiDrawerTrigger]',
  host: {
    type: 'button',
    '[attr.aria-controls]': 'drawer().drawerId',
    '[attr.aria-expanded]': 'drawer().isOpen()',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.disabled]': 'null',
    '(click)': 'handleClick($event)',
  },
})
/** Opens and closes a Drawer from a native button. */
export class DrawerTrigger {
  /** Drawer controlled by this trigger. */
  public readonly drawer: InputSignal<Drawer> = input.required<Drawer>({ alias: 'suiDrawerTrigger' });
  /** Prevents activation while keeping the trigger focusable. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  private readonly element: ElementRef<HTMLButtonElement> = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  protected handleClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this.drawer().toggle(this.element.nativeElement);
  }
}
