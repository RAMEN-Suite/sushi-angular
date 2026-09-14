import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FileInput, Label } from '@sushi-kit/angular';

@Component({
  selector: 'pg-file-input-states-example',
  imports: [FileInput, Label],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInputStatesExample {}
