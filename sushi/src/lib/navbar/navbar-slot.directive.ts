import { Directive } from '@angular/core';

/** Projects brand or product identity at the start of a Navbar. */
@Directive({ selector: '[suiNavbarBrand]', host: { class: 'sui-navbar__brand' } })
export class NavbarBrand {}

/** Projects a global action at the end of a Navbar. */
@Directive({ selector: '[suiNavbarAction]', host: { class: 'sui-navbar__action' } })
export class NavbarAction {}
