import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FileDrop } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-file-drop-states-example',
  imports: [FileDrop],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDropStatesExample {}
