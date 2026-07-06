import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SuiBadge, SuiButton, SuiCard, SuiCardActions, SuiCardBody, SuiCardTitle, SuiDivider } from '@ramen-suite/sushi';

@Component({
  selector: 'app-card-page',
  imports: [SuiCard, SuiCardBody, SuiCardTitle, SuiCardActions, SuiButton, SuiBadge, SuiDivider],
  templateUrl: './card.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPage {}
