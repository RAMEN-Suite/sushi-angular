import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Card, CardTitle, Spinner } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-spinner-contexts-example',
  imports: [Button, Card, CardTitle, Spinner],
  templateUrl: './contexts.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerContextsExample {}
