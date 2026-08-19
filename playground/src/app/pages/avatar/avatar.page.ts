import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { apiReference } from '../../generated/api-reference.generated';
import { ApiReference } from '../../shared/api-reference/api-reference.component';
import type { ApiReferenceData } from '../../shared/api-reference/api-reference.types';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import profilesHtml from './examples/profiles/profiles.example.html';
import * as profilesTs from './examples/profiles/profiles.example.ts' with { loader: 'text' };
import { AvatarProfilesExample } from './examples/profiles/profiles.example';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { AvatarUsageExample } from './examples/usage/usage.example';

@Component({
  selector: 'pg-avatar-page',
  imports: [ApiReference, AvatarProfilesExample, AvatarUsageExample, Badge, Card, CardTitle, ExampleCode],
  templateUrl: './avatar.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarPage {
  protected readonly api: readonly ApiReferenceData[] = [apiReference.Avatar, apiReference.AvatarGroup];
  protected readonly examples: Readonly<Record<'profiles' | 'usage', ExampleSource>> = {
    profiles: { html: profilesHtml, typescript: textSource(profilesTs) },
    usage: { html: usageHtml, typescript: textSource(usageTs) },
  };
}
