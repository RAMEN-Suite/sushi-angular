import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  TemplateRef,
} from '@angular/core';
import { LucideChevronDown } from '@lucide/angular';
import { RouterLink } from '@angular/router';
import { NavbarItem, NavbarItemContext, NavbarOrientation, NavbarVariant } from '../navbar.interfaces';
import { NavbarDropdown } from './navbar-dropdown.directive';
import { NavbarLink } from './navbar-link.directive';
import { NavbarLinks } from './navbar-links.directive';
import { NavbarState } from './navbar.state';

/**
 * Renders Navbar items for the public shell component.
 * @internal
 */
@Component({
  selector: 'sui-navbar-menu',
  imports: [LucideChevronDown, NavbarDropdown, NavbarLink, NavbarLinks, NgTemplateOutlet, RouterLink],
  templateUrl: './navbar-menu.component.html',
  host: {
    class: 'block',
    '[class.w-full]': 'orientation() === "vertical"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarMenu<I extends NavbarItem = NavbarItem> {
  /** Top-level destinations and disclosures rendered by the Navbar. */
  public readonly items: InputSignal<readonly I[]> = input.required<readonly I[]>();
  /** Accessible label for the navigation list. */
  public readonly ariaLabel: InputSignal<string> = input<string>('Primary links');
  /** Controls how items are arranged. */
  public readonly orientation: InputSignal<NavbarOrientation> = input<NavbarOrientation>('responsive');
  /** Selects a button-like menu treatment or native link treatment. */
  public readonly variant: InputSignal<NavbarVariant> = input<NavbarVariant>('links');
  /** Value of the current destination. */
  public readonly value: InputSignal<I['value'] | null> = input<I['value'] | null>(null);
  /** Custom content rendered for each item. */
  public readonly template: InputSignal<TemplateRef<NavbarItemContext<I>> | undefined> = input<
    TemplateRef<NavbarItemContext<I>> | undefined
  >(undefined);

  /** Emits the selected destination value. */
  public readonly itemSelected: OutputEmitterRef<I['value']> = output<I['value']>();

  private readonly state: NavbarState = inject(NavbarState);

  protected hasChildren(item: I): boolean {
    return Boolean(item.items?.length);
  }

  protected isCurrent(item: NavbarItem<I['value']>): boolean {
    return item.active === true || item.value === this.value();
  }

  protected hasCurrentChild(item: NavbarItem<I['value']>): boolean {
    return item.items?.some((child: NavbarItem<I['value']>): boolean => this.isCurrent(child)) ?? false;
  }

  protected select(item: NavbarItem<I['value']>, event: Event): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    this.itemSelected.emit(item.value);
    this.state.close();
  }
}
