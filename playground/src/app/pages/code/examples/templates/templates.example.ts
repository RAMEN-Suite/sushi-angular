import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideCheck, LucideCopy } from '@lucide/angular';
import { Button, Code, CodeButtonOffTemplate, CodeButtonOnTemplate, CodeButtonTemplate, CodeLine } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-code-templates-example',
  imports: [Button, Code, CodeButtonOffTemplate, CodeButtonOnTemplate, CodeButtonTemplate, CodeLine, LucideCheck, LucideCopy],
  templateUrl: './templates.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeTemplatesExample {}
