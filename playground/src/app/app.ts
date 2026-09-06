import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LucideMoon, LucideSoup, LucideSun } from '@lucide/angular';
import { Button, Navbar, NavbarAction, NavbarBrand, NavbarItem } from '@ramen-suite/sushi';
import { filter, map } from 'rxjs';
import { apiNavigation, mobileNavigation, navbarNavigation, overviewNavigation } from './app.navigation';
import type { NavbarNavigationGroup, NavigationItem } from './app.navigation';

type PlaygroundTheme = 'sushi' | 'sushi-dark';

@Component({
  selector: 'pg-root',
  imports: [Button, LucideMoon, LucideSoup, LucideSun, Navbar, NavbarAction, NavbarBrand, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly sidebar: readonly NavbarNavigationGroup[] = navbarNavigation;
  protected readonly overviewNavigation: readonly NavbarItem<string>[] = overviewNavigation;
  protected readonly mobileNavigation: readonly NavbarItem<string>[] = mobileNavigation;
  protected readonly activePath: Signal<string> = computed((): string => {
    const segment: string | undefined = this.currentPath()
      .split('/')
      .find((value: string): boolean => value.length > 0);
    return segment ? `/${segment}` : '/';
  });
  protected readonly pagePath: Signal<string | null> = computed(() => {
    const path: string = this.activePath();
    return apiNavigation.some((item: NavigationItem): boolean => item.path === path) ? path : null;
  });
  protected readonly documentationItems: Signal<readonly NavbarItem<string>[]> = computed((): readonly NavbarItem<string>[] => {
    const path: string | null = this.pagePath();
    if (!path) return [];

    return [
      { label: 'Examples', value: path, routerLink: path },
      { label: 'API reference', value: `${path}/api`, routerLink: `${path}/api` },
    ];
  });

  private readonly document: Document = inject(DOCUMENT);
  private readonly router: Router = inject(Router);
  private readonly currentUrl: Signal<string> = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd): string => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  protected readonly currentPath: Signal<string> = computed((): string => this.currentUrl().split(/[?#]/, 1)[0] || '/');
  protected readonly theme: WritableSignal<PlaygroundTheme> = signal<PlaygroundTheme>(this.getInitialTheme());

  protected toggleTheme(): void {
    const nextTheme: PlaygroundTheme = this.theme() === 'sushi' ? 'sushi-dark' : 'sushi';
    this.theme.set(nextTheme);
    this.document.documentElement.dataset['theme'] = nextTheme;
  }

  private getInitialTheme(): PlaygroundTheme {
    const configuredTheme: string | undefined = this.document.documentElement.dataset['theme'];
    if (configuredTheme === 'sushi' || configuredTheme === 'sushi-dark') return configuredTheme;

    return this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches ? 'sushi-dark' : 'sushi';
  }
}
