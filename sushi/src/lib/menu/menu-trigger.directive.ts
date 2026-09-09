import { booleanAttribute, Directive, ElementRef, inject, input, InputSignal, InputSignalWithTransform } from '@angular/core';
import { Menu } from './menu.component';
import { MenuItem } from './menu.interfaces';

/** Opens a popup Menu from a native button. */
@Directive({
  selector: 'button[suiMenuTrigger]',
  host: {
    type: 'button',
    '[attr.aria-controls]': 'menu().surfaceId',
    '[attr.aria-expanded]': 'menu().isOpen()',
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-disabled]': 'disabled() || menu().disabled() || null',
    '[attr.disabled]': 'null',
    '(click)': 'handleClick($event)',
    '(keydown.arrowDown)': 'handleArrowDown($event)',
  },
})
export class MenuTrigger<I extends MenuItem = MenuItem> {
  /** Popup Menu controlled by this button. */
  public readonly menu: InputSignal<Menu<I>> = input.required<Menu<I>>({ alias: 'suiMenuTrigger' });

  /** Prevents opening the menu while keeping the trigger focusable. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  private readonly element: ElementRef<HTMLButtonElement> = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  protected handleClick(event: MouseEvent): void {
    const menu: Menu<I> = this.menu();
    if (this.disabled() || menu.disabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    menu.toggle(this.element.nativeElement);
  }

  protected handleArrowDown(event: Event): void {
    const menu: Menu<I> = this.menu();
    if (this.disabled() || menu.disabled()) return;
    event.preventDefault();
    menu.open(this.element.nativeElement);
  }
}
