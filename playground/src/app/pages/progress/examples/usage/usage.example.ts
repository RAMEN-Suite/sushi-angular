import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Button, Progress } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-progress-usage-example',
  imports: [Button, Progress],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressUsageExample {
  protected readonly value: WritableSignal<number> = signal(64);

  protected advance(): void {
    this.value.update((value: number): number => Math.min(100, value + 10));
  }

  protected reset(): void {
    this.value.set(64);
  }
}
