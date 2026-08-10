import { ChangeDetectionStrategy, Component, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { Code, CodeLine, Tab, Tabs, TabsValue } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-example-code',
  imports: [Code, CodeLine, Tab, Tabs],
  templateUrl: './example-code.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleCode {
  public readonly html: InputSignal<string> = input.required<string>();
  public readonly typescript: InputSignal<string> = input.required<string>();

  protected readonly activeTab: WritableSignal<TabsValue> = signal<TabsValue>('html');

  protected lines(source: string): readonly string[] {
    return source.replaceAll('\r\n', '\n').trim().split('\n');
  }
}
