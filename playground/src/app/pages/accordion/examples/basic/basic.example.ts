import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Accordion, AccordionItem } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-accordion-basic-example',
  imports: [Accordion, AccordionItem],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionBasicExample {
  protected readonly open: WritableSignal<readonly string[]> = signal<readonly string[]>(['shipping']);
}
