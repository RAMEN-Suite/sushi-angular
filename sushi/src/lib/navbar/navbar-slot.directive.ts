import { Directive } from '@angular/core';

/** Projects brand or product identity into a model-driven Navbar. */
@Directive({ selector: '[suiNavbarBrand]', host: { class: 'sui-navbar__brand' } })
export class NavbarBrand {}

/** Projects an action into the end of a model-driven Navbar. */
@Directive({ selector: '[suiNavbarAction]', host: { class: 'sui-navbar__action' } })
export class NavbarAction {}
