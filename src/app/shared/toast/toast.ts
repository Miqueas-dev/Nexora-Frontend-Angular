import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppToast {
  readonly toast = inject(ToastService);
  readonly toasts$ = this.toast.toasts$;
}
