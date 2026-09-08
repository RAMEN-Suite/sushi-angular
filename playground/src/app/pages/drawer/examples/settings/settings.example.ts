import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideSlidersHorizontal, LucideX } from '@lucide/angular';
import {
  Button,
  Checkbox,
  Drawer,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  Fieldset,
  FieldsetLegend,
  Label,
} from '@ramen-suite/sushi';

@Component({
  selector: 'pg-drawer-settings-example',
  imports: [
    Button,
    Checkbox,
    Drawer,
    DrawerClose,
    DrawerFooter,
    DrawerHeader,
    DrawerTrigger,
    Fieldset,
    FieldsetLegend,
    Label,
    LucideSlidersHorizontal,
    LucideX,
  ],
  templateUrl: './settings.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerSettingsExample {}
