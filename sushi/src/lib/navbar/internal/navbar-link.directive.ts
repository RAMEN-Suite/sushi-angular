import { Directive } from '@angular/core';

/**
 * Styles links and buttons rendered by the internal Navbar menu.
 * @internal
 */
@Directive({
  selector: 'a[suiNavbarLink], button[suiNavbarLink]',
  host: { class: 'sui-navbar__link' },
})
export class NavbarLink {}
