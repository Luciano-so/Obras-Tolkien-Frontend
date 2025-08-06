import { AfterViewInit, Directive, NgZone, inject } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

export const MESSAGE_DEFAULT: { type: string; message: string }[] = [
  { type: 'required', message: 'O campo é obrigatório.' },
  { type: 'minlength', message: 'O campo deverá conter no mínimo {0} caractere(s).' },
  { type: 'maxlength', message: 'O campo deverá conter no máximo {0} caractere(s).' },
  { type: 'max', message: 'O campo deverá conter no máximo {0}.' },
  { type: 'min', message: 'O campo deverá conter no mínimo {0}.' },
];

@Directive({
  selector: '[matErrorMessages]',
  standalone: true,
  host: { '[textContent]': 'error', }
})
export class MatErrorMessagesDirective implements AfterViewInit {
  error = '';
  private input?: MatInput;

  private injector = inject(MatFormField);
  private ngZone = inject(NgZone);

  ngAfterViewInit() {
    this.input = this.injector._control as MatInput | undefined;
    this.input?.ngControl?.statusChanges?.subscribe(this.updateError);
  }

  private updateError = (state: 'VALID' | 'INVALID') => {
    this.ngZone.run(() => {
      if (state === 'INVALID' && this.input?.ngControl?.errors) {
        const errors = this.input.ngControl.errors!;
        const firstError = Object.keys(errors)[0];
        const foundMessage = MESSAGE_DEFAULT.find(m => m.type === firstError);

        if (foundMessage) {
          const msg = foundMessage.message;
          switch (foundMessage.type) {
            case 'min':
              this.error = msg.replace('{0}', errors['min'].min);
              break;
            case 'max':
              this.error = msg.replace('{0}', errors['max'].max);
              break;
            case 'minlength':
              this.error = msg.replace('{0}', errors['minlength'].requiredLength);
              break;
            case 'maxlength':
              this.error = msg.replace('{0}', errors['maxlength'].requiredLength);
              break;
            default:
              this.error = msg;
          }
        } else {
          this.error = '';
        }
      } else {
        this.error = '';
      }
    });
  };
}
