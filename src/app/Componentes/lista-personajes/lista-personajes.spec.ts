import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPersonajes } from './lista-personajes';

describe('ListaPersonajes', () => {
  let component: ListaPersonajes;
  let fixture: ComponentFixture<ListaPersonajes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPersonajes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPersonajes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
