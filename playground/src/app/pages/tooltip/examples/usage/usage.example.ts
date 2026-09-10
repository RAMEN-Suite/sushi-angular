import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Tooltip } from '@ramen-suite/sushi';
@Component({
  selector: 'pg-tooltip-usage-example',
  imports: [Button, Tooltip],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipUsageExample {}
