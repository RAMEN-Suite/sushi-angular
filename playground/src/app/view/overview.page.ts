import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SuiCard, SuiCardBody, SuiCardTitle } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-home-page',
  imports: [RouterLink, SuiCard, SuiCardBody, SuiCardTitle],
  templateUrl: './overview.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPage {}
