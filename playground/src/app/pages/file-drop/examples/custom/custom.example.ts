import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { LucideFileText, LucideUpload } from '@lucide/angular';
import { FileDrop, FileDropContentTemplate, FileDropItemTemplate } from '@ramen-suite/sushi';

interface ImagesModel {
  files: readonly File[];
}

@Component({
  selector: 'pg-file-drop-custom-example',
  imports: [FormField, LucideFileText, LucideUpload, FileDrop, FileDropContentTemplate, FileDropItemTemplate],
  templateUrl: './custom.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDropCustomExample {
  protected readonly model: WritableSignal<ImagesModel> = signal({ files: [] });
  protected readonly form: FieldTree<ImagesModel> = form(this.model);
}
