import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { AutoFocus, Button, Input, Join, JoinItem } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-auto-focus-dynamic-example',
  imports: [AutoFocus, Button, Input, Join, JoinItem],
  templateUrl: './dynamic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoFocusDynamicExample {
  protected readonly visible: WritableSignal<boolean> = signal<boolean>(false);

  protected show(): void {
    this.visible.set(false);
    queueMicrotask((): void => this.visible.set(true));
  }
}
