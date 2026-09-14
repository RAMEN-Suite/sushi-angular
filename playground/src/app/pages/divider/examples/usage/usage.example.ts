import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Divider } from '@sushi-kit/angular';

@Component({
  selector: 'pg-divider-usage-example',
  imports: [Divider],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerUsageExample {}
