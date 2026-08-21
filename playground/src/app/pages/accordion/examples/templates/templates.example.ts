import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import {
  Accordion,
  AccordionHeaderTemplate,
  AccordionIndicatorTemplate,
  AccordionItem,
  AccordionItemData,
  Badge,
  Status,
} from '@ramen-suite/sushi';
import { LucideMinus, LucidePlus } from '@lucide/angular';

@Component({
  selector: 'pg-accordion-templates-example',
  imports: [
    Accordion,
    AccordionHeaderTemplate,
    AccordionIndicatorTemplate,
    AccordionItem,
    Badge,
    LucideMinus,
    LucidePlus,
    Status,
  ],
  templateUrl: './templates.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionTemplatesExample {
  protected readonly open: WritableSignal<readonly string[]> = signal<readonly string[]>(['production']);

  protected status(value: string): 'success' | 'warning' | 'neutral' {
    if (value === 'production') return 'success';
    if (value === 'preview') return 'warning';
    return 'neutral';
  }

  protected environment(item: AccordionItemData): string {
    return item.value === 'production' ? 'Healthy' : item.value === 'preview' ? 'Review' : 'Paused';
  }
}
