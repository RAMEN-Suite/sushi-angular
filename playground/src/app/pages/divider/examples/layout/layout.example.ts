import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card, Divider } from '@sushi-kit/angular';

@Component({
  selector: 'pg-divider-layout-example',
  imports: [Card, Divider],
  templateUrl: './layout.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerLayoutExample {}
