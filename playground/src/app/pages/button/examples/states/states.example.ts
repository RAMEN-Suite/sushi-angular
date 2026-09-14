import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Button, Spinner } from '@sushi-kit/angular';

@Component({
  selector: 'pg-button-states-example',
  imports: [Button, Spinner],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonStatesExample {
  protected readonly loading: WritableSignal<boolean> = signal<boolean>(false);

  protected save(): void {
    this.loading.set(true);
  }

  protected reset(): void {
    this.loading.set(false);
  }
}
