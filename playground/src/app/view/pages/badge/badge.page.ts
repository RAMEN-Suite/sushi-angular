import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SuiBadge, SuiButton } from '@ramen-suite/sushi';

@Component({
  selector: 'app-badge-page',
  imports: [SuiBadge, SuiButton],
  templateUrl: './badge.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgePage {}
