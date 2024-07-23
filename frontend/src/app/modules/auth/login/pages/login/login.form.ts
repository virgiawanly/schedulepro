import { FormControl, FormGroup, Validators } from '@angular/forms';

export class LoginForm extends FormGroup {
  constructor() {
    super({
      username_or_email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }
}
