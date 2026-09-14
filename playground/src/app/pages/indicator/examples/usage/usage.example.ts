import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Button, Card, CardTitle, Indicator, IndicatorItem } from '@sushi-kit/angular';

@Component({
  selector: 'pg-indicator-usage-example',
  imports: [Badge, Button, Card, CardTitle, Indicator, IndicatorItem],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndicatorUsageExample {}
