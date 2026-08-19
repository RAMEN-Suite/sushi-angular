import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Divider } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-divider-usage-example',
  imports: [Divider],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerUsageExample {}
