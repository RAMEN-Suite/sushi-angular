import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import controlledHtml from './examples/controlled/controlled.example.html';
import * as controlledTs from './examples/controlled/controlled.example.ts' with { loader: 'text' };
import { FieldsetControlledExample } from './examples/controlled/controlled.example';
import preferencesHtml from './examples/preferences/preferences.example.html';
import * as preferencesTs from './examples/preferences/preferences.example.ts' with { loader: 'text' };
import { FieldsetPreferencesExample } from './examples/preferences/preferences.example';
import togglesHtml from './examples/toggles/toggles.example.html';
import * as togglesTs from './examples/toggles/toggles.example.ts' with { loader: 'text' };
import { FieldsetTogglesExample } from './examples/toggles/toggles.example';

@Component({
  selector: 'pg-fieldset-page',
  imports: [Badge, ExampleCode, ExamplePreview, FieldsetControlledExample, FieldsetPreferencesExample, FieldsetTogglesExample],
  templateUrl: './fieldset.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsetPage {
  protected readonly examples: Readonly<Record<'controlled' | 'preferences' | 'toggles', ExampleSource>> = {
    controlled: { html: controlledHtml, typescript: textSource(controlledTs) },
    preferences: { html: preferencesHtml, typescript: textSource(preferencesTs) },
    toggles: { html: togglesHtml, typescript: textSource(togglesTs) },
  };
}
