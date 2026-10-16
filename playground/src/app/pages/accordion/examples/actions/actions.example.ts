import { ChangeDetectionStrategy, Component, signal, type WritableSignal } from '@angular/core';
import { LucidePlus } from '@lucide/angular';
import {
  Accordion,
  AccordionActionsTemplate,
  AccordionItem,
  type AccordionItemData,
  type AccordionValue,
  Button,
} from '@sushi-kit/angular';

@Component({
  selector: 'pg-accordion-actions-example',
  imports: [Accordion, AccordionActionsTemplate, AccordionItem, Button, LucidePlus],
  templateUrl: './actions.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionActionsExample {
  protected readonly open: WritableSignal<readonly AccordionValue[]> = signal(['bowls']);
  protected readonly entries: WritableSignal<Readonly<Record<string, number>>> = signal({ bowls: 0, desserts: 0 });
  protected readonly message: WritableSignal<string> = signal('No entries added.');

  protected add(item: AccordionItemData): void {
    this.entries.update((entries: Readonly<Record<string, number>>): Readonly<Record<string, number>> => ({
      ...entries,
      [item.value]: (entries[item.value] ?? 0) + 1,
    }));

    this.message.set(`Added an entry to ${item.label}.`);
  }
}
