import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialIndexComponent } from './material-index.component';

describe('MaterialIndexComponent', () => {
  let component: MaterialIndexComponent;
  let fixture: ComponentFixture<MaterialIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaterialIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
