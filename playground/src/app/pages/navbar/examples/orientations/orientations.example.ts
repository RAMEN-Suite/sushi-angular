import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { NavbarComponent, NavbarItem } from '@ramen-suite/sushi';

type ProjectView = 'Board' | 'Timeline' | 'Reports';
type SettingsPage = 'Profile' | 'Notifications' | 'Security';

@Component({
  selector: 'pg-navbar-orientations-example',
  imports: [NavbarComponent],
  templateUrl: './orientations.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarOrientationsExample {
  protected readonly view: WritableSignal<ProjectView> = signal<ProjectView>('Board');
  protected readonly settings: WritableSignal<SettingsPage> = signal<SettingsPage>('Profile');

  protected readonly views: readonly NavbarItem<ProjectView>[] = [
    { label: 'Board', value: 'Board' },
    { label: 'Timeline', value: 'Timeline' },
    { label: 'Reports', value: 'Reports' },
  ];
  protected readonly settingsPages: readonly NavbarItem<SettingsPage>[] = [
    { label: 'Profile', value: 'Profile' },
    { label: 'Notifications', value: 'Notifications' },
    { label: 'Security', value: 'Security' },
  ];
}
