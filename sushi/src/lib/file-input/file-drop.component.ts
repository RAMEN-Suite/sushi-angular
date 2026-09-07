import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  ElementRef,
  input,
  InputSignal,
  InputSignalWithTransform,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
  Signal,
  signal,
  TemplateRef,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { LucideX } from '@lucide/angular';
import { Button } from '../button';
import { FormControlState } from '../form-control';
import { FileDropContentContext, FileDropItemContext, FileDropRejection } from './file-drop.interfaces';
import { FileDropContentTemplate, FileDropItemTemplate } from './file-drop.templates';

let nextFileDropId: number = 0;

/** Selects files through a drop zone or the native file dialog. */
@Component({
  selector: 'sui-file-drop',
  imports: [NgTemplateOutlet, LucideX, Button],
  templateUrl: './file-drop.component.html',
  styleUrl: './file-drop.component.css',
  host: { class: 'sui-file-drop block', '[attr.aria-disabled]': 'disabled() || null' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDrop extends FormControlState implements FormValueControl<readonly File[]> {
  /** Currently accepted files. */
  public readonly value: ModelSignal<readonly File[]> = model<readonly File[]>([]);

  /** Native file type filter, such as `image/*` or `.pdf`. */
  public readonly accept: InputSignal<string | undefined> = input<string>();
  /** Allows more than one file to be selected. */
  public readonly multiple: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Prevents choosing, dropping, clearing, and removing files. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  /** Primary drop-zone instruction. */
  public readonly label: InputSignal<string> = input('Drop files here');
  /** Supporting drop-zone instruction. */
  public readonly description: InputSignal<string> = input('or choose them from your device');
  /** Label for the initial file-picker action. */
  public readonly chooseLabel: InputSignal<string> = input('Choose files');
  /** Label for the file-picker action after a selection. */
  public readonly replaceLabel: InputSignal<string> = input('Choose other files');
  /** Label for the action that removes every selected file. */
  public readonly clearLabel: InputSignal<string> = input('Clear');
  /** Prefix for rejected file type feedback. */
  public readonly rejectionLabel: InputSignal<string> = input('File type not accepted');

  /** Emits the accepted files after a drop. */
  public readonly filesDropped: OutputEmitterRef<readonly File[]> = output<readonly File[]>();
  /** Emits files rejected by the `accept` filter. */
  public readonly filesRejected: OutputEmitterRef<readonly FileDropRejection[]> = output<readonly FileDropRejection[]>();
  /** Emits when the user completes a file interaction. */
  public readonly touch: OutputEmitterRef<void> = output();

  protected readonly contentTemplate: Signal<TemplateRef<FileDropContentContext> | undefined> = contentChild(
    FileDropContentTemplate,
    {
      read: TemplateRef,
    },
  );
  protected readonly itemTemplate: Signal<TemplateRef<FileDropItemContext> | undefined> = contentChild(FileDropItemTemplate, {
    read: TemplateRef,
  });
  private readonly fileInput: Signal<ElementRef<HTMLInputElement>> = viewChild.required('inputElement');
  private readonly chooseButton: Signal<ElementRef<HTMLButtonElement>> = viewChild.required('chooseButton');

  protected readonly contentContext: Signal<FileDropContentContext> = computed(() => ({
    $implicit: this.value(),
    files: this.value(),
    active: this.active(),
    disabled: this.disabled(),
  }));
  protected readonly itemContexts: Signal<readonly FileDropItemContext[]> = computed(() =>
    this.value().map((file: File, index: number): FileDropItemContext => ({
      $implicit: file,
      file,
      index,
      size: this.formatSize(file.size),
    })),
  );
  protected readonly rejectionMessage: Signal<string | null> = computed(() => {
    const names: string = this.rejections()
      .map((rejection: FileDropRejection): string => rejection.file.name)
      .join(', ');
    return names ? `${this.rejectionLabel()}: ${names}` : null;
  });
  protected readonly labelId: string = `sui-file-drop-label-${nextFileDropId}`;
  protected readonly descriptionId: string = `sui-file-drop-description-${nextFileDropId}`;
  protected readonly buttonId: string = `sui-file-drop-button-${nextFileDropId++}`;

  protected readonly active: WritableSignal<boolean> = signal(false);
  protected readonly announcement: WritableSignal<string> = signal('');

  private readonly rejections: WritableSignal<readonly FileDropRejection[]> = signal<readonly FileDropRejection[]>([]);

  /** Moves focus to the file-picker action. */
  public focus(): void {
    this.chooseButton().nativeElement.focus();
  }

  /** Clears selected files, rejections, and the native input. */
  public reset(): void {
    this.fileInput().nativeElement.value = '';
    this.value.set([]);
    this.rejections.set([]);
    this.announcement.set('No files selected');
  }

  protected handleDrag(event: DragEvent): void {
    event.preventDefault();
    if (this.disabled()) return;
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    this.active.set(true);
  }

  protected handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    const dropzone: EventTarget | null = event.currentTarget;
    const destination: EventTarget | null = event.relatedTarget;
    if (dropzone instanceof Node && destination instanceof Node && dropzone.contains(destination)) return;
    this.active.set(false);
  }

  protected handleDrop(event: DragEvent): void {
    event.preventDefault();
    this.active.set(false);
    if (this.disabled()) return;

    const files: readonly File[] = this.selectFiles(event.dataTransfer?.files);
    this.value.set(files);
    this.filesDropped.emit(files);
    this.touch.emit();
  }

  protected handleSelection(event: Event): void {
    const inputElement: EventTarget | null = event.currentTarget;
    if (!(inputElement instanceof HTMLInputElement)) return;
    this.value.set(this.selectFiles(inputElement.files));
    this.touch.emit();
  }

  protected openPicker(): void {
    if (this.disabled()) return;
    this.rejections.set([]);
    const input: HTMLInputElement = this.fileInput().nativeElement;
    input.value = '';
    input.click();
  }

  protected handleClear(): void {
    if (this.disabled()) return;
    this.reset();
    this.touch.emit();
  }

  protected handleRemove(index: number): void {
    if (this.disabled()) return;
    this.fileInput().nativeElement.value = '';
    const files: readonly File[] = this.value().filter((_file: File, itemIndex: number) => itemIndex !== index);
    this.value.set(files);
    this.announcement.set(files.length ? files.map((file: File): string => file.name).join(', ') : 'No files selected');
    this.chooseButton().nativeElement.focus();
    this.touch.emit();
  }

  private selectFiles(fileList: FileList | null | undefined): readonly File[] {
    const candidates: readonly File[] = this.multiple() ? Array.from(fileList ?? []) : Array.from(fileList ?? []).slice(0, 1);
    const accepted: File[] = [];
    const rejected: FileDropRejection[] = [];

    for (const file of candidates) {
      if (this.accepts(file)) accepted.push(file);
      else rejected.push({ file, reason: 'accept' });
    }

    this.rejections.set(rejected);
    this.announcement.set(accepted.length ? accepted.map((file: File): string => file.name).join(', ') : 'No files selected');
    if (rejected.length) this.filesRejected.emit(rejected);

    return accepted;
  }

  private accepts(file: File): boolean {
    const rules: readonly string[] = (this.accept() ?? '')
      .split(',')
      .map((rule: string): string => rule.trim().toLowerCase())
      .filter(Boolean);
    if (!rules.length) return true;

    const name: string = file.name.toLowerCase();
    const type: string = file.type.toLowerCase();
    return rules.some((rule: string): boolean => {
      if (rule.startsWith('.')) return name.endsWith(rule);
      if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
      return type === rule;
    });
  }

  private formatSize(bytes: number): string {
    if (bytes < 1_000) return `${bytes} B`;
    if (bytes < 1_000_000) return `${(bytes / 1_000).toFixed(bytes < 10_000 ? 1 : 0)} KB`;
    return `${(bytes / 1_000_000).toFixed(bytes < 10_000_000 ? 1 : 0)} MB`;
  }
}
