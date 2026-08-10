import { ChangeDetectionStrategy, Component, computed, input, InputSignal, Signal } from '@angular/core';
import { Code, CodeLine } from '@ramen-suite/sushi';

export const codeExample = (source: string): readonly string[] => source.replaceAll('\r\n', '\n').trim().split('\n');

@Component({
  selector: 'pg-code-example',
  imports: [Code, CodeLine],
  templateUrl: './code-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeExample {
  public readonly source: InputSignal<string> = input<string>('');
  public readonly lines: InputSignal<readonly string[]> = input<readonly string[]>([]);
  protected readonly renderedLines: Signal<readonly string[]> = computed(() => {
    const source: string = this.source();
    return source ? codeExample(source) : this.lines();
  });
}
