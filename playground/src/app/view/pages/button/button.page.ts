import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SuiButton } from '@ramen-suite/sushi';

@Component({
  selector: 'app-button-page',
  imports: [RouterLink, SuiButton],
  templateUrl: './button.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPage {}
