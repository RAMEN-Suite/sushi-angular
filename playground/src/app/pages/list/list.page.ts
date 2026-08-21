import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import activityHtml from './examples/activity/activity.example.html';
import * as activityTs from './examples/activity/activity.example.ts' with { loader: 'text' };
import { ListActivityExample } from './examples/activity/activity.example';
import directoryHtml from './examples/directory/directory.example.html';
import * as directoryTs from './examples/directory/directory.example.ts' with { loader: 'text' };
import { ListDirectoryExample } from './examples/directory/directory.example';
import tasksHtml from './examples/tasks/tasks.example.html';
import * as tasksTs from './examples/tasks/tasks.example.ts' with { loader: 'text' };
import { ListTasksExample } from './examples/tasks/tasks.example';

@Component({
  selector: 'pg-list-page',
  imports: [Badge, Card, CardTitle, ExampleCode, ListActivityExample, ListDirectoryExample, ListTasksExample],
  templateUrl: './list.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListPage {
  protected readonly examples: Readonly<Record<'activity' | 'directory' | 'tasks', ExampleSource>> = {
    activity: { html: activityHtml, typescript: textSource(activityTs) },
    directory: { html: directoryHtml, typescript: textSource(directoryTs) },
    tasks: { html: tasksHtml, typescript: textSource(tasksTs) },
  };
}
