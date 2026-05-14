import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaItems } from './lista-items';

describe('ListaItems', () => {
  let component: ListaItems;
  let fixture: ComponentFixture<ListaItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaItems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
