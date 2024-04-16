import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProductForm } from './product-form';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [NgSelectModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {
  @Input({ required: true }) form: ProductForm = new ProductForm();
  @Output() formSubmit: EventEmitter<ProductForm> = new EventEmitter<ProductForm>();

  statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
  ];

  submit() {
    this.formSubmit.emit(this.form);
  }
}
