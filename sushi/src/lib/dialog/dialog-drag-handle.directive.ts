import { Directive } from '@angular/core';
import { CdkDragHandle } from '@angular/cdk/drag-drop';

@Directive({
  selector: '[suiDialogDragHandle]',
  hostDirectives: [CdkDragHandle],
  host: { class: 'sui-dialog-drag-handle' },
})
/** Marks the region from which a draggable Dialog can be moved. */
export class DialogDragHandle {}
