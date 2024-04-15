import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { LucideAngularModule } from 'lucide-angular';
import { Employee } from '../../../../../../types/employees';
import { EmployeeForm } from './employee-form';
import { FlatpickrModule } from '../../../../../shared/components/flatpickr/flatpickr.module';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [NgSelectModule, ReactiveFormsModule, LucideAngularModule, FlatpickrModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss',
})
export class EmployeeFormComponent implements OnChanges {
  @Input({ required: true }) form: EmployeeForm = new EmployeeForm();
  @Input({ required: false }) employee?: Employee | null;
  @Output() formSubmit: EventEmitter<EmployeeForm> = new EventEmitter<EmployeeForm>();

  imagePreview: string = '';

  genderOptions = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
  ];

  statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
  ];

  ngOnChanges(changes: SimpleChanges) {
    const employeeChanges = changes['employee'];
    if (employeeChanges) {
      this.imagePreview = employeeChanges.currentValue?.user?.image_url ?? '';
    }
  }

  submit() {
    this.formSubmit.emit(this.form);
  }

  onImageChange(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      // Set the image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);

      // Set the form value
      this.form.get('image')?.setValue(file);
      this.form.get('is_image_removed')?.setValue(0);
    }
  }

  removeImage() {
    this.imagePreview = '';
    this.form.get('image')?.setValue(null);
    this.form.get('is_image_removed')?.setValue(1);
  }
}
