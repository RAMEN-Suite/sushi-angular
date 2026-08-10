import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card, CardTitle, Code, CodeLine, Kbd } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-kbd-page',
  imports: [Card, CardTitle, Code, CodeLine, Kbd],
  templateUrl: './kbd.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KbdPage {}
