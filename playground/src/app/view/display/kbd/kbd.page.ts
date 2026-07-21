import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card, CardBody, CardTitle, Code, CodeLine, Kbd } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-kbd-page',
  imports: [Card, CardBody, CardTitle, Code, CodeLine, Kbd],
  templateUrl: './kbd.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KbdPage {}
