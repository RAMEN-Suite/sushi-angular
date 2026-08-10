import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Badge, Button, Card, CardTitle } from '@ramen-suite/sushi';
import { navigation, NavigationGroup } from '../../app.navigation';

@Component({
  selector: 'pg-overview-page',
  imports: [Badge, Button, Card, CardTitle, RouterLink],
  templateUrl: './overview.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPage {
  protected readonly groups: NavigationGroup[] = navigation;
  protected readonly componentCount: number = navigation.reduce(
    (count: number, group: NavigationGroup): number => count + group.items.length,
    0,
  );
}
