import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideDownload, LucideSearch, LucideSettings, LucideTrash } from '@lucide/angular';
import { Button } from '@sushi-kit/angular';

@Component({
  selector: 'pg-icon-usage-example',
  imports: [Button, LucideDownload, LucideSearch, LucideSettings, LucideTrash],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconUsageExample {}
