import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import profilesHtml from './examples/profiles/profiles.example.html';
import * as profilesTs from './examples/profiles/profiles.example.ts' with { loader: 'text' };
import { AvatarProfilesExample } from './examples/profiles/profiles.example';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { AvatarUsageExample } from './examples/usage/usage.example';

@Component({
  selector: 'pg-avatar-page',
  imports: [AvatarProfilesExample, AvatarUsageExample, Badge, ExampleCode, ExamplePreview],
  templateUrl: './avatar.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarPage {
  protected readonly examples: Readonly<Record<'profiles' | 'usage', ExampleSource>> = {
    profiles: { html: profilesHtml, typescript: textSource(profilesTs) },
    usage: { html: usageHtml, typescript: textSource(usageTs) },
  };
}
