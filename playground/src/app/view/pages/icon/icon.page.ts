import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SuiButton, SuiCard, SuiCardBody, SuiCardTitle, SuiCode, SuiCodeLine } from '@ramen-suite/sushi';
import { LucideDownload, LucidePlus, LucideSearch, LucideSettings, LucideTrash2 } from '@lucide/angular';

@Component({
  selector: 'app-icon-page',
  imports: [
    SuiCard,
    SuiCardBody,
    SuiCardTitle,
    SuiCodeLine,
    SuiCode,
    SuiCode,
    LucideSearch,
    LucideTrash2,
    LucideSettings,
    LucideDownload,
    LucidePlus,
    SuiButton,
  ],
  templateUrl: './icon.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconPage {}
