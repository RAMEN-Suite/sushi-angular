import { Directive, inject } from '@angular/core';
import { NavbarState } from './navbar.state';

/** Marks the responsive region revealed by the Navbar toggle on narrow viewports. */
@Directive({
  selector: '[suiNavbarContent]',
  host: {
    class: 'sui-navbar__content',
    '[id]': 'state.contentId',
    '(keydown.escape)': 'handleEscape($event)',
  },
})
export class NavbarContent {
  protected readonly state: NavbarState = inject(NavbarState);

  protected handleEscape(event: Event): void {
    if (!this.state.expanded()) return;
    event.preventDefault();
    this.state.closeAndFocusToggle();
  }
}
