import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { NavbarMenu } from './internal/navbar-menu.component';
import { NavbarState } from './internal/navbar.state';
import { NavbarToggle } from './internal/navbar-toggle.directive';
import { NavbarContent } from './navbar-content.directive';
import { NavbarItemTemplate } from './navbar-item-template.directive';
import {
  NavbarCollapseAt,
  NavbarInset,
  NavbarItem,
  NavbarItemContext,
  NavbarMenuAlign,
  NavbarOrientation,
  NavbarSize,
  NavbarSurface,
  NavbarVariant,
} from './navbar.interfaces';
import { NavbarAction, NavbarBrand } from './navbar-slot.directive';

/** Builds a responsive navigation landmark from an item model or projected custom content. */
@Component({
  selector: 'sui-navbar',
  imports: [Button, LucideMenu, NavbarContent, NavbarMenu, NavbarToggle],
  providers: [NavbarState],
  templateUrl: './navbar.component.html',
  host: {
    class: 'sui-navbar-container block',
    '[attr.data-collapse-at]': 'collapseAt()',
    '[attr.data-collapsible]': 'collapsible()',
    '[attr.data-orientation]': 'orientation()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar<I extends NavbarItem = NavbarItem> {
  /** Top-level destinations and one-level disclosures. Omit when projecting custom Navbar content. */
  public readonly items: InputSignal<readonly I[]> = input<readonly I[]>([]);
  /** Accessible label for the navigation landmark. */
  public readonly ariaLabel: InputSignal<string> = input<string>('Primary navigation');
  /** Whether narrow layouts collapse behind a toggle. */
  public readonly collapsible: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Container width at which the expanded layout begins. Use `md` when a compact navigation fits sooner. */
  public readonly collapseAt: InputSignal<NavbarCollapseAt> = input<NavbarCollapseAt>('lg');
  /** Controls the arrangement used when the Navbar remains visible. */
  public readonly orientation: InputSignal<NavbarOrientation> = input<NavbarOrientation>('responsive');
  /** Controls the horizontal breathing room at both Navbar edges. */
  public readonly inset: InputSignal<NavbarInset> = input<NavbarInset>('default');
  /** Optionally centers generated navigation items in the expanded layout. */
  public readonly menuAlign: InputSignal<NavbarMenuAlign> = input<NavbarMenuAlign>('auto');
  /** Controls the minimum height of horizontal Navbar layouts. */
  public readonly size: InputSignal<NavbarSize> = input<NavbarSize>('md');
  /** Controls whether the Navbar renders its own bordered surface. */
  public readonly surface: InputSignal<NavbarSurface> = input<NavbarSurface>('bordered');
  /** Selects a link-like or filled menu treatment. */
  public readonly variant: InputSignal<NavbarVariant> = input<NavbarVariant>('links');
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

  protected readonly hasContent: Signal<boolean> = computed<boolean>(
    (): boolean => this.items().length > 0 || this.customContent() !== undefined,
  );

  protected readonly state: NavbarState = inject(NavbarState);
}
