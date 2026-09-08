import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import { SidebarSizesExample } from './examples/sizes/sizes.example';
import sizesHtml from './examples/sizes/sizes.example.html';
import * as sizesTs from './examples/sizes/sizes.example.ts' with { loader: 'text' };
import { SidebarWorkspaceExample } from './examples/workspace/workspace.example';
import workspaceHtml from './examples/workspace/workspace.example.html';
import * as workspaceTs from './examples/workspace/workspace.example.ts' with { loader: 'text' };
import { SidebarDrawerExample } from './examples/drawer/drawer.example';
import drawerHtml from './examples/drawer/drawer.example.html';
import * as drawerTs from './examples/drawer/drawer.example.ts' with { loader: 'text' };

@Component({
  selector: 'pg-sidebar-page',
  imports: [Badge, ExampleCode, ExamplePreview, SidebarDrawerExample, SidebarSizesExample, SidebarWorkspaceExample],
  templateUrl: './sidebar.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarPage {
  protected readonly examples: Readonly<Record<'drawer' | 'sizes' | 'workspace', ExampleSource>> = {
    drawer: { html: drawerHtml, typescript: textSource(drawerTs) },
    sizes: { html: sizesHtml, typescript: textSource(sizesTs) },
    workspace: { html: workspaceHtml, typescript: textSource(workspaceTs) },
  };
}
