import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  contentChildren,
  inject,
  input,
  InputSignal,
  InputSignalWithTransform,
  output,
  OutputEmitterRef,
  Signal,
  TemplateRef,
} from '@angular/core';
import { LucideMenu } from '@lucide/angular';
import { Button } from '../button';
import { NavbarContent } from './navbar-content.directive';
import { NavbarItemTemplate } from './navbar-item-template.directive';
import { NavbarItem, NavbarItemContext, NavbarLinksOrientation, NavbarLinksVariant } from './navbar.interfaces';
import { NavbarMenu } from './navbar-menu.component';
import { NavbarAction, NavbarBrand } from './navbar-slot.directive';
import { NavbarState } from './navbar.state';
import { NavbarToggle } from './navbar-toggle.directive';

/** Builds a responsive navigation landmark from an item model or projected custom content. */
@Component({
  selector: 'sui-navbar',
  imports: [Button, LucideMenu, NavbarContent, NavbarMenu, NavbarToggle],
  providers: [NavbarState],
  templateUrl: './navbar.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent<I extends NavbarItem = NavbarItem> {
  /** Top-level destinations and one-level disclosures. Omit when projecting custom Navbar content. */
  public readonly items: InputSignal<readonly I[]> = input<readonly I[]>([]);
  /** Accessible label for the navigation landmark. */
  public readonly ariaLabel: InputSignal<string> = input<string>('Primary navigation');
  /** Whether narrow layouts collapse behind a toggle. */
  public readonly collapsible: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Controls the arrangement used when the Navbar remains visible. */
  public readonly orientation: InputSignal<NavbarLinksOrientation> = input<NavbarLinksOrientation>('responsive');
  /** Selects a link-like or filled menu treatment. */
  public readonly variant: InputSignal<NavbarLinksVariant> = input<NavbarLinksVariant>('links');
  /** Value of the current destination. */
  public readonly value: InputSignal<I['value'] | null> = input<I['value'] | null>(null);

  /** Emits the selected destination value. */
  public readonly itemSelected: OutputEmitterRef<I['value']> = output<I['value']>();

  protected readonly itemTemplate: Signal<TemplateRef<NavbarItemContext<I>> | undefined> = contentChild(NavbarItemTemplate, {
    read: TemplateRef,
  });
  protected readonly customContent: Signal<NavbarContent | undefined> = contentChild(NavbarContent);
  protected readonly brand: Signal<NavbarBrand | undefined> = contentChild(NavbarBrand);
  protected readonly actions: Signal<readonly NavbarAction[]> = contentChildren(NavbarAction);

  protected readonly state: NavbarState = inject(NavbarState);
}
