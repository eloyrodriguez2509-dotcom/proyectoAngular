import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePersonaje } from './detalle-personajes';

describe('DetallePersonaje', () => {
  let component: DetallePersonaje;
  let fixture: ComponentFixture<DetallePersonaje>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallePersonaje]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallePersonaje);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
