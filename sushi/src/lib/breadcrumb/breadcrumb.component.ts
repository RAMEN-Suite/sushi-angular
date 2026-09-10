import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, contentChild, input, InputSignal, Signal, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbItem, BreadcrumbItemContext } from './breadcrumb.interfaces';
import { BreadcrumbItemTemplate } from './breadcrumb.templates';

/** Renders the hierarchical path to the current page as native navigation links. */
@Component({
  selector: 'sui-breadcrumb',
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
  host: { class: 'sui-breadcrumb block max-w-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Breadcrumb<T = string> {
  /** Ordered destinations from the broadest level to the current page. */
  public readonly items: InputSignal<readonly BreadcrumbItem<T>[]> = input.required<readonly BreadcrumbItem<T>[]>();
  /** Accessible name of the navigation landmark. */
  public readonly ariaLabel: InputSignal<string> = input<string>('Breadcrumb');

  protected readonly itemTemplate: Signal<TemplateRef<BreadcrumbItemContext<T>> | undefined> = contentChild(
    BreadcrumbItemTemplate,
    { read: TemplateRef },
  );

  protected isCurrent(item: BreadcrumbItem<T>, index: number): boolean {
    return item.current ?? index === this.items().length - 1;
  }

  protected context(item: BreadcrumbItem<T>, index: number): BreadcrumbItemContext<T> {
    return { $implicit: item, item, index, current: this.isCurrent(item, index) };
  }
}
