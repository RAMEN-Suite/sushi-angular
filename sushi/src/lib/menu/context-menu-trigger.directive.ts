import { booleanAttribute, Directive, ElementRef, inject, input, InputSignal, InputSignalWithTransform } from '@angular/core';
import { Menu } from './menu.component';

/** Opens a popup Menu from a context-menu gesture on its host. */
@Directive({
  selector: '[suiContextMenuTrigger]',
  host: {
    '[attr.aria-controls]': 'menu().surfaceId',
    '[attr.aria-disabled]': 'disabled() || menu().disabled() || null',
    '[attr.aria-expanded]': 'menu().isOpen()',
    '[attr.aria-haspopup]': '"menu"',
    '(contextmenu)': 'handleContextMenu($event)',
    '(keydown)': 'handleKeydown($event)',
  },
})
export class ContextMenuTrigger {
  /** Popup Menu opened by the host's context-menu gesture. */
  public readonly menu: InputSignal<Menu> = input.required<Menu>({ alias: 'suiContextMenuTrigger' });

  /** Preserves the browser context menu instead of opening the SUSHI menu. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  private readonly element: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef);

  protected handleContextMenu(event: MouseEvent): void {
    const menu: Menu = this.menu();
    if (this.disabled() || menu.disabled()) return;
    event.preventDefault();
    menu.openAt({ x: event.clientX, y: event.clientY }, this.element.nativeElement);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    const isContextKey: boolean = event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10');
    const menu: Menu = this.menu();
    if (!isContextKey || this.disabled() || menu.disabled()) return;

    event.preventDefault();
    const bounds: DOMRect = this.element.nativeElement.getBoundingClientRect();
    menu.openAt({ x: bounds.left + 24, y: bounds.top + 24 }, this.element.nativeElement);
  }
}
