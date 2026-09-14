import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideBell, LucideCircleQuestionMark, LucidePlus, LucideSearch, LucideSparkles } from '@lucide/angular';
import {
  Button,
  InputSurface,
  InputSurfaceControl,
  Kbd,
  Navbar,
  NavbarAction,
  NavbarBrand,
  NavbarContent,
} from '@sushi-kit/angular';

@Component({
  selector: 'pg-navbar-websites-example',
  imports: [
    Button,
    InputSurface,
    InputSurfaceControl,
    Kbd,
    LucideBell,
    LucideCircleQuestionMark,
    LucidePlus,
    LucideSearch,
    LucideSparkles,
    Navbar,
    NavbarAction,
    NavbarBrand,
    NavbarContent,
  ],
  templateUrl: './websites.example.html',
  styleUrl: './websites.example.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarWebsitesExample {}
