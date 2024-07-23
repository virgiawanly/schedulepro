import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialShowComponent } from './material-show.component';

describe('MaterialShowComponent', () => {
  let component: MaterialShowComponent;
  let fixture: ComponentFixture<MaterialShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialShowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaterialShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
