import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LightboxTrigger } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-lightbox-settings-example',
  imports: [LightboxTrigger],
  templateUrl: './settings.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightboxSettingsExample {}
