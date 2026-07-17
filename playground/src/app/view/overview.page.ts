import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card, CardBody, CardTitle } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-home-page',
  imports: [RouterLink, Card, CardBody, CardTitle],
  templateUrl: './overview.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPage {}
