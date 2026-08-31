import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, DataView, DataViewItemTemplate } from '@ramen-suite/sushi';
import { LucideCircleCheck, LucideGitPullRequest, LucidePackage } from '@lucide/angular';

interface Activity {
  readonly id: number;
  readonly title: string;
  readonly detail: string;
  readonly type: 'release' | 'review' | 'complete';
  readonly time: string;
}

@Component({
  selector: 'pg-data-view-basic-example',
  imports: [Badge, Card, DataView, DataViewItemTemplate, LucideCircleCheck, LucideGitPullRequest, LucidePackage],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataViewBasicExample {
  protected readonly activities: readonly Activity[] = [
    { id: 1, title: 'Version 2.4 published', detail: 'Package artifacts are available.', type: 'release', time: '8 min' },
    { id: 2, title: 'Accessibility review opened', detail: 'Three components need approval.', type: 'review', time: '42 min' },
    { id: 3, title: 'Migration guide completed', detail: 'The Angular 22 notes are ready.', type: 'complete', time: '2 h' },
  ];
}
