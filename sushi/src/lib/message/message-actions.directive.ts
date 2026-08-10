import { Directive } from '@angular/core';

@Directive({
  selector: '[suiMessageActions]',
  host: { class: 'sui-message-actions flex justify-self-end gap-2' },
})
export class MessageActions {}
