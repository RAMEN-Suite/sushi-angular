import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { Label, OrderList, OrderListOption } from '@sushi-kit/angular';

interface WorkflowForm {
  steps: readonly OrderListOption[];
}

@Component({
  selector: 'pg-order-list-basic-example',
  imports: [FormField, Label, OrderList],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListBasicExample {
  private readonly initialSteps: readonly OrderListOption[] = [
    { label: 'Collect requirements', value: 'requirements' },
    { label: 'Create prototype', value: 'prototype' },
    { label: 'Run accessibility review', value: 'accessibility' },
    { label: 'Publish release', value: 'release' },
  ];

  protected readonly model: WritableSignal<WorkflowForm> = signal<WorkflowForm>({ steps: this.initialSteps });
  protected readonly workflowForm: FieldTree<WorkflowForm> = form(this.model);
}
