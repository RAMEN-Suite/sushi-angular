import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Card, CardTitle, Code, CodeLine, Input, Join, JoinItem } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-join-page',
  imports: [Button, Card, CardTitle, Code, CodeLine, Input, Join, JoinItem],
  templateUrl: './join.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinPage {}
