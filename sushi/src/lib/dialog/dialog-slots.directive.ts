import { Directive } from '@angular/core';

/** Marks the scrollable content region of a structured Dialog. */
@Directive({ selector: '[suiDialogBody]', host: { class: 'sui-dialog-body' } })
export class DialogBody {}

/** Marks the action region below a structured Dialog body. */
@Directive({ selector: '[suiDialogFooter]', host: { class: 'sui-dialog-footer' } })
export class DialogFooter {}
