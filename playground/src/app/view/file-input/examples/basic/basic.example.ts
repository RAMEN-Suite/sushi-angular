import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FileInput } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-file-input-basic-example',
  imports: [FileInput],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInputBasicExample {}
