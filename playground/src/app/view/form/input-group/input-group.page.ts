import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Card, CardTitle, Code, CodeLine, Input, InputGroup, InputGroupAddon, JoinItem } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-input-group-page',
  imports: [Button, Card, CardTitle, Code, CodeLine, Input, InputGroup, InputGroupAddon, JoinItem],
  templateUrl: './input-group.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputGroupPage {}
