import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FileInput, Label } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-file-input-states-example',
  imports: [FileInput, Label],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInputStatesExample {}
