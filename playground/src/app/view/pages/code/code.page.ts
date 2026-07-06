import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SuiCard, SuiCardBody, SuiCardTitle, SuiCode, SuiCodeLine } from '@ramen-suite/sushi';

@Component({
  selector: 'app-code-page',
  imports: [SuiCard, SuiCardBody, SuiCardTitle, SuiCodeLine, SuiCode],
  templateUrl: './code.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodePage {}
