# SUSHI

An Angular 22+ component library built around native semantics, typed signal APIs, accessible interaction patterns, and copyable documentation examples.

## Development

- [Component development](docs/component-development.md)
- [Engineering guidelines](GUIDELINES.md)
- `npm test` runs the library unit suite.
- `npm run test:coverage` enforces the project coverage gates.
- `npm run test:e2e` verifies browser-only interaction and layout contracts.

## Component roadmap

## Structure and collections

Build these in dependency order so later components reuse established behavior and layouts.

- [x] `suiAccordion`
- [x] `suiList`
- [x] `suiListbox`
- [x] `suiOrderList`
- [x] `suiMenu`
- [x] `suiPagination`
- [x] `suiTable`
- [x] `suiDataView`

## Application navigation

- [x] `sui-navbar`
- [x] `suiSidebar`
- [x] `suiDrawer`

`suiSidebar` owns persistent application navigation. `suiDrawer` owns the responsive overlay and disclosure behavior; it may contain a sidebar but does not replace it.

## Overlays and navigation

- [x] `suiDialog`
- [ ] `suiPopover`
- [ ] `suiTooltip`
- [x] `suiContextMenuTrigger`
- [ ] `suiBreadcrumb`
- [ ] `suiSteps`

## Supporting primitives

- [x] `suiChip`
- [ ] `suiSkeleton`
