import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SuiCard, SuiCardBody, SuiCardTitle, SuiCode, SuiCodeLine, SuiDivider } from '@ramen-suite/sushi';

@Component({
  selector: 'app-divider-page',
  imports: [SuiDivider, SuiCard, SuiCardBody, SuiCardTitle, SuiCode, SuiCodeLine],
  templateUrl: './divider.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerPage {}
