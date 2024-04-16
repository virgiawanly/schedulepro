import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatatableComponent, NgxDatatableModule, TableColumn } from '@siemens/ngx-datatable';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { Material } from '../../../../../../types/materials';
import { Pagination } from '../../../../../../types/pagination';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { MnDropdownComponent } from '../../../../../shared/components/dropdown';
import { MDModalModule } from '../../../../../shared/components/modals';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { NGXPagination } from '../../../../../shared/components/pagination';

@Component({
  selector: 'app-material-index',
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
  templateUrl: './material-index.component.html',
  styleUrl: './material-index.component.scss',
})
export class MaterialIndexComponent {
  private _unsubscribeAll$: Subject<void> = new Subject<void>();
  private _materialsSearchListener$: Subject<string> = new Subject();

  @ViewChild('materialsTable', { static: true }) materialsTable: DatatableComponent | undefined;

  isDeletingMaterial: boolean = false;
  materialToDelete: Material | null = null;

  isLoadingMaterials: boolean = false;
  materials: Material[] = [];
  materialsStatus: string = '';
  materialsSearch: string = '';
  materialsSortBy: string = '';
  materialsSortOrder: string = 'asc';
  materialsPagination: Pagination = {
    size: 10,
    totalItems: 0,
    totalPages: 0,
    page: 1,
  };

  columns: TableColumn[] = [
    { name: '', prop: 'uuid', width: 50, resizeable: false },
    { name: 'Name', prop: 'name', width: 200, resizeable: true },
    { name: 'UOM', prop: 'uom', width: 200, resizeable: true },
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
    this.getMaterials();
    this._materialsSearchListener$.pipe(debounceTime(300), takeUntil(this._unsubscribeAll$)).subscribe((search) => {
      this.materialsSearch = search;
      this.getMaterials();
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll$.next();
    this._unsubscribeAll$.complete();
  }

  getMaterials() {
    this.isLoadingMaterials = true;
    this._httpService
      .get('v1/materials', {
        headers: { 'Location-Id': 1 },
        params: {
          size: this.materialsPagination.size,
          page: this.materialsPagination.page,
          search: this.materialsSearch ?? '',
          is_active: this.materialsStatus ?? '',
          sort: this.materialsSortBy,
          order: this.materialsSortOrder,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.materials = res.data.data;
          this.materialsPagination.totalItems = res.data.total;
          this.materialsPagination.page = res.data.current_page;
          this.materialsPagination.totalPages = res.data.last_page;
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.isLoadingMaterials = false;
      });
  }

  setMaterialToDelete(material: Material) {
    this.materialToDelete = material;
  }

  deleteMaterial() {
    if (this.isDeletingMaterial || !this.materialToDelete) {
      return;
    }

    this.isDeletingMaterial = true;
    this._httpService
      .delete(`v1/materials/${this.materialToDelete?.uuid}`, { headers: { 'Location-Id': 1 } })
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message);
          this.materialsPagination.page = 1;
          this.getMaterials();
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.isDeletingMaterial = false;
      });
  }

  onPageNumberChange(pageNumber: any): void {
    this.materialsPagination.page = pageNumber;
    this.getMaterials();
  }

  onSearchMaterials(search: string) {
    this.materialsPagination.page = 1;
    this._materialsSearchListener$.next(search);
  }

  onStatusChange(status: string) {
    this.materialsPagination.page = 1;
    this.materialsStatus = status;
    this.getMaterials();
  }

  onSort(event: any) {
    const sort = event.sorts ? event.sorts[0] : null;

    if (sort) {
      this.materialsSortBy = sort.prop;
      this.materialsSortOrder = sort.dir;
    } else {
      this.materialsSortBy = '';
      this.materialsSortOrder = 'asc';
    }

    this.getMaterials();
  }
}
