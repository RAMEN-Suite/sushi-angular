import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Indicator, IndicatorHorizontalPosition, IndicatorItem, IndicatorVerticalPosition } from '@sushi-kit/angular';

interface Position {
  readonly horizontal: IndicatorHorizontalPosition;
  readonly index: number;
  readonly label: string;
  readonly vertical: IndicatorVerticalPosition;
}

@Component({
  selector: 'pg-indicator-positions-example',
  imports: [Badge, Indicator, IndicatorItem],
  templateUrl: './positions.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndicatorPositionsExample {
  protected readonly positions: readonly Position[] = [
    { horizontal: 'start', index: 1, label: 'Top start', vertical: 'top' },
    { horizontal: 'center', index: 2, label: 'Top center', vertical: 'top' },
    { horizontal: 'end', index: 3, label: 'Top end', vertical: 'top' },
    { horizontal: 'start', index: 4, label: 'Middle start', vertical: 'middle' },
    { horizontal: 'center', index: 5, label: 'Middle center', vertical: 'middle' },
    { horizontal: 'end', index: 6, label: 'Middle end', vertical: 'middle' },
    { horizontal: 'start', index: 7, label: 'Bottom start', vertical: 'bottom' },
    { horizontal: 'center', index: 8, label: 'Bottom center', vertical: 'bottom' },
    { horizontal: 'end', index: 9, label: 'Bottom end', vertical: 'bottom' },
  ];
}
