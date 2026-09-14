import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Code, CodeLine } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import { highlightLines } from '../../shared/example-code/example-highlighter';
import { SidebarWorkspaceExample } from './examples/workspace/workspace.example';
import workspaceHtml from './examples/workspace/workspace.example.html';
import * as workspaceTs from './examples/workspace/workspace.example.ts' with { loader: 'text' };

@Component({
  selector: 'pg-sidebar-page',
  imports: [Badge, Code, CodeLine, ExampleCode, ExamplePreview, SidebarWorkspaceExample],
  templateUrl: './sidebar.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarPage {
  protected readonly stateLines: readonly string[] = highlightLines(
    `@Injectable()
export class NavigationState {
  readonly collapsed = signal(false);
  readonly drawerOpen = signal(false);
}`,
    'typescript',
  );
  protected readonly providerLines: readonly string[] = highlightLines(
    `@Component({ providers: [NavigationState] })
export class AppLayout {
  protected readonly navigation = inject(NavigationState);
}

export class AppNavbar {
  protected readonly navigation = inject(NavigationState);
}`,
    'typescript',
  );
  protected readonly bindingLines: readonly string[] = highlightLines(
    `<!-- app-navbar.component.html -->
<button suiButton (click)="navigation.collapsed.update(value => !value)">
  Collapse navigation
</button>
<button suiButton (click)="navigation.drawerOpen.set(true)">
  Open navigation
</button>

<!-- app-layout.component.html -->
<app-navbar />
<sui-drawer persistentAt="lg" [(open)]="navigation.drawerOpen">
  <main suiDrawerContent>…</main>
  <sui-sidebar
    [groups]="groups"
    [(collapsed)]="navigation.collapsed" />
</sui-drawer>`,
    'html',
  );
  protected readonly examples: Readonly<Record<'workspace', ExampleSource>> = {
    workspace: { html: workspaceHtml, typescript: textSource(workspaceTs) },
  };
}
