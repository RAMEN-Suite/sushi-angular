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
  /** Applies a semantic feedback color. Omit it for a neutral message. */
  public readonly severity: InputSignal<MessageSeverity | null> = input<MessageSeverity | null>(null);
  /** Changes the visual treatment of the message. Omit it for the filled default. */
  public readonly variant: InputSignal<MessageVariant | null> = input<MessageVariant | null>(null);
  /** Forces a horizontal or vertical layout. Omit it for the responsive default. */
  public readonly orientation: InputSignal<MessageOrientation | null> = input<MessageOrientation | null>(null);
}
