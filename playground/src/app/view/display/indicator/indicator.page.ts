import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Button, Card, CardBody, CardTitle, Code, CodeLine, Indicator, IndicatorItem, Status } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-indicator-page',
  imports: [Badge, Button, Card, CardBody, CardTitle, Code, CodeLine, Indicator, IndicatorItem, Status],
  templateUrl: './indicator.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndicatorPage {}
