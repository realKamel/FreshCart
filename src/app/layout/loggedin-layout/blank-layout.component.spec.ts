import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedinLayoutComponent } from './blank-layout.component';

describe('LoggedinLayoutComponent', () => {
  let component: LoggedinLayoutComponent;
  let fixture: ComponentFixture<LoggedinLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggedinLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoggedinLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
