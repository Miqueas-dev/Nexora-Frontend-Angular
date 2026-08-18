# Nexora UI and Modal Refinement Design

## Goal
Refine the stable Angular frontend without changing backend contracts, authentication, roles, validation rules, routes, or existing business flows.

## Visual design
- Preserve the current Nexora landing page and production palette.
- Rebuild the login as a stronger corporate access screen with clearer hierarchy, security context, role context, and a more polished credential card.
- Normalize ADMIN, VENDEDOR and CLIENTE KPI cards with equal-height grid tracks, consistent icon blocks, value wrapping and responsive breakpoints.
- Replace user initials in user listings and selected-customer summaries with the existing SVG user icon.
- Align Catalogos tables with the same table shell used by the rest of the application.
- Add configurable product imagery using a small frontend URL resolver with reference URLs and a local SVG fallback.

## Selection modal
All current select controls are replaced by a reusable lookup modal. It shows a searchable list, filters immediately while the user types, and returns the selected object with a single click. It is used for cliente, producto, marca, estado and tipo.

## Keyboard behavior
- Modal opening never autofocuses any field.
- Escape on a focused editable field with content clears it.
- A second Escape on that now-empty field removes focus.
- A third Escape closes the modal.
- If no editable field has focus, Escape closes the active modal immediately.
- Enter submits a form modal only when its Angular form is valid and not saving.
- In lookup modals, Enter chooses the sole filtered result; otherwise selection remains click-driven.
- Global notification/confirmation modals accept Enter and close with Escape.

## Modal isolation
Active modal backdrops block pointer interaction with the underlying application. Backdrop clicks do not dismiss forms or lookups. Page scrolling is disabled while a modal is open. Scrollbars inside modal content are visually hidden while wheel/touch scrolling remains available.

## Compatibility constraints
No new npm package is introduced. Existing Spring Security cookie-session behavior and all current API service contracts remain unchanged.
