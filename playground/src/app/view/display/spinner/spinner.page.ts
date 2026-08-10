import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Card, CardTitle, Code, CodeLine, Divider, Spinner } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-spinner-page',
  imports: [Button, Card, CardTitle, Code, CodeLine, Divider, Spinner],
  templateUrl: './spinner.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerPage {}
