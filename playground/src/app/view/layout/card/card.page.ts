import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Card, CardTitle, CardActions, CardMedia, Code, CodeLine, Divider } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-card-page',
  imports: [Card, CardTitle, CardActions, CardMedia, Button, Divider, CodeLine, Code],
  templateUrl: './card.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPage {}
