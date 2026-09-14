import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Badge, Button, Progress } from '@sushi-kit/angular';

@Component({
  selector: 'pg-progress-animations-example',
  imports: [Badge, Button, Progress],
  templateUrl: './animations.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressAnimationsExample {
  protected readonly value: WritableSignal<number> = signal<number>(40);

  protected advance(): void {
    const value: number = this.value();
    this.value.set(value === 100 ? 20 : Math.min(value + 20, 100));
  }
}
