import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Button } from '@ramen-suite/sushi';
import { filter, map } from 'rxjs';
import { apiNavigation, navigation } from './app.navigation';
import type { NavigationGroup, NavigationItem } from './app.navigation';

type PlaygroundTheme = 'sushi' | 'sushi-dark';

@Component({
  selector: 'pg-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Button],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly sidebar: NavigationGroup[] = navigation;
  protected readonly pagePath: Signal<string | null> = computed(() => {
    const segment: string =
      this.currentUrl()
        .split('/')
        .find((value: string): boolean => value.length > 0) ?? '';
    const path: string = `/${segment}`;
    return apiNavigation.some((item: NavigationItem): boolean => item.path === path) ? path : null;
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
