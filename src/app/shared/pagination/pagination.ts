import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Pagination {
  @Input() totalItems = 0;
  @Input() pageSize = 5;
  @Input() page = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number { return Math.max(1, Math.ceil(this.totalItems / this.pageSize)); }
  get pages(): number[] {
    const start = Math.max(1, Math.min(this.page - 2, this.totalPages - 4));
    const end = Math.min(this.totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
  go(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.page) return;
    this.pageChange.emit(page);
  }
}
