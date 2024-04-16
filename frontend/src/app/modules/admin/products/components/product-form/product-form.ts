import { FormControl, FormGroup, Validators } from '@angular/forms';

export class ProductForm extends FormGroup {
  constructor() {
    super({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', []),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      is_active: new FormControl(1, [Validators.required]),
    });
  }
}
