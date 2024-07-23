import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../../../../../../types/employees';

export class EmployeeForm extends FormGroup {
  constructor(employee: Employee | null = null) {
    super({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', []),
      username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-z0-9_-]*$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', []),
      password: new FormControl('', [!employee ? Validators.required : Validators.nullValidator]),
      password_confirmation: new FormControl('', [!employee ? Validators.required : Validators.nullValidator]),
      image: new FormControl('', []),
      image_preview: new FormControl('', []),
      is_active: new FormControl(1, [Validators.required]),
      employee_number: new FormControl('', []),
      birthdate: new FormControl('', []),
      join_date: new FormControl('', []),
      gender: new FormControl(null, [Validators.required]),
      is_image_removed: new FormControl(0, []),
    });
  }
}
