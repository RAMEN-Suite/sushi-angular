import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Avatar, Badge, Button, Indicator, IndicatorItem, Input, Status } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-indicator-basic-example',
  imports: [Avatar, Badge, Button, Indicator, IndicatorItem, Input, Status],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndicatorBasicExample {}
