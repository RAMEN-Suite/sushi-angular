import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Card, CardActions, CardBody, CardTitle, Code, CodeLine, Divider } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-card-page',
  imports: [Card, CardBody, CardTitle, CardActions, Button, Divider, CodeLine, Code, Code],
  templateUrl: './card.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPage {}
