import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideDownload, LucideSearch, LucideSettings, LucideTrash2 } from '@lucide/angular';
import { Button } from '@sushi-kit/angular';

@Component({
  selector: 'pg-icon-usage-example',
  imports: [Button, LucideDownload, LucideSearch, LucideSettings, LucideTrash2],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconUsageExample {}
