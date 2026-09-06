import { Directive } from '@angular/core';

/** Aligns primary navigation or search content at the center of a Navbar. */
@Directive({
  selector: '[suiNavbarCenter]',
  host: { class: 'navbar-center gap-2' },
})
export class NavbarCenter {}
