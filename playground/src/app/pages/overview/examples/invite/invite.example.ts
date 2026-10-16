import { ChangeDetectionStrategy, Component, signal, type WritableSignal } from '@angular/core';
import { LucideArrowLeft, LucideSend, LucideShieldCheck } from '@lucide/angular';
import {
  Button,
  Fieldset,
  FieldsetContent,
  FieldsetLegend,
  Input,
  Label,
  Message,
  type NavbarItem,
  Radio,
  Sidebar,
  SidebarFooter,
  type SidebarGroup,
  Toggle,
} from '@sushi-kit/angular';

@Component({
  selector: 'pg-overview-invite-example',
  imports: [
    Button,
    Fieldset,
    FieldsetContent,
    FieldsetLegend,
    Input,
    Label,
    LucideArrowLeft,
    LucideSend,
    LucideShieldCheck,
    Message,
    Radio,
    Sidebar,
    SidebarFooter,
    Toggle,
  ],
  templateUrl: './invite.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewInviteExample {
  protected readonly section: WritableSignal<string> = signal('Members');
  protected readonly navigation: readonly SidebarGroup<NavbarItem<string>>[] = [
    { label: 'Workspace', items: ['General', 'Members', 'Billing'].map((label: string) => ({ label, value: label })) },
    { label: 'Account', items: ['Profile', 'Security', 'Notifications'].map((label: string) => ({ label, value: label })) },
  ];
}
