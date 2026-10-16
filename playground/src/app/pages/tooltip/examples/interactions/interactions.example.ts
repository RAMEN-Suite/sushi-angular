import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogTrigger,
  Menu,
  MenuTrigger,
  Popover,
  PopoverTrigger,
  Tooltip,
} from '@sushi-kit/angular';

@Component({
  selector: 'pg-tooltip-interactions-example',
  imports: [Button, Dialog, DialogBody, DialogClose, DialogTrigger, Menu, MenuTrigger, Popover, PopoverTrigger, Tooltip],
  templateUrl: './interactions.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipInteractionsExample {}
