import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideSearch } from '@lucide/angular';
import {
  Button,
  Fieldset,
  FieldsetLegend,
  Input,
  InputWrapper,
  InputWrapperControl,
  Join,
  JoinItem,
  Kbd,
} from '@ramen-suite/sushi';

@Component({
  selector: 'pg-input-composition-example',
  imports: [LucideSearch, Button, Fieldset, FieldsetLegend, Input, InputWrapper, InputWrapperControl, Join, JoinItem, Kbd],
  templateUrl: './composition.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputCompositionExample {}
