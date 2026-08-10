import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Card, CardTitle, Code, CodeLine } from '@ramen-suite/sushi';
import { LucideDownload, LucidePlus, LucideSearch, LucideSettings, LucideTrash2 } from '@lucide/angular';

@Component({
  selector: 'pg-icon-page',
  imports: [Card, CardTitle, CodeLine, LucideSearch, LucideTrash2, LucideSettings, LucideDownload, LucidePlus, Button, Code],
  templateUrl: './icon.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconPage {}
