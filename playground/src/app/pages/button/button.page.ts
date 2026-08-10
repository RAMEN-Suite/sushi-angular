import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, Card, CardTitle, Code, CodeLine, Divider, Spinner } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-button-page',
  imports: [RouterLink, Button, Code, CodeLine, Divider, Card, CardTitle, Code, Spinner],
  templateUrl: './button.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPage {}
