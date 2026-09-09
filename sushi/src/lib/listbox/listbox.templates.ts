import { Directive, input, InputSignal } from '@angular/core';
import type { ListboxFilterContext, ListboxGroupContext, ListboxItemContext, ListboxOption } from './listbox.interfaces';

/** Replaces the filter control and exposes its query, state, and update function. */
@Directive({ selector: 'ng-template[suiListboxFilter]' })
export class ListboxFilterTemplate {
  public static ngTemplateContextGuard(_directive: ListboxFilterTemplate, _context: unknown): _context is ListboxFilterContext {
    return true;
  }
}

/** Replaces each option and exposes its index, selected, active, and disabled state. */
@Directive({ selector: 'ng-template[suiListboxItem]' })
export class ListboxItemTemplate<O extends ListboxOption = ListboxOption> {
  /** Option source used to infer custom fields inside the template. */
  public readonly options: InputSignal<readonly O[] | '' | undefined> = input<readonly O[] | '' | undefined>(undefined, {
    alias: 'suiListboxItem',
  });

  public static ngTemplateContextGuard<O extends ListboxOption>(
    _directive: ListboxItemTemplate<O>,
    _context: unknown,
  ): _context is ListboxItemContext<O> {
    return true;
  }
}

/** Replaces the content shown when no options are available. */
@Directive({ selector: 'ng-template[suiListboxEmpty]' })
export class ListboxEmptyTemplate {}

/** Replaces the message shown when filtering returns no options. */
@Directive({ selector: 'ng-template[suiListboxEmptyFilter]' })
export class ListboxEmptyFilterTemplate {}

/** Replaces each group heading and exposes its group label. */
@Directive({ selector: 'ng-template[suiListboxGroup]' })
export class ListboxGroupTemplate {
  public static ngTemplateContextGuard(_directive: ListboxGroupTemplate, _context: unknown): _context is ListboxGroupContext {
    return true;
  }
}

/** Adds content above the options and filter. */
@Directive({ selector: 'ng-template[suiListboxHeader]' })
export class ListboxHeaderTemplate {}

/** Adds content below the options. */
@Directive({ selector: 'ng-template[suiListboxFooter]' })
export class ListboxFooterTemplate {}
