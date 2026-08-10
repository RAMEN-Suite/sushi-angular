import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { Button, Toggle } from '@ramen-suite/sushi';

interface NotificationForm { notifications: boolean; }

@Component({ selector: 'pg-toggle-usage-example', imports: [FormField, Button, Toggle], templateUrl: './usage.example.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class ToggleUsageExample {
  protected readonly model: WritableSignal<NotificationForm> = signal<NotificationForm>({ notifications: true });
  protected readonly notificationForm: FieldTree<NotificationForm> = form(this.model);
  protected reset(): void { this.notificationForm().reset({ notifications: true }); }
}
