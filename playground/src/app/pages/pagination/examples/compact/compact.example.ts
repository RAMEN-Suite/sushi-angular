import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Card, Pagination, PaginationLabels } from '@sushi-kit/angular';

@Component({
  selector: 'pg-pagination-compact-example',
  imports: [Card, Pagination],
  templateUrl: './compact.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationCompactExample {
  protected readonly page: WritableSignal<number> = signal<number>(8);
  protected readonly labels: PaginationLabels = {
    first: 'Go to first result page',
    previous: 'Go to previous result page',
    next: 'Go to next result page',
    last: 'Go to last result page',
    pageInput: 'Edit current result page',
    pageSize: 'Results per page',
    page: (page: number): string => `Go to result page ${page}`,
  };
}
