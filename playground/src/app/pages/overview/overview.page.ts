import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Badge, Button, Card, CardTitle, Divider, List, ListItemTemplate, Progress, Status } from '@ramen-suite/sushi';

interface CoverageGate {
  readonly label: string;
  readonly value: number;
}

interface QualityLayer {
  readonly label: string;
  readonly description: string;
  readonly detail: string;
}

interface DocumentationSection {
  readonly label: string;
  readonly description: string;
}

@Component({
  selector: 'pg-overview-page',
  imports: [Badge, Button, Card, CardTitle, Divider, List, ListItemTemplate, Progress, RouterLink, Status],
  templateUrl: './overview.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPage {
  protected readonly coverageGates: readonly CoverageGate[] = [
    { label: 'Statements', value: 80 },
    { label: 'Branches', value: 80 },
    { label: 'Functions', value: 70 },
    { label: 'Lines', value: 85 },
  ];

  protected readonly qualityLayers: readonly QualityLayer[] = [
    {
      label: 'Unit behavior',
      description: 'Vitest checks public inputs, outputs, state changes, and keyboard behavior.',
      detail: 'Vitest',
    },
    {
      label: 'Browser contracts',
      description: 'Playwright checks focus, overlays, responsive layouts, and scrolling in Chromium.',
      detail: 'Playwright',
    },
    {
      label: 'Release checks',
      description: 'Linting and production builds validate the library and its playground.',
      detail: 'Build + lint',
    },
  ];

  protected readonly documentationSections: readonly DocumentationSection[] = [
    { label: 'Examples', description: 'Complete Angular examples show the intended composition and interaction.' },
    {
      label: 'API reference',
      description: 'Inputs, outputs, directives, and template contexts are generated from the public source.',
    },
    { label: 'Styling', description: 'Theme roles and supported CSS custom properties document safe visual adjustments.' },
  ];
}
