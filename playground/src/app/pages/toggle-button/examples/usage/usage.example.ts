import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { LucideCheck, LucideX } from '@lucide/angular';
import { Button, ToggleButton, ToggleButtonOffTemplate, ToggleButtonOnTemplate, ToggleButtonTemplate } from '@ramen-suite/sushi';

interface NotificationForm {
  notifications: boolean;
}

@Component({
  selector: 'pg-toggle-button-usage-example',
  imports: [
    FormField,
    Button,
    ToggleButton,
    ToggleButtonOffTemplate,
    ToggleButtonOnTemplate,
    ToggleButtonTemplate,
    LucideCheck,
    LucideX,
  ],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleButtonUsageExample {
  protected readonly favorite: WritableSignal<boolean> = signal(false);
  protected readonly custom: WritableSignal<boolean> = signal(false);
  protected readonly model: WritableSignal<NotificationForm> = signal<NotificationForm>({ notifications: true });
  protected readonly notificationForm: FieldTree<NotificationForm> = form(this.model);

  protected reset(): void {
    this.favorite.set(false);
    this.custom.set(false);
    this.notificationForm().reset({ notifications: true });
  }
}
