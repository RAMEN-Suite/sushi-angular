import { ChangeDetectionStrategy, Component, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { Tab, Tabs, TabsValue } from '@ramen-suite/sushi';
import { CodeExample } from '../code-example/code-example.component';

@Component({
  selector: 'pg-example-code',
  imports: [CodeExample, Tab, Tabs],
  templateUrl: './example-code.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleCode {
  public readonly html: InputSignal<string> = input.required<string>();
  public readonly typescript: InputSignal<string> = input.required<string>();

  protected readonly activeTab: WritableSignal<TabsValue> = signal<TabsValue>('html');
}
