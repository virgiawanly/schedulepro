import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { CustomerForm } from '../../components/customer-form/customer-form';
import { CustomerFormComponent } from '../../components/customer-form/customer-form.component';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';

@Component({
  selector: 'app-customer-edit',
  standalone: true,
  imports: [PageTitleComponent, CustomerFormComponent],
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.scss',
})
export class CustomerEditComponent {
  isSubmitting: boolean = false;
  isLoadingCustomer: boolean = false;
  customerUuid: string | null = null;
  customerForm: CustomerForm = new CustomerForm();

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _location: Location,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    this.customerUuid = this._activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    if (this.customerUuid) {
      this.getCustomer();
    }
  }

  getCustomer() {
    this.isLoadingCustomer = true;
    this.customerForm.disable();
    this._httpService
      .get(`v1/customers/${this.customerUuid}`, { headers: { 'Location-Id': 1 } })
      .subscribe({
        next: (res: any) => {
          this.customerForm.patchValue(res.data);
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.customerForm.enable();
        this.isLoadingCustomer = false;
      });
  }

  submit() {
    this.customerForm.markAllAsTouched();

    if (this.customerForm.invalid || !this.customerUuid || this.customerForm.disabled || this.isSubmitting || this.isLoadingCustomer) {
      return;
    }

    this.isSubmitting = true;
    this.customerForm.disable();
    this._httpService
      .put(`v1/customers/${this.customerUuid}`, this.customerForm.value, {
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
