import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, InputSurface, InputSurfaceControl, Label } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-input-surface-content-example',
  imports: [Badge, InputSurface, InputSurfaceControl, Label],
  templateUrl: './content.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSurfaceContentExample {}
