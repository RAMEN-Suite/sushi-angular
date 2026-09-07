import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import { DialogConfirmationExample } from './examples/confirmation/confirmation.example';
import confirmationHtml from './examples/confirmation/confirmation.example.html';
import * as confirmationTs from './examples/confirmation/confirmation.example.ts' with { loader: 'text' };
import { DialogControlledExample } from './examples/controlled/controlled.example';
import controlledHtml from './examples/controlled/controlled.example.html';
import * as controlledTs from './examples/controlled/controlled.example.ts' with { loader: 'text' };
import { DialogRequiredExample } from './examples/required/required.example';
import requiredHtml from './examples/required/required.example.html';
import * as requiredTs from './examples/required/required.example.ts' with { loader: 'text' };
import { DialogWorkspaceExample } from './examples/workspace/workspace.example';
import workspaceHtml from './examples/workspace/workspace.example.html';
import * as workspaceTs from './examples/workspace/workspace.example.ts' with { loader: 'text' };

@Component({
  selector: 'pg-dialog-page',
  imports: [
    Badge,
    Card,
    CardTitle,
    DialogConfirmationExample,
    DialogControlledExample,
    DialogRequiredExample,
    DialogWorkspaceExample,
    ExampleCode,
  ],
  templateUrl: './dialog.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogPage {
  protected readonly examples: Readonly<Record<'confirmation' | 'controlled' | 'required' | 'workspace', ExampleSource>> = {
    confirmation: { html: confirmationHtml, typescript: textSource(confirmationTs) },
    controlled: { html: controlledHtml, typescript: textSource(controlledTs) },
    required: { html: requiredHtml, typescript: textSource(requiredTs) },
    workspace: { html: workspaceHtml, typescript: textSource(workspaceTs) },
  };
}
