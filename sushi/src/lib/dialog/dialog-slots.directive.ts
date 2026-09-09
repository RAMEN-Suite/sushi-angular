import { Directive } from '@angular/core';

@Directive({ selector: '[suiDialogBody]', host: { class: 'sui-dialog-body' } })
/** Marks the scrollable content region of a structured Dialog. */
export class DialogBody {}

@Directive({ selector: '[suiDialogFooter]', host: { class: 'sui-dialog-footer' } })
/** Marks the action region below a structured Dialog body. */
export class DialogFooter {}
