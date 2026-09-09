import { Directive, input, InputSignal } from '@angular/core';
import { StatusAnimation, StatusSeverity, StatusSize } from './status.interfaces';

@Directive({
  selector: 'span[suiStatus]',
  host: {
    class: 'status sui-status rounded-full',

    '[class.status-primary]': 'severity() === "primary"',
    '[class.status-secondary]': 'severity() === "secondary"',
    '[class.status-neutral]': 'severity() === "neutral"',
    '[class.status-accent]': 'severity() === "accent"',
    '[class.status-info]': 'severity() === "info"',
    '[class.status-success]': 'severity() === "success"',
    '[class.status-warning]': 'severity() === "warning"',
    '[class.status-error]': 'severity() === "error"',

    '[class.status-xs]': 'size() === "xs"',
    '[class.status-sm]': 'size() === "sm"',
    '[class.status-md]': 'size() === "md"',
    '[class.status-lg]': 'size() === "lg"',
    '[class.status-xl]': 'size() === "xl"',

    '[class.sui-status--ping]': 'animation() === "ping"',
    '[class.sui-status--bounce]': 'animation() === "bounce"',

    '[attr.aria-hidden]': '"true"',
  },
})
/** Renders an assistive-technology-hidden state marker that must be paired with descriptive content. */
export class Status {
  /** Applies a semantic theme color. */
  public readonly severity: InputSignal<StatusSeverity | null> = input<StatusSeverity | null>(null);
  /** Controls the marker dimensions. */
  public readonly size: InputSignal<StatusSize> = input<StatusSize>('md');
  /** Adds motion for ongoing or attention-sensitive states. */
  public readonly animation: InputSignal<StatusAnimation | null> = input<StatusAnimation | null>(null);
}
