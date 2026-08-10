import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { FileDrop, FileDropRejection } from '@ramen-suite/sushi';

interface FilesModel {
  files: readonly File[];
}

@Component({
  selector: 'pg-file-drop-basic-example',
  imports: [FormField, FileDrop],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDropBasicExample {
  protected readonly model: WritableSignal<FilesModel> = signal({ files: [] });
  protected readonly form: FieldTree<FilesModel> = form(this.model);
  protected readonly lastDrop: WritableSignal<string> = signal('No files dropped yet');
  protected readonly rejected: WritableSignal<string> = signal('None');

  protected handleDrop(files: readonly File[]): void {
    this.lastDrop.set(files.map((file: File): string => file.name).join(', ') || 'No files dropped');
  }

  protected handleRejection(rejections: readonly FileDropRejection[]): void {
    this.rejected.set(rejections.map(({ file }: FileDropRejection): string => file.name).join(', ') || 'None');
  }
}
