import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Accordion, AccordionItem } from '@sushi-kit/angular';

@Component({
  selector: 'pg-accordion-sizes-example',
  imports: [Accordion, AccordionItem],
  templateUrl: './sizes.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionSizesExample {}
