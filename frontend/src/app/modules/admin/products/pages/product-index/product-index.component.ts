import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatatableComponent, NgxDatatableModule, TableColumn } from '@siemens/ngx-datatable';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { Pagination } from '../../../../../../types/pagination';
import { Product } from '../../../../../../types/products';
import { MnDropdownComponent } from '../../../../../shared/components/dropdown';
import { MDModalModule } from '../../../../../shared/components/modals';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { NGXPagination } from '../../../../../shared/components/pagination';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-product-index',
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
  templateUrl: './product-index.component.html',
  styleUrl: './product-index.component.scss',
})
export class ProductIndexComponent {
  private _unsubscribeAll$: Subject<void> = new Subject<void>();
  private _productsSearchListener$: Subject<string> = new Subject();

  @ViewChild('productsTable', { static: true }) productsTable: DatatableComponent | undefined;

  isDeletingProduct: boolean = false;
  productToDelete: Product | null = null;

  isLoadingProducts: boolean = false;
  products: Product[] = [];
  productsStatus: string = '';
  productsSearch: string = '';
  productsSortBy: string = '';
  productsSortOrder: string = 'asc';
  productsPagination: Pagination = {
    size: 10,
    totalItems: 0,
    totalPages: 0,
    page: 1,
  };

  columns: TableColumn[] = [
    { name: '', prop: 'uuid', width: 50, resizeable: false },
    { name: 'Name', prop: 'name', width: 200, resizeable: true },
    { name: 'Description', prop: 'description', width: 400, resizeable: true },
    { name: 'Price', prop: 'price', width: 150, resizeable: true },
    { name: 'Status', prop: 'is_active', width: 100, resizeable: true },
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
    this.getProducts();
    this._productsSearchListener$.pipe(debounceTime(300), takeUntil(this._unsubscribeAll$)).subscribe((search) => {
      this.productsSearch = search;
      this.getProducts();
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll$.next();
    this._unsubscribeAll$.complete();
  }

  getProducts() {
    this.isLoadingProducts = true;
    this._httpService
      .get('v1/products', {
        headers: { 'Location-Id': 1 },
        params: {
          size: this.productsPagination.size,
          page: this.productsPagination.page,
          search: this.productsSearch ?? '',
          is_active: this.productsStatus ?? '',
          sort: this.productsSortBy,
          order: this.productsSortOrder,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.products = res.data.data;
          this.productsPagination.totalItems = res.data.total;
          this.productsPagination.page = res.data.current_page;
          this.productsPagination.totalPages = res.data.last_page;
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.isLoadingProducts = false;
      });
  }

  setProductToDelete(product: Product) {
    this.productToDelete = product;
  }

  deleteProduct() {
    if (this.isDeletingProduct || !this.productToDelete) {
      return;
    }

    this.isDeletingProduct = true;
    this._httpService
      .delete(`v1/products/${this.productToDelete?.uuid}`, { headers: { 'Location-Id': 1 } })
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message);
          this.productsPagination.page = 1;
          this.getProducts();
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.isDeletingProduct = false;
      });
  }

  onPageNumberChange(pageNumber: any): void {
    this.productsPagination.page = pageNumber;
    this.getProducts();
  }

  onSearchProducts(search: string) {
    this.productsPagination.page = 1;
    this._productsSearchListener$.next(search);
  }

  onStatusChange(status: string) {
    this.productsPagination.page = 1;
    this.productsStatus = status;
    this.getProducts();
  }

  onSort(event: any) {
    const sort = event.sorts ? event.sorts[0] : null;

    if (sort) {
      this.productsSortBy = sort.prop;
      this.productsSortOrder = sort.dir;
    } else {
      this.productsSortBy = '';
      this.productsSortOrder = 'asc';
    }

    this.getProducts();
  }
}
