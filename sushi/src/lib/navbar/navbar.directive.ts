import { Directive, inject } from '@angular/core';
import { NavbarState } from './navbar.state';

/** Styles a native navigation landmark and coordinates its responsive content. */
@Directive({
  selector: 'nav[suiNavbar]',
  providers: [NavbarState],
  host: {
    class: 'navbar sui-navbar',
    '[attr.data-expanded]': 'state.expanded() ? "" : null',
    '(click)': 'handleClick($event)',
    '(keydown.escape)': 'handleEscape($event)',
  },
})
export class Navbar {
  protected readonly state: NavbarState = inject(NavbarState);

  protected handleClick(event: Event): void {
    if (event.target instanceof Element && event.target.closest('a')) {
      this.state.close();
    }
  }

  protected handleEscape(event: Event): void {
    if (!this.state.expanded()) {
      return;
    }

    event.preventDefault();
    this.state.closeAndFocusToggle();
  }
}
