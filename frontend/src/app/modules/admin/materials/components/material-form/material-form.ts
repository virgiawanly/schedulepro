import { FormControl, FormGroup, Validators } from '@angular/forms';

export class MaterialForm extends FormGroup {
  constructor() {
    super({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', []),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      uom: new FormControl('', []),
      image: new FormControl('', []),
      image_preview: new FormControl('', []),
      is_active: new FormControl(1, [Validators.required]),
      is_image_removed: new FormControl(0, []),
    });
  }
}
