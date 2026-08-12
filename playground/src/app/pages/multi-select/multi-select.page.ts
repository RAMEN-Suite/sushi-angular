import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { apiReference } from '../../generated/api-reference.generated';
import { ApiReference } from '../../shared/api-reference/api-reference.component';
import type { ApiReferenceData } from '../../shared/api-reference/api-reference.types';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { MultiSelectBasicExample } from './examples/basic/basic.example';
import behaviorHtml from './examples/behavior/behavior.example.html';
import * as behaviorTs from './examples/behavior/behavior.example.ts' with { loader: 'text' };
import { MultiSelectBehaviorExample } from './examples/behavior/behavior.example';
import categorySelectionHtml from './examples/category-selection/category-selection.example.html';
import * as categorySelectionTs from './examples/category-selection/category-selection.example.ts' with { loader: 'text' };
import { MultiSelectCategorySelectionExample } from './examples/category-selection/category-selection.example';
import groupsHtml from './examples/groups/groups.example.html';
import * as groupsTs from './examples/groups/groups.example.ts' with { loader: 'text' };
import { MultiSelectGroupsExample } from './examples/groups/groups.example';
import selectedHtml from './examples/selected/selected.example.html';
import * as selectedTs from './examples/selected/selected.example.ts' with { loader: 'text' };
import { MultiSelectSelectedExample } from './examples/selected/selected.example';
import statesHtml from './examples/states/states.example.html';
import * as statesTs from './examples/states/states.example.ts' with { loader: 'text' };
import { MultiSelectStatesExample } from './examples/states/states.example';
import templatesHtml from './examples/templates/templates.example.html';
import * as templatesTs from './examples/templates/templates.example.ts' with { loader: 'text' };
import { MultiSelectTemplatesExample } from './examples/templates/templates.example';

@Component({
  selector: 'pg-multi-select-page',
  imports: [
    Badge,
    Card,
    CardTitle,
    ApiReference,
    ExampleCode,
    MultiSelectBasicExample,
    MultiSelectBehaviorExample,
    MultiSelectCategorySelectionExample,
    MultiSelectGroupsExample,
    MultiSelectSelectedExample,
    MultiSelectStatesExample,
    MultiSelectTemplatesExample,
  ],
  templateUrl: './multi-select.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectPage {
  protected readonly api: ApiReferenceData = apiReference.MultiSelect;

  protected readonly examples: Readonly<
    Record<'basic' | 'behavior' | 'categorySelection' | 'groups' | 'selected' | 'states' | 'templates', ExampleSource>
  > = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    behavior: { html: behaviorHtml, typescript: textSource(behaviorTs) },
    categorySelection: { html: categorySelectionHtml, typescript: textSource(categorySelectionTs) },
    groups: { html: groupsHtml, typescript: textSource(groupsTs) },
    selected: { html: selectedHtml, typescript: textSource(selectedTs) },
    states: { html: statesHtml, typescript: textSource(statesTs) },
    templates: { html: templatesHtml, typescript: textSource(templatesTs) },
  };
}
