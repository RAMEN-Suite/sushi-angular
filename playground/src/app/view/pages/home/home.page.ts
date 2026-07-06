import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SuiCard, SuiCardBody, SuiCardTitle } from '@ramen-suite/sushi';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, SuiCard, SuiCardBody, SuiCardTitle],
  templateUrl: './home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
