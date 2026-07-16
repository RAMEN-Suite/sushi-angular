import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SuiButton,
  SuiCard,
  SuiCardBody,
  SuiCardTitle,
  SuiCode,
  SuiCodeCopiedIcon,
  SuiCodeCopyButton,
  SuiCodeCopyIcon,
  SuiCodeLine,
} from '@ramen-suite/sushi';
import { LucideCheck, LucideCopy } from '@lucide/angular';

@Component({
  selector: 'pg-code-page',
  imports: [
    SuiCard,
    SuiCardBody,
    SuiCardTitle,
    SuiCodeLine,
    SuiCode,
    SuiCode,
    SuiCodeCopyIcon,
    SuiCodeCopiedIcon,
    SuiCodeCopyButton,
    SuiButton,
    LucideCheck,
    LucideCopy,
  ],
  templateUrl: './code.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodePage {}
