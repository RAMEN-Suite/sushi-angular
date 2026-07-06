# SUSHI

## Phase 0: Shared foundation

- `sui z-index tokens` replace PrimeNG z-index config


- `SuiMenuItem` replaces `primeng/api MenuItem`


- `SuiLazyLoadEvent` replaces PrimeNG lazy event patterns


- `SuiDialogRef` replaces `primeng/dynamicdialog DynamicDialogRef`


## Phase 1: Atomic directives

- `(x) suiButton` replaces `primeng/button`  
  Basis: DaisyUI `btn`


- `(x) suiBadge` replaces `primeng/badge`  
  Basis: DaisyUI `badge`


- `(x) suiDivider` replaces `primeng/divider`  
  Basis: DaisyUI `divider`


- `suiSpinner` replaces `primeng/progressspinner`  
  Basis: DaisyUI `loading`


- `suiIcon` replaces PrimeNG button icon usage  
  Basis: SVG/icon registry or projected icon


- `suiToggleButton` replaces `primeng/togglebutton`  
  Basis: Angular Aria toggle/button behavior + DaisyUI `btn`


- `suiStatus` wraps DaisyUI `status`  
  Basis: DaisyUI `status`


- `suiKbd` wraps DaisyUI `kbd`  
  Basis: DaisyUI `kbd`


- `suiAvatar` wraps DaisyUI `avatar`  
  Basis: DaisyUI `avatar`


- `suiIndicator` wraps DaisyUI `indicator`  
  Basis: DaisyUI `indicator`


- `suiAutoFocus` replaces `primeng/autofocus`  
  Basis: Angular CDK a11y / FocusMonitor or native focus


- `suiImage` replaces `primeng/image`  
  Basis: native `<img>` + Tailwind/DaisyUI styling


- `suiCard` replaces simple panel/card usage  
  Basis: DaisyUI `card`


- `suiMessage` replaces `primeng/message`  
  Basis: DaisyUI `alert`


- ~~`suiIconButton`~~  
  Use `suiButton` with `shape="square"` / `shape="circle"` and `suiIcon`


- ~~`suiPanel`~~  
  Use `suiCard`


## Phase 2: Form directives

- `suiInput` replaces `primeng/inputtext`  
  Basis: DaisyUI `input` + Angular Forms


- `suiTextarea` replaces `primeng/textarea`  
  Basis: DaisyUI `textarea` + Angular Forms


- `suiFormField` replaces `primeng/iftalabel`  
  Basis: Angular Forms state + ARIA attributes + Tailwind layout


- `suiInputGroup` replaces `primeng/inputgroup`  
  Basis: DaisyUI `join`


- `suiCheckbox` replaces `primeng/checkbox`  
  Basis: Angular Aria checkbox + DaisyUI `checkbox`


- `suiRadio` wraps DaisyUI `radio`  
  Basis: Angular Aria radio / radio group + DaisyUI `radio`


- `suiToggle` wraps DaisyUI `toggle`  
  Basis: Angular Aria switch + DaisyUI `toggle`


- `suiRange` wraps DaisyUI `range`  
  Basis: native range input + DaisyUI `range`


- `suiJoin` wraps DaisyUI `join`  
  Basis: DaisyUI `join`


- `suiSegmentedControl` replaces `primeng/selectbutton`  
  Basis: Angular Aria radio group or toggle group + DaisyUI `join` / `btn`


- ~~`suiRating`~~  
  Only add if actually needed


- ~~DaisyUI `validator` wrapper~~  
  Handle validation through Angular Forms / `suiFormField`


## Phase 3: Interactive composition

- `suiChip` replaces `primeng/chip`  
  Basis: custom chip directive + `suiIcon` + `suiAvatar` + `suiButton`


- `suiList` wraps DaisyUI `list`  
  Basis: DaisyUI `list`


- `suiSkeleton` wraps DaisyUI `skeleton`  
  Basis: DaisyUI `skeleton`


- ~~`suiStats`~~  
  Use cards/grid unless there is a real app use case


- ~~`suiTimeline`~~  
  Use normal layout unless there is a real app use case


## Phase 4: Overlay primitives

- `suiTooltip` replaces `primeng/tooltip`  
  Basis: Angular CDK Overlay + optional DaisyUI tooltip styling


- `suiPopover` replaces `primeng/popover`  
  Basis: Angular CDK Overlay + Angular Aria trigger/disclosure behavior


- `suiDialog` replaces `primeng/dialog`, `primeng/dynamicdialog`  
  Basis: Angular CDK Dialog/Overlay + FocusTrap + `SuiDialogRef`


- ~~`suiDrawer`~~  
  Only add if an app actually needs drawer navigation


## Phase 5: Selection primitives

- `suiListbox` replaces `primeng/listbox`  
  Basis: Angular Aria listbox


- `suiSelect` replaces `primeng/select`  
  Basis: Angular Aria select/listbox + Angular CDK Overlay


- `suiAutocomplete` replaces `primeng/autocomplete`  
  Basis: Angular Aria combobox/listbox + Angular CDK Overlay


## Phase 6: Disclosure and navigation

- `suiAccordion` replaces `primeng/accordion`  
  Basis: Angular Aria accordion/disclosure + DaisyUI `collapse`


- `suiTabs` replaces `primeng/tabs`  
  Basis: Angular Aria tabs + DaisyUI `tabs`


- `suiMenu` replaces PrimeNG menu patterns  
  Basis: Angular Aria menu + DaisyUI `menu`


- `suiContextMenu` replaces `primeng/contextmenu`  
  Basis: Angular CDK Overlay + Angular Aria menu


- `suiBreadcrumb` replaces `primeng/breadcrumb`  
  Basis: semantic `<nav>` + DaisyUI `breadcrumbs`


- `suiSteps` wraps DaisyUI `steps`  
  Basis: DaisyUI `steps`


- ~~`suiInplace`~~  
  Use local state plus `suiButton`, `suiInput`, `suiFormField`


- ~~`suiMenubar`~~  
  Use app-specific navigation plus `suiMenu`


- ~~`suiPanelMenu`~~  
  Use `suiAccordion` plus `suiMenu`


- ~~`suiDock`~~  
  Too app-shell-specific for now


## Phase 7: Data and layout-heavy directives/components

- `suiPagination` replaces PrimeNG lazy/pagination patterns  
  Basis: `suiButton`, `suiSelect`, custom pagination logic


- `suiTable` replaces `primeng/table`  
  Basis: native table + DaisyUI `table`; optionally Angular CDK table later


- `suiDataView` replaces `primeng/dataview`  
  Basis: Tailwind grid/list layout + `suiPagination`


- ~~`suiScrollArea`~~  
  Use native scrolling plus Tailwind unless custom scroll behavior is needed


- ~~`suiColorPicker`~~  
  Only add if actually needed
