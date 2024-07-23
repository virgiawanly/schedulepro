import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatatableComponent, NgxDatatableModule, TableColumn } from '@siemens/ngx-datatable';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { Employee } from '../../../../../../types/employees';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { Pagination } from '../../../../../../types/pagination';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { MnDropdownComponent } from '../../../../../shared/components/dropdown';
import { MDModalModule } from '../../../../../shared/components/modals';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { NGXPagination } from '../../../../../shared/components/pagination';

@Component({
  selector: 'app-employee-index',
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
  templateUrl: './employee-index.component.html',
  styleUrl: './employee-index.component.scss',
})
export class EmployeeIndexComponent {
  private _unsubscribeAll$: Subject<void> = new Subject<void>();
  private _employeesSearchListener$: Subject<string> = new Subject();

  @ViewChild('employeesTable', { static: true }) employeesTable: DatatableComponent | undefined;

  isDeletingEmployee: boolean = false;
  employeeToDelete: Employee | null = null;

  isLoadingEmployees: boolean = false;
  employees: Employee[] = [];
  employeesStatus: string = '';
  employeesSearch: string = '';
  employeesSortBy: string = '';
  employeesSortOrder: string = 'asc';
  employeesPagination: Pagination = {
    size: 10,
    totalItems: 0,
    totalPages: 0,
    page: 1,
  };

  columns: TableColumn[] = [
    { name: '', prop: 'uuid', width: 50, resizeable: false, sortable: true },
    { name: 'Name', prop: 'name', width: 200, resizeable: true, sortable: true },
    { name: 'Employee Number', prop: 'employee_number', width: 200, resizeable: true, sortable: true },
    { name: 'Email', prop: 'email', width: 180, resizeable: true, sortable: true },
    { name: 'Phone Number', prop: 'phone', width: 180, resizeable: true, sortable: true },
    { name: 'Status', prop: 'is_active', width: 100, resizeable: true, sortable: true },
    { name: 'Action', prop: 'actions', width: 150, resizeable: true, sortable: false },
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
    this.getEmployees();
    this._employeesSearchListener$.pipe(debounceTime(300), takeUntil(this._unsubscribeAll$)).subscribe((search) => {
      this.employeesSearch = search;
      this.getEmployees();
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll$.next();
    this._unsubscribeAll$.complete();
  }

  getEmployees() {
    this.isLoadingEmployees = true;
    this._httpService
      .get('v1/employees', {
        headers: { 'Location-Id': 1 },
        params: {
          size: this.employeesPagination.size,
          page: this.employeesPagination.page,
          search: this.employeesSearch ?? '',
          is_active: this.employeesStatus ?? '',
          sort: this.employeesSortBy,
          order: this.employeesSortOrder,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.employees = res.data.data;
          this.employeesPagination.totalItems = res.data.total;
          this.employeesPagination.page = res.data.current_page;
          this.employeesPagination.totalPages = res.data.last_page;
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.isLoadingEmployees = false;
      });
  }

  setEmployeeToDelete(employee: Employee) {
    this.employeeToDelete = employee;
  }

  deleteEmployee() {
    if (this.isDeletingEmployee || !this.employeeToDelete) {
      return;
    }

    this.isDeletingEmployee = true;
    this._httpService
      .delete(`v1/employees/${this.employeeToDelete?.uuid}`, { headers: { 'Location-Id': 1 } })
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message);
          this.employeesPagination.page = 1;
          this.getEmployees();
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.isDeletingEmployee = false;
      });
  }

  onPageNumberChange(pageNumber: any): void {
    this.employeesPagination.page = pageNumber;
    this.getEmployees();
  }

  onSearchEmployees(search: string) {
    this.employeesPagination.page = 1;
    this._employeesSearchListener$.next(search);
  }

  onStatusChange(status: string) {
    this.employeesPagination.page = 1;
    this.employeesStatus = status;
    this.getEmployees();
  }

  onSort(event: any) {
    const sort = event.sorts ? event.sorts[0] : null;

    if (sort) {
      this.employeesSortBy = sort.prop;
      this.employeesSortOrder = sort.dir;
    } else {
      this.employeesSortBy = '';
      this.employeesSortOrder = 'asc';
    }

    this.getEmployees();
  }
}
