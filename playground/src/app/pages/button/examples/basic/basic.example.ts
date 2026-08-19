import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-button-basic-example',
  imports: [RouterLink, Button],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonBasicExample {}
