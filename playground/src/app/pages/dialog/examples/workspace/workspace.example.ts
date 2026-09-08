import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Dialog, DialogClose, DialogDragHandle, DialogTrigger, Divider } from '@ramen-suite/sushi';
import { LucideGripHorizontal, LucideMaximize2, LucideMinimize2, LucideX } from '@lucide/angular';

@Component({
  selector: 'pg-dialog-workspace-example',
  imports: [
    Button,
    Dialog,
    DialogClose,
    DialogDragHandle,
    DialogTrigger,
    Divider,
    LucideGripHorizontal,
    LucideMaximize2,
    LucideMinimize2,
    LucideX,
  ],
  templateUrl: './workspace.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogWorkspaceExample {}
