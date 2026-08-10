import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { MultiSelectBasicExample } from './examples/basic/basic.example';
import groupsHtml from './examples/groups/groups.example.html';
import * as groupsTs from './examples/groups/groups.example.ts' with { loader: 'text' };
import { MultiSelectGroupsExample } from './examples/groups/groups.example';
import selectedHtml from './examples/selected/selected.example.html';
import * as selectedTs from './examples/selected/selected.example.ts' with { loader: 'text' };
import { MultiSelectSelectedExample } from './examples/selected/selected.example';
import statesHtml from './examples/states/states.example.html';
import * as statesTs from './examples/states/states.example.ts' with { loader: 'text' };
import { MultiSelectStatesExample } from './examples/states/states.example';

@Component({
  selector: 'pg-multi-select-page',
  imports: [Badge, Card, CardTitle, ExampleCode, MultiSelectBasicExample, MultiSelectGroupsExample, MultiSelectSelectedExample, MultiSelectStatesExample],
  templateUrl: './multi-select.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectPage {
  protected readonly examples: Readonly<Record<'basic' | 'groups' | 'selected' | 'states', ExampleSource>> = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    groups: { html: groupsHtml, typescript: textSource(groupsTs) },
    selected: { html: selectedHtml, typescript: textSource(selectedTs) },
    states: { html: statesHtml, typescript: textSource(statesTs) },
  };
}
