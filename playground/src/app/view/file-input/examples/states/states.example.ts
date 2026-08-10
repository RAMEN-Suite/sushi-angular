import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FileInput } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-file-input-states-example',
  imports: [FileInput],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInputStatesExample {}
