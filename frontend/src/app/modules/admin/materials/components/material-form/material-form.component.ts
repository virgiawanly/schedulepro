import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Material } from '../../../../../../types/materials';
import { MaterialForm } from './material-form';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { FlatpickrModule } from '../../../../../shared/components/flatpickr/flatpickr.module';

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [NgSelectModule, ReactiveFormsModule, LucideAngularModule, FlatpickrModule],
  templateUrl: './material-form.component.html',
  styleUrl: './material-form.component.scss',
})
export class MaterialFormComponent {
  @Input({ required: true }) form: MaterialForm = new MaterialForm();
  @Input({ required: false }) material?: Material | null;
  @Output() formSubmit: EventEmitter<MaterialForm> = new EventEmitter<MaterialForm>();

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
    const materialChanges = changes['material'];
    if (materialChanges) {
      this.imagePreview = materialChanges.currentValue?.image_url ?? '';
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
