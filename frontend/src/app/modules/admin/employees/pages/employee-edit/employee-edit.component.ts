import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { EmployeeForm } from '../../components/employee-form/employee-form';
import { EmployeeFormComponent } from '../../components/employee-form/employee-form.component';
import { Employee } from '../../../../../../types/employees';
import moment from 'moment';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [PageTitleComponent, EmployeeFormComponent],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss',
})
export class EmployeeEditComponent {
  isSubmitting: boolean = false;
  isLoadingEmployee: boolean = false;
  employeeUuid: string | null = null;
  employeeForm: EmployeeForm = new EmployeeForm();
  employee: Employee | null = null;

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _location: Location,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    this.employeeUuid = this._activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    if (this.employeeUuid) {
      this.getEmployee();
    }
  }

  getEmployee() {
    this.isLoadingEmployee = true;
    this.employeeForm.disable();
    this._httpService
      .get(`v1/employees/${this.employeeUuid}`, { headers: { 'Location-Id': 1 } })
      .subscribe({
        next: (res: any) => {
          const formValue = {
            first_name: res.data.user?.first_name,
            last_name: res.data.user?.last_name,
            username: res.data.user?.username,
            email: res.data.user?.email,
            phone: res.data.user?.phone,
            image_preview: res.data.user?.image_url,
            is_active: res.data.user?.is_active,
            gender: res.data.user?.gender,
            employee_number: res.data.employee_number,
            join_date: res.data.join_date ? moment(res.data.join_date).format('YYYY-MM-DD') : '',
            birthdate: res.data.user?.birthdate ? moment(res.data.user?.birthdate).format('YYYY-MM-DD') : '',
          };

          this.employee = res.data;
          this.employeeForm = new EmployeeForm(this.employee);
          this.employeeForm.patchValue(formValue);
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.employeeForm.enable();
        this.isLoadingEmployee = false;
      });
  }

  submit() {
    this.employeeForm.markAllAsTouched();

    if (this.employeeForm.invalid || !this.employeeUuid || this.employeeForm.disabled || this.isSubmitting || this.isLoadingEmployee) {
      return;
    }

    const payload = this._httpService.convertToFormData({ ...this.employeeForm.value, user_id: this.employee?.user?.id });

    this.isSubmitting = true;
    this.employeeForm.disable();
    this._httpService
      .post(`v1/employees/${this.employeeUuid}`, payload, {
        headers: { 'Location-Id': 1 },
        params: {
          _method: 'PUT',
        },
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
