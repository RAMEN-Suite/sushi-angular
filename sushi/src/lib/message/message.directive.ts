import { Directive, input, InputSignal } from '@angular/core';
import { MessageOrientation, MessageSeverity, MessageVariant } from './message.interfaces';

@Directive({
  selector: '[suiMessage]',
  host: {
    class: 'alert sui-message',
    '[class.alert-info]': 'severity() === "info"',
    '[class.alert-success]': 'severity() === "success"',
    '[class.alert-warning]': 'severity() === "warning"',
    '[class.alert-error]': 'severity() === "error"',

    '[class.alert-soft]': 'variant() === "soft"',
    '[class.alert-outline]': 'variant() === "outlined"',
    '[class.alert-dash]': 'variant() === "dash"',

    '[class.alert-horizontal]': 'orientation() === "horizontal"',
    '[class.alert-vertical]': 'orientation() === "vertical"',
  },
})
/** Presents contextual feedback with optional semantic color and layout. */
export class Message {
  /** Applies a semantic feedback color. */
  public readonly severity: InputSignal<MessageSeverity | null> = input<MessageSeverity | null>(null);
  /** Changes the visual treatment of the message. */
  public readonly variant: InputSignal<MessageVariant | null> = input<MessageVariant | null>(null);
  /** Arranges content and actions horizontally or vertically. */
  public readonly orientation: InputSignal<MessageOrientation | null> = input<MessageOrientation | null>(null);
}
