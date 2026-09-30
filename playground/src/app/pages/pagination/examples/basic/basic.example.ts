import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Pagination } from '@sushi-kit/angular';

@Component({
  selector: 'pg-pagination-basic-example',
  imports: [Pagination],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationBasicExample {
  protected readonly page: WritableSignal<number> = signal(1);
}
