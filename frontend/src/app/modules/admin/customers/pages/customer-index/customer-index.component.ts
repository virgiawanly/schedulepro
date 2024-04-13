import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatatableComponent, NgxDatatableModule, TableColumn } from '@siemens/ngx-datatable';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { Customer } from '../../../../../../types/customers';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { Pagination } from '../../../../../../types/pagination';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { MnDropdownComponent } from '../../../../../shared/components/dropdown';
import { MDModalModule } from '../../../../../shared/components/modals';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { NGXPagination } from '../../../../../shared/components/pagination';

@Component({
  selector: 'app-customer-index',
  standalone: true,
  imports: [
    PageTitleComponent,
    NgxDatatableModule,
    LucideAngularModule,
    NGXPagination,
    MDModalModule,
    MnDropdownComponent,
    NgSelectModule,
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './customer-index.component.html',
  styleUrl: './customer-index.component.scss',
})
export class CustomerIndexComponent {
  private _unsubscribeAll$: Subject<void> = new Subject<void>();
  private _customersSearchListener$: Subject<string> = new Subject();

  @ViewChild('customersTable', { static: true }) customersTable: DatatableComponent | undefined;

  isDeletingCustomer: boolean = false;
  customerToDelete: Customer | null = null;

  isLoadingCustomers: boolean = false;
  customers: Customer[] = [];
  customersStatus: string = '';
  customersSearch: string = '';
  customersPagination: Pagination = {
    size: 10,
    totalItems: 0,
    totalPages: 0,
    page: 1,
  };

  columns: TableColumn[] = [
    { name: '', prop: 'uuid', width: 50, resizeable: false },
    { name: 'Name', prop: 'name', width: 200, resizeable: true },
    { name: 'Email', prop: 'email', width: 180, resizeable: true },
    { name: 'Phone Number', prop: 'phone', width: 180, resizeable: true },
    { name: 'Address', prop: 'full_address', width: 200, resizeable: true },
    { name: 'Status', prop: 'is_active', width: 100, resizeable: true },
    { name: 'Action', prop: 'actions', width: 150, resizeable: true },
  ];

  statusOptions = [
    { name: 'All Status', value: '' },
    { name: 'Active', value: 1 },
    { name: 'Inactive', value: 0 },
  ];

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
  ) {}

  ngOnInit() {
    this.getCustomers();
    this._customersSearchListener$.pipe(debounceTime(300), takeUntil(this._unsubscribeAll$)).subscribe((search) => {
      this.customersSearch = search;
      this.getCustomers();
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll$.next();
    this._unsubscribeAll$.complete();
  }

  getCustomers() {
    this.isLoadingCustomers = true;
    this._httpService
      .get('v1/customers', {
        headers: { 'Location-Id': 1 },
        params: {
          size: this.customersPagination.size,
          page: this.customersPagination.page,
          search: this.customersSearch ?? '',
          is_active: this.customersStatus ?? '',
        },
      })
      .subscribe({
        next: (res: any) => {
          this.customers = res.data.data;
          this.customersPagination.totalItems = res.data.total;
          this.customersPagination.page = res.data.current_page;
          this.customersPagination.totalPages = res.data.last_page;
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.isLoadingCustomers = false;
      });
  }

  setCustomerToDelete(customer: Customer) {
    this.customerToDelete = customer;
  }

  deleteCustomer() {
    if (this.isDeletingCustomer || !this.customerToDelete) {
      return;
    }

    this.isDeletingCustomer = true;
    this._httpService
      .delete(`v1/customers/${this.customerToDelete?.uuid}`, { headers: { 'Location-Id': 1 } })
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message);
          this.customersPagination.page = 1;
          this.getCustomers();
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.isDeletingCustomer = false;
      });
  }

  onPageNumberChange(pageNumber: any): void {
    this.customersPagination.page = pageNumber;
    this.getCustomers();
  }

  onSearchCustomers(search: string) {
    this.customersPagination.page = 1;
    this._customersSearchListener$.next(search);
  }

  onStatusChange(status: string) {
    this.customersPagination.page = 1;
    this.customersStatus = status;
    this.getCustomers();
  }
}
