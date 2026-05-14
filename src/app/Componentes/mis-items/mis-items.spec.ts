import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisItems } from './mis-items';

describe('MisItems', () => {
  let component: MisItems;
  let fixture: ComponentFixture<MisItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisItems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
