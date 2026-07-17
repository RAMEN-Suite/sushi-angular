import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, Card, CardBody, CardTitle, Code, CodeLine, Divider } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-button-page',
  imports: [RouterLink, Button, Code, CodeLine, Divider, CardTitle, Card, CardBody, Code],
  templateUrl: './button.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPage {}
