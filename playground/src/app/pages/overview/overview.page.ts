import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowRight } from '@lucide/angular';
import { Badge, Button, Card, CardTitle, Divider, Navbar, NavbarItemTemplate } from '@ramen-suite/sushi';
import { navbarNavigation, NavbarNavigationGroup } from '../../app.navigation';

interface OverviewGroup extends NavbarNavigationGroup {
  readonly description: string;
}

const groupDescriptions: Readonly<Record<string, string>> = {
  Inputs: 'Capture text, numbers, files, colors, and structured values.',
  Selection: 'Choose and arrange values with familiar keyboard patterns.',
  'Form Structure': 'Compose labels, groups, surfaces, and related controls.',
  Actions: 'Trigger commands and reveal contextual actions.',
  Navigation: 'Move between views, pages, and application sections.',
  Feedback: 'Communicate progress, state, and important outcomes.',
  'Data Display': 'Present collections, records, identities, and metadata.',
  Layout: 'Structure related content and progressive disclosure.',
  Utilities: 'Support focus, code, icons, and keyboard guidance.',
};

@Component({
  selector: 'pg-overview-page',
  imports: [Badge, Button, Card, CardTitle, Divider, LucideArrowRight, Navbar, NavbarItemTemplate, RouterLink],
  templateUrl: './overview.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPage {
  protected readonly groups: readonly OverviewGroup[] = navbarNavigation.map((group: NavbarNavigationGroup): OverviewGroup => ({
    ...group,
    description: groupDescriptions[group.label] ?? 'Explore the components in this category.',
  }));
  protected readonly componentCount: number = navbarNavigation.reduce(
    (count: number, group: NavbarNavigationGroup): number => count + group.items.length,
    0,
  );
}
