import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Kbd } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import activeHtml from './examples/active/active.example.html';
import * as activeTs from './examples/active/active.example.ts' with { loader: 'text' };
import { MenuActiveExample } from './examples/active/active.example';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { MenuBasicExample } from './examples/basic/basic.example';
import contextHtml from './examples/context/context.example.html';
import * as contextTs from './examples/context/context.example.ts' with { loader: 'text' };
import { MenuContextExample } from './examples/context/context.example';
import groupsHtml from './examples/groups/groups.example.html';
import * as groupsTs from './examples/groups/groups.example.ts' with { loader: 'text' };
import { MenuGroupsExample } from './examples/groups/groups.example';
import popupHtml from './examples/popup/popup.example.html';
import * as popupTs from './examples/popup/popup.example.ts' with { loader: 'text' };
import { MenuPopupExample } from './examples/popup/popup.example';
import statesHtml from './examples/states/states.example.html';
import * as statesTs from './examples/states/states.example.ts' with { loader: 'text' };
import { MenuStatesExample } from './examples/states/states.example';
import submenuHtml from './examples/submenu/submenu.example.html';
import * as submenuTs from './examples/submenu/submenu.example.ts' with { loader: 'text' };
import { MenuSubmenuExample } from './examples/submenu/submenu.example';

@Component({
  selector: 'pg-menu-page',
  imports: [
    Badge,
    ExampleCode,
    ExamplePreview,
    Kbd,
    MenuActiveExample,
    MenuBasicExample,
    MenuContextExample,
    MenuGroupsExample,
    MenuPopupExample,
    MenuStatesExample,
    MenuSubmenuExample,
  ],
  templateUrl: './menu.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuPage {
  protected readonly examples: Readonly<
    Record<'active' | 'basic' | 'context' | 'groups' | 'popup' | 'states' | 'submenu', ExampleSource>
  > = {
    active: { html: activeHtml, typescript: textSource(activeTs) },
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    context: { html: contextHtml, typescript: textSource(contextTs) },
    popup: { html: popupHtml, typescript: textSource(popupTs) },
    groups: { html: groupsHtml, typescript: textSource(groupsTs) },
    states: { html: statesHtml, typescript: textSource(statesTs) },
    submenu: { html: submenuHtml, typescript: textSource(submenuTs) },
  };
}
