import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { MaterialForm } from '../../components/material-form/material-form';
import { MaterialFormComponent } from '../../components/material-form/material-form.component';

@Component({
  selector: 'app-material-create',
  standalone: true,
  imports: [PageTitleComponent, MaterialFormComponent],
  templateUrl: './material-create.component.html',
  styleUrl: './material-create.component.scss',
})
export class MaterialCreateComponent {
  isSubmitting: boolean = false;
  materialForm: MaterialForm = new MaterialForm();

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _location: Location,
    private _router: Router,
  ) {}

  submit() {
    this.materialForm.markAllAsTouched();

    if (this.materialForm.invalid || this.materialForm.disabled || this.isSubmitting) {
      return;
    }

    const payload = this._httpService.convertToFormData(this.materialForm.value);

    this.isSubmitting = true;
    this.materialForm.disable();
    this._httpService
      .post('v1/materials', payload, {
        headers: { 'Location-Id': 1 },
      })
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message);
          this._router.navigateByUrl('/admin/materials');
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.materialForm.enable();
        this.isSubmitting = false;
      });
  }

  back() {
    this._location.back();
  }
}
