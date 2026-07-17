import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Code,
  CodeButtonOffTemplate,
  CodeButtonOnTemplate,
  CodeButtonTemplate,
  CodeLine,
} from '@ramen-suite/sushi';
import { LucideCheck, LucideCopy } from '@lucide/angular';

@Component({
  selector: 'pg-code-page',
  imports: [
    Card,
    CardBody,
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
