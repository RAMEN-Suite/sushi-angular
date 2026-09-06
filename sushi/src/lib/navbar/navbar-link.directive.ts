import { Directive } from '@angular/core';

/** Styles a native navigation link or menu trigger without changing its semantics. */
@Directive({
  selector: 'a[suiNavbarLink], button[suiNavbarLink]',
  host: { class: 'sui-navbar__link' },
})
export class NavbarLink {}
