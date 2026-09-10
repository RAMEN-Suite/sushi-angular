import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideBox } from '@lucide/angular';
import { Navbar, NavbarBrand, NavbarItem } from '@ramen-suite/sushi';

type Destination = 'Products' | 'Analytics' | 'Automation' | 'Resources' | 'Documentation' | 'Changelog' | 'Pricing';

@Component({
  selector: 'pg-navbar-submenus-example',
  imports: [Navbar, NavbarBrand, LucideBox],
  templateUrl: './submenus.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarSubmenusExample {
  protected readonly activeDestination: WritableSignal<Destination> = signal<Destination>('Analytics');
  protected readonly items: readonly NavbarItem<Destination>[] = [
    {
      label: 'Products',
      value: 'Products',
      items: [
        { label: 'Analytics', value: 'Analytics' },
        { label: 'Automation', value: 'Automation' },
      ],
    },
    {
      label: 'Resources',
      value: 'Resources',
      items: [
        { label: 'Documentation', value: 'Documentation' },
        { label: 'Changelog', value: 'Changelog' },
      ],
    },
    { label: 'Pricing', value: 'Pricing' },
  ];
}
