import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Pagination, PaginationSeverity, PaginationSize, PaginationVariant } from '@sushi-kit/angular';

interface PaginationStyle {
  readonly label: string;
  readonly size: PaginationSize;
  readonly severity: PaginationSeverity;
  readonly variant: PaginationVariant;
}

@Component({
  selector: 'pg-pagination-appearance-example',
  imports: [Pagination],
  templateUrl: './appearance.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationAppearanceExample {
  protected readonly styles: readonly PaginationStyle[] = [
    { label: 'Separate primary actions', size: 'md', severity: 'primary', variant: 'plain' },
    { label: 'Connected primary actions', size: 'md', severity: 'primary', variant: 'joined' },
    { label: 'Compact secondary actions', size: 'sm', severity: 'secondary', variant: 'plain' },
    { label: 'Large neutral group', size: 'lg', severity: 'neutral', variant: 'joined' },
  ];
}
