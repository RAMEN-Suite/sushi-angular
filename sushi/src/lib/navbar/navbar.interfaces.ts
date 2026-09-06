import { Orientation } from '../sushi.types';

/** Supported Navbar link arrangements. */
export type NavbarLinksOrientation = Orientation | 'responsive';
/** Visual treatment shared by Navbar links and menu triggers. */
export type NavbarLinksVariant = 'links' | 'menu';

/** Primitive value emitted when a Navbar item is selected. */
export type NavbarItemValue = string | number;

/** Navigation destination or disclosure rendered by a Navbar Menu. */
export interface NavbarItem<T extends NavbarItemValue = NavbarItemValue> {
  /** Visible label and fallback content for the item. */
  readonly label: string;
  /** Stable value emitted when a destination is selected. */
  readonly value: T;
  /** Native destination used when the item should render as a link. */
  readonly href?: string;
  /** Destinations revealed by a non-selectable disclosure. */
  readonly items?: readonly NavbarItem<T>[];
  /** Marks the item as the current destination. */
  readonly active?: boolean;
  /** Prevents activation while keeping the destination discoverable. */
  readonly disabled?: boolean;
}

/** Context exposed to a custom Navbar item template. */
export interface NavbarItemContext<I extends NavbarItem = NavbarItem> {
  /** Navbar item available as the implicit template value. */
  readonly $implicit: I;
  /** Navbar item available by its explicit context name. */
  readonly item: I;
  /** Nesting level of the rendered item. */
  readonly level: 0 | 1;
}
