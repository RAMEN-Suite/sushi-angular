import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowRight } from '@lucide/angular';
import { Badge, Button, Card, CardTitle, Navbar, NavbarItemTemplate } from '@ramen-suite/sushi';
import { navbarNavigation, NavbarNavigationGroup } from '../../app.navigation';

@Component({
  selector: 'pg-overview-page',
  imports: [Badge, Button, Card, CardTitle, LucideArrowRight, Navbar, NavbarItemTemplate, RouterLink],
  templateUrl: './overview.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPage {
  protected readonly groups: readonly NavbarNavigationGroup[] = navbarNavigation;
  protected readonly componentCount: number = navbarNavigation.reduce(
    (count: number, group: NavbarNavigationGroup): number => count + group.items.length,
    0,
  );
}
