import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SuiButton, SuiCard, SuiCardBody, SuiCardTitle, SuiCode, SuiCodeLine, SuiDivider } from '@ramen-suite/sushi';

@Component({
  selector: 'app-button-page',
  imports: [RouterLink, SuiButton, SuiCode, SuiCodeLine, SuiDivider, SuiCardTitle, SuiCard, SuiCardBody],
  templateUrl: './button.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPage {}
