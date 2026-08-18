import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../toast/toast.service';

export type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface ModalState {
  visible: boolean;
  type: ModalType;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  showCancel: boolean;
}

const CLOSED: ModalState = {
  visible: false,
  type: 'info',
  title: '',
  message: '',
  confirmText: 'Aceptar',
  cancelText: 'Cancelar',
  showCancel: false
};

@Injectable({ providedIn: 'root' })
export class ModalService {
  constructor(private toast: ToastService) {}
  private readonly stateSubject = new BehaviorSubject<ModalState>(CLOSED);
  readonly state$ = this.stateSubject.asObservable();
  get current(): ModalState { return this.stateSubject.value; }
  private resolver?: (value: boolean) => void;

  success(title: string, message: string): void { this.toast.success(title, message); }
  error(title: string, message: string): void { this.toast.error(title, message); }
  warning(title: string, message: string): void { this.toast.warning(title, message); }
  info(title: string, message: string): void { this.toast.info(title, message); }

  confirm(title: string, message: string, confirmText = 'Confirmar'): Promise<boolean> {
    this.stateSubject.next({
      visible: true,
      type: 'confirm',
      title,
      message,
      confirmText,
      cancelText: 'Cancelar',
      showCancel: true
    });
    return new Promise(resolve => this.resolver = resolve);
  }

  close(result = false): void {
    this.stateSubject.next(CLOSED);
    if (this.resolver) {
      this.resolver(result);
      this.resolver = undefined;
    }
  }

  private open(type: ModalType, title: string, message: string): void {
    this.stateSubject.next({
      visible: true,
      type,
      title,
      message,
      confirmText: 'Aceptar',
      cancelText: 'Cancelar',
      showCancel: false
    });
  }
}
