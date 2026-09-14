import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Chip } from '@sushi-kit/angular';

@Component({
  selector: 'pg-chip-basic-example',
  imports: [Chip],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipBasicExample {}
