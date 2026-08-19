import { Directive } from '@angular/core';

@Directive({
  selector: '[suiMessageActions]',
  host: {
    class: 'sui-message-actions flex w-full flex-wrap justify-end gap-2 sm:w-auto',
  },
})
/** Aligns related actions within a message. */
export class MessageActions {}
