import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDescriptionsComponent } from './add-descriptions.component';

describe('AddDescriptionsComponent', () => {
  let component: AddDescriptionsComponent;
  let fixture: ComponentFixture<AddDescriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDescriptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
