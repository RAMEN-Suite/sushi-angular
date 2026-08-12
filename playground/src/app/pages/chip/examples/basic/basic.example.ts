import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Chip } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-chip-basic-example',
  imports: [Chip],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipBasicExample {}
