import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import asyncHtml from './examples/async/async.example.html';
import * as asyncTs from './examples/async/async.example.ts' with { loader: 'text' };
import { AutocompleteAsyncExample } from './examples/async/async.example';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { AutocompleteBasicExample } from './examples/basic/basic.example';
import filteringHtml from './examples/filtering/filtering.example.html';
import * as filteringTs from './examples/filtering/filtering.example.ts' with { loader: 'text' };
import { AutocompleteFilteringExample } from './examples/filtering/filtering.example';
import statesHtml from './examples/states/states.example.html';
import * as statesTs from './examples/states/states.example.ts' with { loader: 'text' };
import { AutocompleteStatesExample } from './examples/states/states.example';

@Component({
  selector: 'pg-autocomplete-page',
  imports: [
    Badge,
    ExampleCode,
    ExamplePreview,
    AutocompleteAsyncExample,
    AutocompleteBasicExample,
    AutocompleteFilteringExample,
    AutocompleteStatesExample,
  ],
  templateUrl: './autocomplete.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompletePage {
  protected readonly examples: Readonly<Record<'async' | 'basic' | 'filtering' | 'states', ExampleSource>> = {
    async: { html: asyncHtml, typescript: textSource(asyncTs) },
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    filtering: { html: filteringHtml, typescript: textSource(filteringTs) },
    states: { html: statesHtml, typescript: textSource(statesTs) },
  };
}
