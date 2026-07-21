import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Button } from '@ramen-suite/sushi';
import { navigation, NavigationGroup } from './app.navigation';

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
  protected readonly document: Document = inject(DOCUMENT);
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
