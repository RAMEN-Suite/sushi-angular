import { ChangeDetectionStrategy, Component, computed, input, InputSignal, Signal } from '@angular/core';
import { Card } from '@ramen-suite/sushi';
import { apiReference } from '../../generated/api-reference.generated';
import { ApiReference } from '../../shared/api-reference/api-reference.component';
import type { ApiReferenceData } from '../../shared/api-reference/api-reference.types';

const references: Readonly<Record<string, readonly ApiReferenceData[]>> = {
  accordion: [apiReference.Accordion],
  'auto-focus': [apiReference.AutoFocus],
  autocomplete: [apiReference.Autocomplete],
  avatar: [apiReference.Avatar, apiReference.AvatarGroup],
  badge: [apiReference.Badge],
  button: [apiReference.Button],
  card: [apiReference.Card, apiReference.CardTitle, apiReference.CardMedia, apiReference.CardActions],
  checkbox: [apiReference.Checkbox],
  chip: [apiReference.Chip],
  code: [apiReference.Code, apiReference.CodeLine],
  'color-picker': [apiReference.ColorPicker],
  'data-view': [apiReference.DataView],
  divider: [apiReference.Divider],
  fieldset: [apiReference.Fieldset, apiReference.FieldsetLegend, apiReference.FieldsetContent, apiReference.FieldsetToggle],
  'file-drop': [apiReference.FileDrop],
  'file-input': [apiReference.FileInput],
  indicator: [apiReference.Indicator, apiReference.IndicatorItem],
  input: [apiReference.Input],
  'input-group': [apiReference.InputGroup, apiReference.InputGroupAddon],
  'input-number': [apiReference.InputNumber],
  'input-otp': [apiReference.InputOtp],
  'input-surface': [apiReference.InputSurface, apiReference.InputSurfaceControl],
  join: [apiReference.Join, apiReference.JoinItem],
  kbd: [apiReference.Kbd],
  label: [apiReference.Label],
  list: [apiReference.List],
  listbox: [apiReference.Listbox],
  message: [apiReference.Message, apiReference.MessageActions],
  menu: [apiReference.Menu, apiReference.MenuTrigger, apiReference.ContextMenuTrigger],
  'multi-select': [apiReference.MultiSelect],
  'order-list': [apiReference.OrderList],
  pagination: [apiReference.Pagination],
  progress: [apiReference.Progress],
  radio: [apiReference.Radio],
  range: [apiReference.Range],
  select: [apiReference.Select],
  'select-button': [apiReference.SelectButton],
  spinner: [apiReference.Spinner],
  status: [apiReference.Status],
  table: [apiReference.Table],
  tabs: [apiReference.Tabs],
  textarea: [apiReference.Textarea],
  toggle: [apiReference.Toggle],
  'toggle-button': [apiReference.ToggleButton],
};

@Component({
  selector: 'pg-api-page',
  imports: [ApiReference, Card],
  templateUrl: './api.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiPage {
  public readonly component: InputSignal<string> = input.required<string>();
  public readonly name: InputSignal<string> = input.required<string>();

  protected readonly api: Signal<readonly ApiReferenceData[] | undefined> = computed(() => references[this.component()]);
}
