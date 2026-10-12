import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Accordion, AccordionItem, Button, Input } from '@sushi-kit/angular';

@Component({
  selector: 'pg-accordion-control-example',
  imports: [Accordion, AccordionItem, Button, Input],
  templateUrl: './control.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionControlExample {
  protected readonly saved: WritableSignal<number> = signal<number>(0);
  protected readonly increment: (value: number) => number = (value: number): number => value + 1;
  protected readonly open: WritableSignal<readonly string[]> = signal<readonly string[]>(['profile', 'security']);
}
