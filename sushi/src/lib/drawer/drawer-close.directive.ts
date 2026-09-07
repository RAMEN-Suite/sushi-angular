import { Directive, input, InputSignal } from '@angular/core';
import { Drawer } from './drawer.component';

@Directive({
  selector: 'button[suiDrawerClose]',
  host: { type: 'button', '(click)': 'drawer().close()' },
})
/** Closes a Drawer from a native button. */
export class DrawerClose {
  /** Drawer closed by this action. */
  public readonly drawer: InputSignal<Drawer> = input.required<Drawer>({ alias: 'suiDrawerClose' });
}
