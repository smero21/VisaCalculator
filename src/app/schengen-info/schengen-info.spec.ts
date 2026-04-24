import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchengenInfo } from './schengen-info';

describe('SchengenInfo', () => {
  let component: SchengenInfo;
  let fixture: ComponentFixture<SchengenInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchengenInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchengenInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
