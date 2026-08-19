import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { apiReference } from '../../generated/api-reference.generated';
import { ApiReference } from '../../shared/api-reference/api-reference.component';
import type { ApiReferenceData } from '../../shared/api-reference/api-reference.types';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { TabsBasicExample } from './examples/basic/basic.example';
import behaviorHtml from './examples/behavior/behavior.example.html';
import * as behaviorTs from './examples/behavior/behavior.example.ts' with { loader: 'text' };
import { TabsBehaviorExample } from './examples/behavior/behavior.example';
import workspaceHtml from './examples/workspace/workspace.example.html';
import * as workspaceTs from './examples/workspace/workspace.example.ts' with { loader: 'text' };
import { TabsWorkspaceExample } from './examples/workspace/workspace.example';

@Component({
  selector: 'pg-tabs-page',
  imports: [ApiReference, Badge, Card, CardTitle, ExampleCode, TabsBasicExample, TabsBehaviorExample, TabsWorkspaceExample],
  templateUrl: './tabs.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsPage {
  protected readonly api: readonly ApiReferenceData[] = [apiReference.Tabs];
  protected readonly examples: Readonly<Record<'basic' | 'behavior' | 'workspace', ExampleSource>> = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    behavior: { html: behaviorHtml, typescript: textSource(behaviorTs) },
    workspace: { html: workspaceHtml, typescript: textSource(workspaceTs) },
  };
}
