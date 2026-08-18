# Nexora UI Polish V4 Design

## Goal
Refine the already-stable Nexora Angular frontend without changing backend contracts, authentication, roles, modal behavior, or business flows.

## Visual changes
- Remove every visible keyboard-shortcut hint while preserving Escape/Enter behavior.
- Keep the existing professional visual system and improve logged-in readability with slightly larger typography.
- Make the global operations topbar place its left copy and right account information at opposite extremes.
- Improve quick-action hover/focus contrast without darkening controls.
- Make the login more compact, preserve its content, and move a secondary `Regresar` action below the primary login button.
- Show full logged-in name and email in the sidebar; place the role badge on its own line.
- Hide browser/interface scrollbars while preserving scrolling.

## Data presentation
- Use page size 5 for administrative/history tabular lists and lookup results.
- Use page size 8 for the client product catalog.
- Reset pagination when a filter or catalog tab changes.
- Keep dashboard summary lists intentionally limited to five recent/low-stock records because they are summaries, not data-management lists.

## Data correctness
- Normalize `fecnacUsuario` to `yyyy-MM-dd` when editing so `<input type="date">` displays the exact database date whether the API returns an SQL-date string, ISO datetime, or common day/month/year representation.

## Architecture
Reuse the existing `Pagination` component. Add pagination support to `Catalogos`, `ProductosCliente`, and `LookupModal`. Add a small date-input utility and unit tests. Do not add dependencies.
