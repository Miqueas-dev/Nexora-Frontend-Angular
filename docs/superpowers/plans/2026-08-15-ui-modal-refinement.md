# Nexora UI and Modal Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a more professional Nexora Angular UI with corrected dashboard alignment, configurable product images, and reusable searchable selection modals.

**Architecture:** Keep the existing standalone Angular structure. Add one reusable lookup component, one modal keyboard directive, and one product image resolver. Reuse the current ModalService for notifications and confirmations.

**Tech Stack:** Angular 21, TypeScript 5.9, Bootstrap 5.3.8, RxJS 7.8, existing SVG sprite.

## Global Constraints
- Do not change backend endpoints or payloads.
- Do not add JWT or any new authentication mechanism.
- Do not add third-party UI or icon dependencies.
- Keep all existing validation rules and server-side error handling.
- Keep the existing landing page.

---

### Task 1: Modal keyboard behavior
**Files:** create `src/app/shared/modal/modal-keyboard.directive.ts`, create tests, update form-dialog templates.
- [ ] Add explicit Escape hierarchy and valid-form Enter submit behavior.
- [ ] Apply the directive to user, product and catalog form dialogs.
- [ ] Ensure modal backdrop no longer closes forms by click.

### Task 2: Reusable lookup modal
**Files:** create `src/app/shared/lookup-modal/lookup-modal.ts`, `lookup-modal.html`, tests.
- [ ] Define a typed `LookupItem` contract and real-time filter.
- [ ] Add click selection, hidden scrollbars, no autofocus and keyboard behavior.
- [ ] Replace all current `<select>` controls in users, products and new-sale screens.

### Task 3: Visual refinements
**Files:** update `src/styles.css`, login, dashboards, tables.
- [ ] Rebuild login hierarchy and credential card styling.
- [ ] Normalize all KPI card grids and responsive behavior.
- [ ] Replace user initials with SVG user icons.
- [ ] Align catalog table container, header and columns with standard tables.
- [ ] Upgrade notification and confirmation modal presentation.

### Task 4: Product imagery
**Files:** create `src/app/utils/product-image.ts`, update admin/client product templates and client dashboard.
- [ ] Provide editable reference image URLs with a local fallback.
- [ ] Render product thumbnails without altering backend models.
- [ ] Handle broken remote images safely using the fallback.

### Task 5: Verification and packaging
**Files:** update source validation script if needed and package the project.
- [ ] Run source verification and tests.
- [ ] Run Angular production build when dependencies are available.
- [ ] Verify no native alert/confirm/prompt calls and no missing icon references.
- [ ] Create a clean ZIP without `node_modules` or build output.
