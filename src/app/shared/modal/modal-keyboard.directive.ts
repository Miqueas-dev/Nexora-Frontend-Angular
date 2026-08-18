import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[nxModalKeyboard]',
  standalone: true
})
export class ModalKeyboardDirective {
  @Input() nxModalSubmitEnabled = false;
  @Output() nxModalClose = new EventEmitter<void>();
  @Output() nxModalSubmit = new EventEmitter<void>();

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  @HostListener('document:keydown', ['$event'])
  handleDocumentKeydown(event: KeyboardEvent): void {
    const host = this.elementRef.nativeElement;
    if (!host.isConnected) return;

    // A child lookup or global notification modal always receives keyboard priority.
    if (document.querySelector('.nx-lookup-backdrop') || document.querySelector('.nx-modal-backdrop')) return;

    const active = document.activeElement as HTMLElement | null;

    if (event.key === 'Tab') {
      this.trapTab(host, active, event);
      return;
    }

    if (event.key === 'Escape') {
      if (active && host.contains(active) && this.isEditable(active)) {
        const field = active as HTMLInputElement | HTMLTextAreaElement;
        if (field.value.length > 0) {
          this.clearField(field);
          this.consume(event);
          return;
        }
        field.blur();
        this.consume(event);
        return;
      }

      this.nxModalClose.emit();
      this.consume(event);
      return;
    }

    if (
      event.key === 'Enter' &&
      this.nxModalSubmitEnabled &&
      active &&
      host.contains(active) &&
      !(active instanceof HTMLTextAreaElement) &&
      !(active instanceof HTMLButtonElement)
    ) {
      this.nxModalSubmit.emit();
      this.consume(event);
    }
  }

  private trapTab(host: HTMLElement, active: HTMLElement | null, event: KeyboardEvent): void {
    const focusable = Array.from(host.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    )).filter(item => item.getClientRects().length > 0);
    if (!focusable.length) { this.consume(event); return; }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!active || !host.contains(active)) {
      (event.shiftKey ? last : first).focus();
      this.consume(event);
      return;
    }
    if (event.shiftKey && active === first) { last.focus(); this.consume(event); return; }
    if (!event.shiftKey && active === last) { first.focus(); this.consume(event); }
  }

  private isEditable(element: HTMLElement): boolean {
    if (element instanceof HTMLTextAreaElement) return !element.readOnly && !element.disabled;
    if (!(element instanceof HTMLInputElement)) return false;
    return !element.readOnly && !element.disabled && !['button', 'submit', 'reset', 'checkbox', 'radio', 'file', 'hidden'].includes(element.type);
  }

  private clearField(field: HTMLInputElement | HTMLTextAreaElement): void {
    field.value = '';
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private consume(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
