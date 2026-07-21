import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card, CardBody, CardTitle, Code, CodeLine, Status } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-status-page',
  imports: [Card, CardBody, CardTitle, Code, CodeLine, Status],
  templateUrl: './status.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusPage {}
