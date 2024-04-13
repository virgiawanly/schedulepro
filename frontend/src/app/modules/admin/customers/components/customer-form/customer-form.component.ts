import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerForm } from './customer-form';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [NgSelectModule, ReactiveFormsModule],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss',
})
export class CustomerFormComponent {
  @Input({ required: true }) form: CustomerForm = new CustomerForm();
  @Output() formSubmit: EventEmitter<CustomerForm> = new EventEmitter<CustomerForm>();

  statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
  ];

  submit() {
    this.formSubmit.emit(this.form);
  }
}
