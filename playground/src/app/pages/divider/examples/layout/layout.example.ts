import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Divider } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-divider-layout-example',
  imports: [Divider],
  templateUrl: './layout.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerLayoutExample {}
