import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideHouse } from '@lucide/angular';
import { Breadcrumb, BreadcrumbItem, BreadcrumbItemTemplate } from '@sushi-kit/angular';

@Component({
  selector: 'pg-breadcrumb-usage-example',
  imports: [Breadcrumb, BreadcrumbItemTemplate, LucideHouse],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbUsageExample {
  protected readonly path: readonly BreadcrumbItem[] = [
    { value: 'home', label: 'Home', routerLink: '/breadcrumb' },
    { value: 'shop', label: 'Shop', routerLink: '/breadcrumb' },
    { value: 'tableware', label: 'Tableware', routerLink: '/breadcrumb' },
    { value: 'bowls', label: 'Ramen bowls' },
  ];
}
