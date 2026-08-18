import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppModal {
  readonly modal = inject(ModalService);
  readonly state$ = this.modal.state$;

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (!this.modal.current.visible) return;
    const card = document.querySelector<HTMLElement>('.nx-modal-card');
    const active = document.activeElement as HTMLElement | null;
    if (event.key === 'Tab' && card) {
      this.trapTab(card, active, event);
      return;
    }
    if (event.key === 'Escape') {
      this.modal.close(false);
      this.consume(event);
    } else if (event.key === 'Enter') {
      if (active instanceof HTMLButtonElement && card?.contains(active)) return;
      this.modal.close(true);
      this.consume(event);
    }
  }

  private trapTab(card: HTMLElement, active: HTMLElement | null, event: KeyboardEvent): void {
    const focusable = Array.from(card.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
