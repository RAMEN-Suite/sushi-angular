import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Spinner, SpinnerSize, SpinnerType } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-spinner-usage-example',
  imports: [Spinner],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerUsageExample {
  protected readonly types: readonly SpinnerType[] = ['spinner', 'dots', 'ring', 'ball', 'bars', 'infinity'];
  protected readonly sizes: readonly SpinnerSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
}
