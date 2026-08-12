import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Button, Chip } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-chip-removal-example',
  imports: [Button, Chip],
  templateUrl: './removal.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipRemovalExample {
  protected readonly labels: WritableSignal<readonly string[]> = signal<readonly string[]>(['Design', 'Engineering', 'Research']);

  protected remove(label: string): void {
    this.labels.update((labels: readonly string[]): readonly string[] =>
      labels.filter((item: string): boolean => item !== label),
    );
  }

  protected reset(): void {
    this.labels.set(['Design', 'Engineering', 'Research']);
  }
}
