import { Directive, inject } from '@angular/core';
import { NavbarState } from './internal/navbar.state';

/** Projects custom toolbar content into the responsive center of a Navbar. */
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
