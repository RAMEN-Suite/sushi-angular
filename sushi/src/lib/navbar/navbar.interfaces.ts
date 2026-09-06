import { Orientation } from '../sushi.types';

/** Supported Navbar link arrangements. */
export type NavbarOrientation = Orientation | 'responsive';
/** Visual treatment shared by Navbar links and menu triggers. */
export type NavbarVariant = 'links' | 'menu';
/** Visual surface surrounding Navbar content. */
export type NavbarSurface = 'bordered' | 'plain';
/** Supported Navbar heights. */
export type NavbarSize = 'sm' | 'md';

/** Primitive value emitted when a Navbar item is selected. */
export type NavbarItemValue = string | number;

/** Navigation destination or non-selectable disclosure rendered by a Navbar. */
export interface NavbarItem<T extends NavbarItemValue = NavbarItemValue> {
  /** Visible label and fallback content for the item. */
  readonly label: string;
  /** Stable value emitted when a destination is selected. */
  readonly value: T;
  /** Native destination used for documents and external navigation. */
  readonly href?: string;
  /** Angular Router destination used for client-side navigation. Takes precedence over `href`. */
  readonly routerLink?: string | readonly unknown[];
  /** Destinations revealed by a non-selectable disclosure. */
  readonly items?: readonly NavbarItem<T>[];
  /** Marks the item as current when selection is controlled outside `value`. */
  readonly active?: boolean;
  /** Prevents pointer and keyboard activation while keeping the item focusable. */
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
