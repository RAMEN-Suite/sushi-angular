import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Pagination, PaginationSeverity, PaginationSize } from '@ramen-suite/sushi';

interface PaginationStyle {
  readonly label: string;
  readonly size: PaginationSize;
  readonly severity: PaginationSeverity;
}

@Component({
  selector: 'pg-pagination-appearance-example',
  imports: [Pagination],
  templateUrl: './appearance.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationAppearanceExample {
  protected readonly styles: readonly PaginationStyle[] = [
    { label: 'Compact secondary navigation', size: 'sm', severity: 'secondary' },
    { label: 'Default neutral navigation', size: 'md', severity: 'neutral' },
    { label: 'Prominent primary navigation', size: 'lg', severity: 'primary' },
  ];
}
