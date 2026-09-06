import { Directive, input, InputSignal } from '@angular/core';
import { NavbarLinksOrientation, NavbarLinksVariant } from './navbar.interfaces';

/** Arranges native navigation links and menu triggers with one consistent treatment. */
@Directive({
  selector: 'ul[suiNavbarLinks]',
  host: {
    class: 'sui-navbar__links flex gap-1 p-0',
    '[class.sui-navbar__links--horizontal]': 'orientation() === "horizontal"',
    '[class.sui-navbar__links--vertical]': 'orientation() === "vertical"',
    '[class.sui-navbar__links--responsive]': 'orientation() === "responsive"',
    '[class.sui-navbar__links--links]': 'variant() === "links"',
    '[class.sui-navbar__links--menu]': 'variant() === "menu"',
  },
})
export class NavbarLinks {
  /** Controls how links and menu triggers are arranged. */
  public readonly orientation: InputSignal<NavbarLinksOrientation> = input<NavbarLinksOrientation>('responsive');
  /** Selects a button-like menu treatment or native link treatment. */
  public readonly variant: InputSignal<NavbarLinksVariant> = input<NavbarLinksVariant>('menu');
}
