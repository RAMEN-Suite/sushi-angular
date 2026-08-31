import { ChangeDetectionStrategy, Component, computed, signal, Signal, WritableSignal } from '@angular/core';
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideChevronsLeft,
  LucideChevronsRight,
  LucideOrbit,
  LucideRadioTower,
} from '@lucide/angular';
import {
  Badge,
  Card,
  CardTitle,
  Pagination,
  PaginationNavigationTemplate,
  PaginationPageTemplate,
  PaginationReportTemplate,
  Progress,
  Status,
} from '@ramen-suite/sushi';

@Component({
  selector: 'pg-pagination-templates-example',
  imports: [
    Badge,
    Card,
    CardTitle,
    LucideArrowLeft,
    LucideArrowRight,
    LucideChevronsLeft,
    LucideChevronsRight,
    LucideOrbit,
    LucideRadioTower,
    Pagination,
    PaginationNavigationTemplate,
    PaginationPageTemplate,
    PaginationReportTemplate,
    Progress,
    Status,
  ],
  templateUrl: './templates.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationTemplatesExample {
  protected readonly page: WritableSignal<number> = signal<number>(4);
  protected readonly packets: Signal<number> = computed(() => Math.min(this.page() * 10, 86));

  protected formatPage(page: number): string {
    return page.toString().padStart(2, '0');
  }
}
