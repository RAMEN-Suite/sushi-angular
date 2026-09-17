import { DOCUMENT, Location } from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {
  LucideHouse,
  LucideGitPullRequest,
  LucideListChecks,
  LucideMenu,
  LucideMessageCircle,
  LucideMoon,
  LucideMousePointerClick,
  LucideNavigation,
  LucidePanelsTopLeft,
  LucideRows3,
  LucideSun,
  LucideTableProperties,
  LucideTextCursorInput,
  LucideWrench,
  LucideX,
} from '@lucide/angular';
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
  Navbar,
  NavbarAction,
  NavbarBrand,
  NavbarItem,
  Sidebar,
  SidebarGroupTemplate,
  SidebarHeader,
} from '@sushi-kit/angular';
import { filter, map } from 'rxjs';
import { apiNavigation, sidebarNavigation } from './app.navigation';
import type { NavigationItem, SidebarNavigationGroup } from './app.navigation';

type PlaygroundTheme = 'sushi' | 'sushi-dark';

@Component({
  selector: 'pg-root',
  imports: [
    Button,
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerTrigger,
    LucideHouse,
    LucideGitPullRequest,
    LucideListChecks,
    LucideMenu,
    LucideMessageCircle,
    LucideMoon,
    LucideMousePointerClick,
    LucideNavigation,
    LucidePanelsTopLeft,
    LucideRows3,
    LucideSun,
    LucideTableProperties,
    LucideTextCursorInput,
    LucideWrench,
    LucideX,
    Navbar,
    NavbarAction,
    NavbarBrand,
    RouterOutlet,
    Sidebar,
    SidebarGroupTemplate,
    SidebarHeader,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly sidebar: readonly SidebarNavigationGroup[] = sidebarNavigation;
  protected readonly activePath: Signal<string> = computed((): string => {
    if (this.currentPath().startsWith('/contribute/')) return this.currentPath();

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
      { label: 'Interface', value: `${path}/api`, routerLink: `${path}/api` },
      { label: 'Theming', value: `${path}/styling`, routerLink: `${path}/styling` },
    ];
  });
  private readonly document: Document = inject(DOCUMENT);
  private readonly location: Location = inject(Location);
  private readonly router: Router = inject(Router);
  private readonly contentScroll: Signal<ElementRef<HTMLElement> | undefined> =
    viewChild<ElementRef<HTMLElement>>('contentScroll');
  private readonly currentUrl: Signal<string> = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd): string => event.urlAfterRedirects),
    ),
    { initialValue: this.location.path(true) || this.router.url },
  );
  protected readonly currentPath: Signal<string> = computed((): string => this.currentUrl().split(/[?#]/, 1)[0] || '/');
  protected readonly theme: WritableSignal<PlaygroundTheme> = signal<PlaygroundTheme>(this.getInitialTheme());

  public constructor() {
    afterRenderEffect({
      write: (): void => {
        this.currentUrl();
        this.document.defaultView?.requestAnimationFrame((): void => this.scrollContentToTop());
      },
    });
  }

  protected toggleTheme(): void {
    const nextTheme: PlaygroundTheme = this.theme() === 'sushi' ? 'sushi-dark' : 'sushi';
    this.theme.set(nextTheme);
    this.document.documentElement.dataset['theme'] = nextTheme;
  }

  private scrollContentToTop(): void {
    const element: HTMLElement | undefined = this.contentScroll()?.nativeElement;
    if (!element) return;
    element.scrollTo({ top: 0, left: 0 });
  }

  private getInitialTheme(): PlaygroundTheme {
    const configuredTheme: string | undefined = this.document.documentElement.dataset['theme'];
    if (configuredTheme === 'sushi' || configuredTheme === 'sushi-dark') return configuredTheme;

    return this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches ? 'sushi-dark' : 'sushi';
  }
}
