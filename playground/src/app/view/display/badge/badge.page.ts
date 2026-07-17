import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Button, Card, CardBody, CardTitle, Code, CodeLine, Divider } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-badge-page',
  imports: [Badge, Button, Code, CodeLine, Card, CardBody, CardTitle, Divider, Code],
  templateUrl: './badge.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgePage {}
