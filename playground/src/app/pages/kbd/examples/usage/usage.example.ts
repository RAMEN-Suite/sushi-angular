import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Kbd, KbdSize } from '@sushi-kit/angular';

@Component({
  selector: 'pg-kbd-usage-example',
  imports: [Kbd],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KbdUsageExample {
  protected readonly sizes: readonly KbdSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
}
