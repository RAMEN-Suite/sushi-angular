import { Directive } from '@angular/core';

/** Marks the rendered example shown before its source tabs. */
@Directive({ selector: 'ng-template[pgExamplePreview]' })
export class ExamplePreview {}
