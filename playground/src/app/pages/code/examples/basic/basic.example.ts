import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Code, CodeLine } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-code-basic-example',
  imports: [Code, CodeLine],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBasicExample {}
