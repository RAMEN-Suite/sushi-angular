import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SuiCard, SuiCardBody, SuiCardTitle, SuiCode, SuiCodeCopiedIcon, SuiCodeCopyIcon, SuiCodeLine } from '@ramen-suite/sushi';

@Component({
  selector: 'app-code-page',
  imports: [SuiCard, SuiCardBody, SuiCardTitle, SuiCodeLine, SuiCode, SuiCode, SuiCodeCopyIcon, SuiCodeCopiedIcon],
  templateUrl: './code.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodePage {}
