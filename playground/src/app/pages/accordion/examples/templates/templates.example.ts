import { ChangeDetectionStrategy, Component, signal, type WritableSignal } from '@angular/core';
import {
  Accordion,
  AccordionHeaderTemplate,
  AccordionIndicatorTemplate,
  AccordionItem,
  type AccordionItemData,
  Badge,
  Status,
} from '@sushi-kit/angular';
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
    if (item.value === 'production') return 'Healthy';
    if (item.value === 'preview') return 'Review';
    return 'Paused';
  }
}
