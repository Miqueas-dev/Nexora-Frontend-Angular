import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Pagination } from '../pagination/pagination';

export interface LookupItem {
  id: number;
  title: string;
  subtitle?: string;
  detail?: string;
  badge?: string;
  icon?: 'user' | 'product' | 'brand' | 'state' | 'type';
}

export function filterLookupItems(items: LookupItem[], query: string): LookupItem[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return items;
  return items.filter(item =>
    `${item.title} ${item.subtitle ?? ''} ${item.detail ?? ''} ${item.badge ?? ''}`
      .toLocaleLowerCase()
      .includes(normalized)
  );
}

@Component({
  selector: 'app-lookup-modal',
  standalone: true,
  imports: [CommonModule, Pagination],
  templateUrl: './lookup-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LookupModal implements OnChanges {
  @Input() visible = false;
  @Input() title = 'Seleccionar';
  @Input() description = 'Busca y selecciona un registro.';
  @Input() searchPlaceholder = 'Escribe para filtrar...';
  @Input() emptyText = 'No se encontraron coincidencias.';
  @Input() items: LookupItem[] = [];
  @Output() selected = new EventEmitter<LookupItem>();
  @Output() closed = new EventEmitter<void>();

  query = '';
  page = 1;
  readonly pageSize = 5;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true) {
      this.query = '';
      this.page = 1;
    }
    if (changes['items']) this.clampPage();
  }

  get filteredItems(): LookupItem[] {
    return filterLookupItems(this.items, this.query);
  }

  get pagedItems(): LookupItem[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredItems.slice(start, start + this.pageSize);
  }

  get rangeStart(): number {
    return this.filteredItems.length ? (this.page - 1) * this.pageSize + 1 : 0;
  }

  get rangeEnd(): number {
    return Math.min(this.page * this.pageSize, this.filteredItems.length);
  }

  select(item: LookupItem): void { this.selected.emit(item); }
  close(): void { this.closed.emit(); }

  iconName(item: LookupItem): string {
    switch (item.icon) {
      case 'user': return 'users';
      case 'product': return 'package';
      case 'state': return 'check-circle';
      case 'type': return 'user-check';
      default: return 'inventory';
    }
  }

  updateQuery(value: string): void {
    this.query = value;
    this.page = 1;
  }

  changePage(page: number): void { this.page = page; }

  @HostListener('document:keydown', ['$event'])
  handleDocumentKeydown(event: KeyboardEvent): void {
    if (!this.visible) return;
    if (document.querySelector('.nx-modal-backdrop')) return;

    const active = document.activeElement as HTMLElement | null;
    const card = document.querySelector<HTMLElement>('.nx-lookup-card');
    const isSearchInput = active instanceof HTMLInputElement && active.closest('.nx-lookup-card') !== null;

    if (event.key === 'Tab' && card) {
      this.trapTab(card, active, event);
      return;
    }

    if (event.key === 'Escape') {
      if (isSearchInput) {
        const input = active as HTMLInputElement;
        if (input.value.length > 0) {
          input.value = '';
          this.query = '';
          this.page = 1;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          this.consume(event);
          return;
        }
        input.blur();
        this.consume(event);
        return;
      }
      this.close();
      this.consume(event);
      return;
    }

    if (event.key === 'Enter' && this.filteredItems.length === 1) {
      this.select(this.filteredItems[0]);
      this.consume(event);
    }
  }

  private clampPage(): void {
    const totalPages = Math.max(1, Math.ceil(this.filteredItems.length / this.pageSize));
    this.page = Math.min(this.page, totalPages);
  }

  private trapTab(card: HTMLElement, active: HTMLElement | null, event: KeyboardEvent): void {
    const focusable = Array.from(card.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(item => item.getClientRects().length > 0);
    if (!focusable.length) { this.consume(event); return; }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!active || !card.contains(active)) { (event.shiftKey ? last : first).focus(); this.consume(event); return; }
    if (event.shiftKey && active === first) { last.focus(); this.consume(event); return; }
    if (!event.shiftKey && active === last) { first.focus(); this.consume(event); }
  }

  private consume(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
