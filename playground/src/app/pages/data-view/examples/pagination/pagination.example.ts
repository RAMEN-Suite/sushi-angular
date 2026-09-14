import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, DataView, DataViewHeaderTemplate, DataViewItemTemplate } from '@sushi-kit/angular';

interface Guide {
  readonly id: number;
  readonly title: string;
  readonly area: string;
  readonly readingTime: number;
}

@Component({
  selector: 'pg-data-view-pagination-example',
  imports: [Badge, Card, DataView, DataViewHeaderTemplate, DataViewItemTemplate],
  templateUrl: './pagination.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataViewPaginationExample {
  protected readonly guides: readonly Guide[] = Array.from({ length: 14 }, (_value: unknown, index: number): Guide => ({
    id: index + 1,
    title: `Design system guide ${index + 1}`,
    area: index % 2 === 0 ? 'Components' : 'Accessibility',
    readingTime: 4 + (index % 5),
  }));
}
