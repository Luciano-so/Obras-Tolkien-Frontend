import { FormGroup, FormControl } from '@angular/forms';
import { passwordEqualsValidator } from './password-equals.validation';

describe('passwordEqualsValidator', () => {
  let form: FormGroup;

  beforeEach(() => {
    form = new FormGroup({
      password: new FormControl(''),
      confirmPassword: new FormControl('')
    }, [passwordEqualsValidator('password', 'confirmPassword')]);
  });

  it('não deve setar erro quando as senhas são iguais', () => {
    form.get('password')?.setValue('abc123');
    form.get('confirmPassword')?.setValue('abc123');

    form.updateValueAndValidity();

    expect(form.get('confirmPassword')?.errors).toBeNull();
  });

  it('deve setar erro passwordEqual quando as senhas são diferentes', () => {
    form.get('password')?.setValue('abc123');
    form.get('confirmPassword')?.setValue('diferente');

    form.updateValueAndValidity();

    expect(form.get('confirmPassword')?.errors).toEqual({ passwordEqual: true });
  });

  it('deve limpar o erro passwordEqual quando senhas se tornam iguais após estarem diferentes', () => {
    form.get('password')?.setValue('abc123');
    form.get('confirmPassword')?.setValue('diferente');

    form.updateValueAndValidity();
    expect(form.get('confirmPassword')?.errors).toEqual({ passwordEqual: true });

    form.get('confirmPassword')?.setValue('abc123');
    form.updateValueAndValidity();

    expect(form.get('confirmPassword')?.errors).toBeNull();
  });
});
