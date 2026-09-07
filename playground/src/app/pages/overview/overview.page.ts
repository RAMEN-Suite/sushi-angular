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

interface ContributionStep {
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
      description: 'Vitest exercises every public component family through Angular hosts.',
      detail: 'Vitest',
    },
    {
      label: 'Browser contracts',
      description: 'Playwright protects keyboard, overlay, scrolling, and responsive behavior.',
      detail: 'Playwright',
    },
    {
      label: 'Release checks',
      description: 'Linting, generated references, and both production builds guard every handoff.',
      detail: 'Build + lint',
    },
  ];

  protected readonly contributionSteps: readonly ContributionStep[] = [
    { label: 'Shape the API', description: 'Start from native semantics and the smallest useful public contract.' },
    { label: 'Build the behavior', description: 'Compose Angular and existing SUSHI primitives before adding custom UI.' },
    { label: 'Teach by example', description: 'Ship copyable examples together with API and styling references.' },
    { label: 'Protect the contract', description: 'Cover observable behavior, accessibility, and browser-only interactions.' },
  ];
}
