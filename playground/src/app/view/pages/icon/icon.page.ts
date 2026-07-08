import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SuiButton, SuiCard, SuiCardBody, SuiCardTitle, SuiCodeLine } from '@ramen-suite/sushi';
import { LucideDownload, LucidePlus, LucideSearch, LucideSettings, LucideTrash2 } from '@lucide/angular';
import { SuiCode } from '../../../../../../sushi/src/lib/code';

@Component({
  selector: 'app-icon-page',
  imports: [
    SuiCard,
    SuiCardBody,
    SuiCardTitle,
    SuiCodeLine,
    LucideSearch,
    LucideTrash2,
    LucideSettings,
    LucideDownload,
    LucidePlus,
    SuiButton,
    SuiCode,
  ],
  templateUrl: './icon.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconPage {}
