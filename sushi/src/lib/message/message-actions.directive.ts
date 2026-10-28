import { Directive } from '@angular/core';

/** Aligns related actions within a message. */
@Directive({
  selector: '[suiMessageActions]',
  host: {
    class: 'sui-message-actions',
  },
})
export class MessageActions {}
