import { ChangeDetectionStrategy, Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import {
  LucideChevronDown,
  LucideChevronRight,
  LucideCloud,
  LucideHand,
  LucideMessageSquare,
  LucideMinus,
  LucideMousePointer2,
  LucideNetwork,
  LucidePencilLine,
  LucidePlay,
  LucidePlus,
  LucideShare2,
} from '@lucide/angular';
import {
  Button,
  Join,
  JoinItem,
  Menu,
  MenuEntry,
  MenuTrigger,
  MenuValue,
  NavbarAction,
  NavbarBrand,
  NavbarComponent,
  NavbarContent,
} from '@ramen-suite/sushi';

type Workspace = 'Research' | 'Editorial' | 'Archive';
type WorkspaceDocument = 'Corpus review' | 'Annotation map' | 'Source graph';

@Component({
  selector: 'pg-navbar-desktop-example',
  imports: [
    Button,
    Join,
    JoinItem,
    LucideChevronDown,
    LucideChevronRight,
    LucideCloud,
    LucideHand,
    LucideMessageSquare,
    LucideMinus,
    LucideMousePointer2,
    LucideNetwork,
    LucidePencilLine,
    LucidePlay,
    LucidePlus,
    LucideShare2,
    Menu,
    MenuTrigger,
    NavbarAction,
    NavbarBrand,
    NavbarComponent,
    NavbarContent,
  ],
  templateUrl: './desktop.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarDesktopExample {
  protected readonly workspace: WritableSignal<Workspace> = signal<Workspace>('Research');
  protected readonly document: WritableSignal<WorkspaceDocument> = signal<WorkspaceDocument>('Corpus review');
  protected readonly title: Signal<string> = computed<string>((): string => this.document());

  protected readonly workspaces: Signal<readonly MenuEntry[]> = computed<readonly MenuEntry[]>((): readonly MenuEntry[] => [
    { label: 'Research workspace', value: 'Research', active: this.workspace() === 'Research' },
    { label: 'Editorial workspace', value: 'Editorial', active: this.workspace() === 'Editorial' },
    { label: 'Archive workspace', value: 'Archive', active: this.workspace() === 'Archive' },
  ]);

  protected readonly documents: Signal<readonly MenuEntry[]> = computed<readonly MenuEntry[]>((): readonly MenuEntry[] => [
    { label: 'Corpus review', value: 'Corpus review', active: this.document() === 'Corpus review' },
    { label: 'Annotation map', value: 'Annotation map', active: this.document() === 'Annotation map' },
    { label: 'Source graph', value: 'Source graph', active: this.document() === 'Source graph' },
  ]);

  protected selectWorkspace(value: MenuValue): void {
    switch (value) {
      case 'Research':
      case 'Editorial':
      case 'Archive':
        this.workspace.set(value);
    }
  }

  protected selectDocument(value: MenuValue): void {
    switch (value) {
      case 'Corpus review':
      case 'Annotation map':
      case 'Source graph':
        this.document.set(value);
    }
  }
}
