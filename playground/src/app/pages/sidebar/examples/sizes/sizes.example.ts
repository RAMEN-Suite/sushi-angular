import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { NavbarItem, Sidebar, SidebarGroup } from '@ramen-suite/sushi';

type Page = 'Overview' | 'Projects' | 'Team';

@Component({
  selector: 'pg-sidebar-sizes-example',
  imports: [Sidebar],
  templateUrl: './sizes.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarSizesExample {
  protected readonly activePage: WritableSignal<Page> = signal<Page>('Overview');
  protected readonly groups: readonly SidebarGroup<NavbarItem<Page>>[] = [
    {
      label: 'Workspace',
      items: [
        { label: 'Overview', value: 'Overview' },
        { label: 'Projects', value: 'Projects' },
        { label: 'Team', value: 'Team' },
      ],
    },
  ];
}
