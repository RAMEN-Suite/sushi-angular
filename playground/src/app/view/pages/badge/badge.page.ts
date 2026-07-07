import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SuiBadge, SuiButton, SuiCard, SuiCardBody, SuiCardTitle, SuiCode, SuiCodeLine, SuiDivider } from '@ramen-suite/sushi';

@Component({
  selector: 'app-badge-page',
  imports: [SuiBadge, SuiButton, SuiCode, SuiCodeLine, SuiCard, SuiCardBody, SuiCardTitle, SuiDivider, SuiCode],
  templateUrl: './badge.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgePage {}
