import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { AutoFocus, Button, Card, CardTitle, Code, CodeLine } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-auto-focus-page',
  imports: [AutoFocus, Button, Card, CardTitle, Code, CodeLine],
  templateUrl: './auto-focus.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoFocusPage {
  protected readonly showField: WritableSignal<boolean> = signal<boolean>(false);

  protected showFocusedField(): void {
    this.showField.set(false);
    queueMicrotask((): void => this.showField.set(true));
  }

  protected handleReset(): void {
    this.showField.set(false);
  }
}
