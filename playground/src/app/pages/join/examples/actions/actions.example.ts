import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideSearch } from '@lucide/angular';
import { Button, InputSurface, InputSurfaceControl, Join, JoinItem } from '@sushi-kit/angular';

@Component({
  selector: 'pg-join-actions-example',
  imports: [LucideSearch, Button, InputSurface, InputSurfaceControl, Join, JoinItem],
  templateUrl: './actions.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinActionsExample {}
