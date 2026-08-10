import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideCheck, LucideCopy } from '@lucide/angular';
import {
  Button,
  Card,
  CardTitle,
  Code,
  CodeButtonOffTemplate,
  CodeButtonOnTemplate,
  CodeButtonTemplate,
  CodeLine,
} from '@ramen-suite/sushi';

@Component({
  selector: 'pg-code-page',
  imports: [
    Card,
    CardTitle,
    CodeLine,
    Code,
    Code,
    CodeButtonOffTemplate,
    CodeButtonOnTemplate,
    CodeButtonTemplate,
    Button,
    LucideCheck,
    LucideCopy,
  ],
  templateUrl: './code.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodePage {}
