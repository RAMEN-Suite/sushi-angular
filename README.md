# SUSHI component roadmap

## Structure and collections

Build these in dependency order so later components reuse established behavior and layouts.

- [x] `suiAccordion`
- [x] `suiList`
- [x] `suiListbox`
- [x] `suiOrderList`
- [ ] `suiMenu`
- [ ] `suiPagination`
- [ ] `suiTable`
- [ ] `suiDataView`

## Application navigation

- [ ] `suiNavbar`
- [ ] `suiSidebar`
- [ ] `suiDrawer`

`suiSidebar` owns persistent application navigation. `suiDrawer` owns the responsive overlay and disclosure behavior; it may contain a sidebar but does not replace it.

## Overlays and navigation

- [ ] `suiDialog`
- [ ] `suiPopover`
- [ ] `suiTooltip`
- [ ] `suiContextMenu`
- [ ] `suiBreadcrumb`
- [ ] `suiSteps`

## Supporting primitives

- [x] `suiChip`
- [ ] `suiSkeleton`
