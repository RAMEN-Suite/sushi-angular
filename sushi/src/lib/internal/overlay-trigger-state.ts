import { InjectionToken, type Signal } from '@angular/core';

/** @internal Open state of a Sushi overlay controlled by the same host element. */
export const OVERLAY_TRIGGER_OPEN: InjectionToken<Signal<boolean>> = new InjectionToken('SUSHI overlay trigger open');
