import { ChangeDetectionStrategy, Component, computed, signal, Signal, WritableSignal } from '@angular/core';
import { Badge, Card, CardTitle, Divider, List, ListItemTemplate, Pagination } from '@ramen-suite/sushi';

interface Release {
  readonly code: string;
  readonly id: number;
  readonly name: string;
  readonly channel: string;
  readonly target: string;
}

@Component({
  selector: 'pg-pagination-basic-example',
  imports: [Badge, Card, CardTitle, Divider, List, ListItemTemplate, Pagination],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationBasicExample {
  protected readonly page: WritableSignal<number> = signal<number>(1);
  protected readonly pageSize: WritableSignal<number> = signal<number>(3);
  protected readonly releases: readonly Release[] = [
    { id: 1, code: 'R-241', name: 'Navigation foundations', channel: 'Stable', target: 'Sep 12' },
    { id: 2, code: 'R-242', name: 'Accessible overlays', channel: 'Stable', target: 'Sep 18' },
    { id: 3, code: 'R-243', name: 'Signal form controls', channel: 'Stable', target: 'Sep 25' },
    { id: 4, code: 'R-244', name: 'Selection patterns', channel: 'Preview', target: 'Oct 2' },
    { id: 5, code: 'R-245', name: 'Data presentation', channel: 'Preview', target: 'Oct 9' },
    { id: 6, code: 'R-246', name: 'Responsive layouts', channel: 'Preview', target: 'Oct 16' },
    { id: 7, code: 'R-247', name: 'Application shell', channel: 'Planned', target: 'Oct 23' },
    { id: 8, code: 'R-248', name: 'Table composition', channel: 'Planned', target: 'Oct 30' },
  ];
  protected readonly visibleReleases: Signal<readonly Release[]> = computed(() => {
    const start: number = (this.page() - 1) * this.pageSize();
    return this.releases.slice(start, start + this.pageSize());
  });
}
