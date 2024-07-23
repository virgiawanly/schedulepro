import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { CustomerForm } from '../../components/customer-form/customer-form';
import { CustomerFormComponent } from '../../components/customer-form/customer-form.component';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [PageTitleComponent, CustomerFormComponent],
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.scss',
})
export class CustomerCreateComponent {
  isSubmitting: boolean = false;
  customerForm: CustomerForm = new CustomerForm();

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _location: Location,
    private _router: Router,
  ) {}

  submit() {
    this.customerForm.markAllAsTouched();

    if (this.customerForm.invalid || this.customerForm.disabled || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.customerForm.disable();
    this._httpService
      .post('v1/customers', this.customerForm.value, {
        headers: { 'Location-Id': 1 },
      })
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message);
          this._router.navigateByUrl('/admin/customers');
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.customerForm.enable();
        this.isSubmitting = false;
      });
  }

  back() {
    this._location.back();
  }
}
