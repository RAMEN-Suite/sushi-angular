import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideCheck, LucideX } from '@lucide/angular';
import {
  SuiButton,
  SuiCard,
  SuiCardBody,
  SuiCardTitle,
  SuiCode,
  SuiCodeLine,
  SuiDivider,
  SuiToggleButton,
  SuiToggleButtonOffTemplate,
  SuiToggleButtonOnTemplate,
  SuiToggleButtonTemplate,
} from '@ramen-suite/sushi';

@Component({
  selector: 'pg-toggle-button-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LucideCheck,
    LucideX,
    SuiButton,
    SuiCard,
    SuiCardBody,
    SuiCardTitle,
    SuiCode,
    SuiCodeLine,
    SuiDivider,
    SuiToggleButton,
    SuiToggleButtonOffTemplate,
    SuiToggleButtonOnTemplate,
    SuiToggleButtonTemplate,
  ],
  templateUrl: './toggle-button.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleButtonPage {
  protected readonly isEnabled: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly isFavorite: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly isSubscribed: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly hasCustomButton: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly notificationControl: FormControl<boolean> = new FormControl<boolean>(true, { nonNullable: true });

  protected handleReset(): void {
    this.isEnabled.set(false);
    this.isFavorite.set(false);
    this.isSubscribed.set(true);
    this.hasCustomButton.set(false);
    this.notificationControl.reset(true);
  }
}
