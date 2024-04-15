import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { EmployeeForm } from '../../components/employee-form/employee-form';
import { EmployeeFormComponent } from '../../components/employee-form/employee-form.component';

@Component({
  selector: 'app-employee-create',
  standalone: true,
  imports: [PageTitleComponent, EmployeeFormComponent],
  templateUrl: './employee-create.component.html',
  styleUrl: './employee-create.component.scss',
})
export class EmployeeCreateComponent {
  isSubmitting: boolean = false;
  employeeForm: EmployeeForm = new EmployeeForm();

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _location: Location,
    private _router: Router,
  ) {}

  submit() {
    this.employeeForm.markAllAsTouched();

    if (this.employeeForm.invalid || this.employeeForm.disabled || this.isSubmitting) {
      return;
    }

    const payload = this._httpService.convertToFormData(this.employeeForm.value);

    this.isSubmitting = true;
    this.employeeForm.disable();
    this._httpService
      .post('v1/employees', payload, {
        headers: { 'Location-Id': 1 },
      })
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message);
          this._router.navigateByUrl('/admin/employees');
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.employeeForm.enable();
        this.isSubmitting = false;
      });
  }

  back() {
    this._location.back();
  }
}
