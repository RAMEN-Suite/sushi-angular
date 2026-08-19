import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Status } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-status-usage-example',
  imports: [Status],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusUsageExample {}
