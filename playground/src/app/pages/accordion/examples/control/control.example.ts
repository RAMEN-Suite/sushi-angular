import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Accordion, AccordionItem, Button } from '@sushi-kit/angular';

@Component({
  selector: 'pg-accordion-control-example',
  imports: [Accordion, AccordionItem, Button],
  templateUrl: './control.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionControlExample {
  protected readonly open: WritableSignal<readonly string[]> = signal<readonly string[]>(['profile', 'security']);
}
