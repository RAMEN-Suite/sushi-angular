import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { navigation, NavigationGroup } from './app.navigation';
import { DOCUMENT } from '@angular/common';
import { SuiButton } from '@ramen-suite/sushi';

type PlaygroundTheme = 'sushi' | 'sushi-dark';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, SuiButton],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly sidebar: NavigationGroup[] = navigation;
  protected readonly document: Document = inject(DOCUMENT);
  protected readonly theme: WritableSignal<PlaygroundTheme> = signal<PlaygroundTheme>('sushi');

  protected toggleTheme(): void {
    const nextTheme: PlaygroundTheme = this.theme() === 'sushi' ? 'sushi-dark' : 'sushi';
    this.theme.set(nextTheme);
    this.document.documentElement.dataset['theme'] = nextTheme;
  }
}
