import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SuiDivider } from '@ramen-suite/sushi';

@Component({
  selector: 'app-button-page',
  imports: [SuiDivider],
  templateUrl: './divider.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerPage {}
