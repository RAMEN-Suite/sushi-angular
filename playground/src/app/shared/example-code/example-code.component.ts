import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  InputSignal,
  linkedSignal,
  Signal,
  TemplateRef,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Code, CodeLine, Tab, Tabs, TabsValue } from '@ramen-suite/sushi';
import { highlightLines } from './example-highlighter';
import { ExamplePreview } from './example-preview.directive';

@Component({
  selector: 'pg-example-code',
  imports: [Code, CodeLine, NgTemplateOutlet, Tab, Tabs],
  templateUrl: './example-code.component.html',
  styleUrl: './example-code.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ExampleCode {
  public readonly html: InputSignal<string> = input.required<string>();
  public readonly typescript: InputSignal<string> = input.required<string>();
  public readonly css: InputSignal<string | undefined> = input<string>();

  protected readonly preview: Signal<TemplateRef<unknown> | undefined> = contentChild(ExamplePreview, {
    read: TemplateRef,
  });

  protected readonly cssLines: Signal<readonly string[]> = computed((): readonly string[] => {
    const source: string | undefined = this.css();
    return source === undefined ? [] : highlightLines(source, 'css');
  });
  protected readonly htmlLines: Signal<readonly string[]> = computed((): readonly string[] =>
    highlightLines(this.html(), 'html'),
  );
  protected readonly typescriptLines: Signal<readonly string[]> = computed((): readonly string[] =>
    highlightLines(this.typescript(), 'typescript'),
  );
  protected readonly activeTab: WritableSignal<TabsValue> = linkedSignal<TabsValue>(() => (this.preview() ? 'preview' : 'html'));
}
