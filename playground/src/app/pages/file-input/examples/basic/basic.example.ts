import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FileInput, Label } from '@sushi-kit/angular';

@Component({
  selector: 'pg-file-input-basic-example',
  imports: [FileInput, Label],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInputBasicExample {}
