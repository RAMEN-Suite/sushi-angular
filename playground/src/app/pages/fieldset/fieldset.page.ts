import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { apiReference } from '../../generated/api-reference.generated';
import { ApiReference } from '../../shared/api-reference/api-reference.component';
import type { ApiReferenceData } from '../../shared/api-reference/api-reference.types';
import { ExampleCode } from '../../shared/example-code/example-code.component';
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
  imports: [
    Badge,
    Card,
    CardTitle,
    ApiReference,
    ExampleCode,
    FieldsetControlledExample,
    FieldsetPreferencesExample,
    FieldsetTogglesExample,
  ],
  templateUrl: './fieldset.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsetPage {
  protected readonly api: readonly ApiReferenceData[] = [
    apiReference.Fieldset,
    apiReference.FieldsetLegend,
    apiReference.FieldsetContent,
    apiReference.FieldsetToggle,
  ];
  protected readonly examples: Readonly<Record<'controlled' | 'preferences' | 'toggles', ExampleSource>> = {
    controlled: { html: controlledHtml, typescript: textSource(controlledTs) },
    preferences: { html: preferencesHtml, typescript: textSource(preferencesTs) },
    toggles: { html: togglesHtml, typescript: textSource(togglesTs) },
  };
}
