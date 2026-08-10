import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField as SignalFormField } from '@angular/forms/signals';
import { LucideFile, LucideSearch } from '@lucide/angular';
import { Badge, Button, Card, CardTitle, Code, CodeLine, InputWrapper, InputWrapperControl, Kbd } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-input-wrapper-page',
  imports: [
    SignalFormField,
    LucideFile,
    LucideSearch,
    Badge,
    Button,
    Card,
    CardTitle,
    Code,
    CodeLine,
    InputWrapper,
    InputWrapperControl,
    Kbd,
  ],
  templateUrl: './input-wrapper.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputWrapperPage {
  protected readonly model: WritableSignal<{ query: string }> = signal<{ query: string }>({ query: '' });
  protected readonly searchForm: FieldTree<{ query: string }> = form(this.model);

  protected reset(): void {
    this.searchForm().reset({ query: '' });
  }
}
