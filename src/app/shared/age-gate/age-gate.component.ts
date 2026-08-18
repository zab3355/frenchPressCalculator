import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Output,
  ViewChild,
} from '@angular/core';
import { AgeGateService } from '../../core/age-gate/age-gate.service';

/**
 * Modal age-verification gate. Renders a confirm/deny dialog while
 * unverified, or a persistent "access restricted" message once denied
 * (denial is a hard stop for the session — see AgeGateService). Manages
 * its own focus: the dialog receives focus on mount, and focus moves to
 * the denial message if the visitor declines.
 */
@Component({
  selector: 'app-age-gate',
  standalone: true,
  templateUrl: './age-gate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgeGateComponent implements AfterViewInit {
  readonly ageGate = inject(AgeGateService);

  @Output() readonly confirmed = new EventEmitter<void>();

  @ViewChild('confirmButton') private readonly confirmButtonRef?: ElementRef<HTMLElement>;
  @ViewChild('deniedMessage') private readonly deniedMessageRef?: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.focusCurrentState();
  }

  confirm(): void {
    this.ageGate.confirm();
    this.confirmed.emit();
  }

  deny(): void {
    this.ageGate.deny();
    setTimeout(() => this.focusCurrentState());
  }

  onDialogKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.deny();
    }
  }

  private focusCurrentState(): void {
    if (this.ageGate.status() === 'unverified') {
      this.confirmButtonRef?.nativeElement.focus();
    } else if (this.ageGate.status() === 'denied') {
      this.deniedMessageRef?.nativeElement.focus();
    }
  }
}
