import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  InputSignal,
  Signal,
  signal,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { Code, CodeLine, Tab, Tabs, TabsValue } from '@ramen-suite/sushi';
import { highlightLines } from './example-highlighter';

@Component({
  selector: 'pg-example-code',
  imports: [Code, CodeLine, Tab, Tabs],
  templateUrl: './example-code.component.html',
  styleUrl: './example-code.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ExampleCode {
  public readonly html: InputSignal<string> = input.required<string>();
  public readonly typescript: InputSignal<string> = input.required<string>();

  protected readonly htmlLines: Signal<readonly string[]> = computed((): readonly string[] =>
    highlightLines(this.html(), 'html'),
  );
  protected readonly typescriptLines: Signal<readonly string[]> = computed((): readonly string[] =>
    highlightLines(this.typescript(), 'typescript'),
  );
  protected readonly activeTab: WritableSignal<TabsValue> = signal<TabsValue>('html');
}
