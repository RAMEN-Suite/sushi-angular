import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideSearch } from '@lucide/angular';
import {
  Button,
  Fieldset,
  FieldsetLegend,
  Input,
  InputSurface,
  InputSurfaceControl,
  Join,
  JoinItem,
  Kbd,
  Label,
} from '@ramen-suite/sushi';

@Component({
  selector: 'pg-input-composition-example',
  imports: [LucideSearch, Button, Fieldset, FieldsetLegend, Input, InputSurface, InputSurfaceControl, Join, JoinItem, Kbd, Label],
  templateUrl: './composition.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputCompositionExample {}
