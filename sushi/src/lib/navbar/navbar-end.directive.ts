import { Directive } from '@angular/core';

/** Aligns actions or account controls at the end of a Navbar. */
@Directive({
  selector: '[suiNavbarEnd]',
  host: { class: 'navbar-end gap-2' },
})
export class NavbarEnd {}
