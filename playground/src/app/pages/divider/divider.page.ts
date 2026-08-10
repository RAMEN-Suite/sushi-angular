import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card, CardTitle, Code, CodeLine, Divider } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-divider-page',
  imports: [Divider, Card, CardTitle, Code, CodeLine, Code],
  templateUrl: './divider.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerPage {}
