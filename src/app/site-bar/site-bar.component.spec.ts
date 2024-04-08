import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteBarComponent } from './site-bar.component';

describe('SiteBarComponent', () => {
  let component: SiteBarComponent;
  let fixture: ComponentFixture<SiteBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
