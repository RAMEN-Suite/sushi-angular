import { Directive } from '@angular/core';

/** Aligns projected identity or leading navigation at the start of a Navbar. */
@Directive({
  selector: '[suiNavbarStart]',
  host: { class: 'navbar-start gap-2' },
})
export class NavbarStart {}
