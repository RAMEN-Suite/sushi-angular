import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LightboxTrigger } from '@sushi-kit/angular';

@Component({
  selector: 'pg-lightbox-usage-example',
  imports: [LightboxTrigger, NgOptimizedImage],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightboxUsageExample {}
