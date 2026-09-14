import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Tooltip } from '@sushi-kit/angular';
@Component({
  selector: 'pg-tooltip-usage-example',
  imports: [Button, Tooltip],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipUsageExample {}
