import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisPersonajes } from './mis-personajes';

describe('MisPersonajes', () => {
  let component: MisPersonajes;
  let fixture: ComponentFixture<MisPersonajes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisPersonajes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisPersonajes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
