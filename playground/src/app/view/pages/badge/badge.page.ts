import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SuiBadge } from '@ramen-suite/sushi';

@Component({
  selector: 'app-badge-page',
  imports: [SuiBadge],
  templateUrl: './badge.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgePage {}
