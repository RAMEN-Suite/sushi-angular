import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SuiButton, SuiCard, SuiCardBody, SuiCardTitle, SuiCode, SuiCodeLine, SuiDivider } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-button-page',
  imports: [RouterLink, SuiButton, SuiCode, SuiCodeLine, SuiDivider, SuiCardTitle, SuiCard, SuiCardBody, SuiCode],
  templateUrl: './button.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPage {}
