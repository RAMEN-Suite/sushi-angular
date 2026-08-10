import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideChevronRight } from '@lucide/angular';
import {
  Button,
  Card,
  CardTitle,
  Checkbox,
  Code,
  CodeLine,
  Fieldset,
  FieldsetContent,
  FieldsetLegend,
  FieldsetToggle,
  Input,
} from '@ramen-suite/sushi';

@Component({
  selector: 'pg-fieldset-page',
  imports: [
    LucideChevronRight,
    Button,
    Card,
    CardTitle,
    Checkbox,
    Code,
    CodeLine,
    Fieldset,
    FieldsetContent,
    FieldsetLegend,
    FieldsetToggle,
    Input,
  ],
  templateUrl: './fieldset.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsetPage {
  protected readonly detailsExpanded: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly advancedExpanded: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly billingExpanded: WritableSignal<boolean> = signal<boolean>(true);
}
