import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideEllipsis, LucidePlus } from '@lucide/angular';
import { Button, ButtonSeverity, ButtonSize, ButtonVariant } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-button-appearance-example',
  imports: [Button, LucideEllipsis, LucidePlus],
  templateUrl: './appearance.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonAppearanceExample {
  protected readonly severities: readonly ButtonSeverity[] = [
    'primary',
    'secondary',
    'accent',
    'neutral',
    'success',
    'warning',
    'error',
  ];
  protected readonly variants: readonly ButtonVariant[] = ['outlined', 'soft', 'dash', 'text', 'link'];
  protected readonly sizes: readonly ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
}
