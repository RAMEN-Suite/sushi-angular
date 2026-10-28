import { Directive, input, type InputSignal } from '@angular/core';
import { type Drawer } from './drawer.component';

/** Closes a Drawer from a native button. */
@Directive({
  selector: 'button[suiDrawerClose]',
  host: { type: 'button', '(click)': 'drawer().close()' },
})
export class DrawerClose {
  /** Drawer closed by this action. */
  public readonly drawer: InputSignal<Drawer> = input.required<Drawer>({ alias: 'suiDrawerClose' });
}
