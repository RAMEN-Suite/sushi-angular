import { Dialog as CdkDialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { Button } from '@sushi-kit/angular';

interface MenuDialogData {
  readonly menus: readonly string[];
}

@Component({
  imports: [Button],
  template: `
    <h2 class="text-lg font-semibold">Choose a menu</h2>
    <div class="mt-4 grid gap-2">
      @for (menu of data.menus; track menu) {
        <button suiButton type="button" variant="outlined" (click)="dialog.close(menu)">{{ menu }}</button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuDialog {
  protected readonly data: MenuDialogData = inject<MenuDialogData>(DIALOG_DATA);
  protected readonly dialog: DialogRef<string> = inject<DialogRef<string>>(DialogRef);
}

@Component({
  selector: 'pg-dialog-dynamic-example',
  imports: [Button],
  templateUrl: './dynamic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogDynamicExample {
  protected readonly selection: WritableSignal<string> = signal('None');
  private readonly dialogs: CdkDialog = inject(CdkDialog);

  protected chooseMenu(): void {
    const dialog: DialogRef<string, MenuDialog> = this.dialogs.open<string, MenuDialogData, MenuDialog>(MenuDialog, {
      ariaLabel: 'Choose a menu',
      data: { menus: ['Omakase', 'Vegetarian', 'Lunch set'] },
      panelClass: 'sui-dynamic-dialog',
      backdropClass: 'sui-dialog-backdrop',
    });
    dialog.closed.subscribe((selection: string | undefined): void => {
      if (selection) this.selection.set(selection);
    });
  }
}
