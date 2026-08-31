import { ChangeDetectionStrategy, Component, computed, signal, Signal, WritableSignal } from '@angular/core';
import { Badge, List, ListItemTemplate, Pagination } from '@ramen-suite/sushi';

interface Release {
  readonly id: number;
  readonly name: string;
  readonly channel: string;
}

@Component({
  selector: 'pg-pagination-basic-example',
  imports: [Badge, List, ListItemTemplate, Pagination],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationBasicExample {
  protected readonly page: WritableSignal<number> = signal<number>(1);
  protected readonly pageSize: WritableSignal<number> = signal<number>(3);
  protected readonly releases: readonly Release[] = [
    { id: 1, name: 'Navigation foundations', channel: 'Stable' },
    { id: 2, name: 'Accessible overlays', channel: 'Stable' },
    { id: 3, name: 'Signal form controls', channel: 'Stable' },
    { id: 4, name: 'Selection patterns', channel: 'Preview' },
    { id: 5, name: 'Data presentation', channel: 'Preview' },
    { id: 6, name: 'Responsive layouts', channel: 'Preview' },
    { id: 7, name: 'Application shell', channel: 'Planned' },
    { id: 8, name: 'Table composition', channel: 'Planned' },
  ];
  protected readonly visibleReleases: Signal<readonly Release[]> = computed(() => {
    const start: number = (this.page() - 1) * this.pageSize();
    return this.releases.slice(start, start + this.pageSize());
  });
}
