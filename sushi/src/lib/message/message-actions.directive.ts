import { Directive } from '@angular/core';

@Directive({
  selector: '[suiMessageActions]',
  host: {
    class: 'sui-message-actions',
  },
})
/** Aligns related actions within a message. */
export class MessageActions {}
