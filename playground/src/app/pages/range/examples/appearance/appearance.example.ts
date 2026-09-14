import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Fieldset, FieldsetLegend, Label, Range } from '@sushi-kit/angular';

type RangeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type RangeColor = 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'pg-range-appearance-example',
  imports: [Badge, Fieldset, FieldsetLegend, Label, Range],
  templateUrl: './appearance.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeAppearanceExample {
  protected readonly sizes: readonly RangeSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  protected readonly colors: readonly RangeColor[] = [
    'primary',
    'secondary',
    'accent',
    'neutral',
    'info',
    'success',
    'warning',
    'error',
  ];
}
