import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SuiButton,
  SuiCard,
  SuiCardActions,
  SuiCardBody,
  SuiCardTitle,
  SuiCode,
  SuiCodeLine,
  SuiDivider,
} from '@ramen-suite/sushi';

@Component({
  selector: 'pg-card-page',
  imports: [SuiCard, SuiCardBody, SuiCardTitle, SuiCardActions, SuiButton, SuiDivider, SuiCodeLine, SuiCode, SuiCode],
  templateUrl: './card.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPage {}
