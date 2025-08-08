import { ValidatorFn, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

export function passwordEqualsValidator(password: string, confirmPassword: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const form = control as FormGroup;
    const pass = form.get(password);
    const confirm = form.get(confirmPassword);

    if (pass && confirm && pass.value !== confirm.value) {
      confirm.setErrors({ passwordEqual: true });
    } else {
      confirm?.setErrors(null);
    }

    return null;
  };
}
