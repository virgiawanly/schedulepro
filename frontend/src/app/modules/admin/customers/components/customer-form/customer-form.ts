import { FormControl, FormGroup, Validators } from '@angular/forms';

export class CustomerForm extends FormGroup {
  constructor() {
    super({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl('', []),
      address_line_1: new FormControl('', [Validators.required]),
      address_line_2: new FormControl('', []),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      zip_code: new FormControl('', [Validators.required]),
      is_active: new FormControl(1, [Validators.required]),
    });
  }
}
