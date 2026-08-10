import { Directive } from '@angular/core';
import { FileDropContentContext, FileDropItemContext } from './file-drop.interfaces';

/** Replaces the instructional content inside the drop zone. */
@Directive({ selector: 'ng-template[suiFileDropContent]' })
export class FileDropContentTemplate {
  public static ngTemplateContextGuard(
    _directive: FileDropContentTemplate,
    _context: unknown,
  ): _context is FileDropContentContext {
    return true;
  }
}

/** Replaces each selected file row while preserving its actions. */
@Directive({ selector: 'ng-template[suiFileDropItem]' })
export class FileDropItemTemplate {
  public static ngTemplateContextGuard(_directive: FileDropItemTemplate, _context: unknown): _context is FileDropItemContext {
    return true;
  }
}
