import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SuiButton, SuiDivider } from '@ramen-suite/sushi';

@Component({
  selector: 'app-divider-page',
  imports: [SuiDivider, SuiButton],
  templateUrl: './divider.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerPage {}
