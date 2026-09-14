import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideSoup } from '@lucide/angular';
import { Navbar, NavbarBrand, NavbarItem } from '@sushi-kit/angular';

type Page = 'Products' | 'Solutions' | 'Pricing';

@Component({
  selector: 'pg-navbar-basic-example',
  imports: [LucideSoup, Navbar, NavbarBrand],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarBasicExample {
  protected readonly activePage: WritableSignal<Page> = signal<Page>('Products');
  protected readonly items: readonly NavbarItem<Page>[] = [
    { label: 'Products', value: 'Products' },
    { label: 'Solutions', value: 'Solutions' },
    { label: 'Pricing', value: 'Pricing' },
  ];
}
