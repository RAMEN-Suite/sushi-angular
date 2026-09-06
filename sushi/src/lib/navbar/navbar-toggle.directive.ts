import { Directive, ElementRef, inject } from '@angular/core';
import { NavbarState } from './navbar.state';

/** Connects a button to the responsive Navbar content. */
@Directive({
  selector: 'button[suiNavbarToggle]',
  host: {
    class: 'sui-navbar__toggle',
    type: 'button',
    'aria-label': 'Toggle navigation',
    '[attr.aria-controls]': 'state.contentId',
    '[attr.aria-expanded]': 'state.expanded()',
    '(click)': 'state.toggle()',
  },
})
export class NavbarToggle {
  protected readonly state: NavbarState = inject(NavbarState);
  private readonly element: ElementRef<HTMLButtonElement> = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  public constructor() {
    this.state.registerToggle(this.element.nativeElement);
  }
}
