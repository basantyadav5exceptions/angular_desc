import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionsDetailComponent } from './descriptions-detail.component';

describe('DescriptionsDetailComponent', () => {
  let component: DescriptionsDetailComponent;
  let fixture: ComponentFixture<DescriptionsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescriptionsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
