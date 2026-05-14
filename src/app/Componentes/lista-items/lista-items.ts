import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService, Item } from '../../Servicio/supabase';
import { DialogService } from '../../Servicio/dialog';

import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-lista-items',
  standalone: true,
  imports: [CommonModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton],
  templateUrl: './lista-items.html',
  styleUrl: './lista-items.css',
})
export class ListaItems implements OnInit {
  items: Item[] = [];
  selectedItem: Item | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
  ) {}

  async ngOnInit() {
    await this.loadItems();
  }

  async loadItems() {
    this.items = await this.supabaseService.getItems();
    console.log('ITEMS RECIBIDOS:', this.items);
    this.cdr.detectChanges();
  }

  openPopup(item: Item) {
    this.selectedItem = item;
    this.cdr.detectChanges();
  }

  closePopup() {
    this.selectedItem = null;
    this.cdr.detectChanges();
  }

  getItemImage(item: any): string {
    return item.imagen || item.image || '';
  }

  getItemName(item: any): string {
    return item.nombre || item.description || 'Sin nombre';
  }

  getItemDescription(item: any): string {
    return item.descripcion || item.description || 'Sin descripción';
  }

  getItemNumber(item: any, index?: number): string | number {
    return (
      item.numero_item || item.numeroOriginal || item.id || (index !== undefined ? index + 1 : '?')
    );
  }

  async agregarAMisItems(item: Item, index: number) {
    const {
      data: { user },
    } = await this.supabaseService.supabase.auth.getUser();

    if (!user) {
      await this.dialogService.mostrarError('Debes iniciar sesión');
      return;
    }

    const confirmado = await this.dialogService.confirmarAgregarItem(this.getItemDescription(item));

    if (!confirmado) {
      await this.dialogService.mostrarInfo('Operación cancelada');
      return;
    }

    const { error } = await this.supabaseService.supabase.from('user_items').insert({
      user_id: user.id,
      item_id: item.id,
      nombre: this.getItemDescription(item),
    });

    if (error) {
      console.error(error);
      await this.dialogService.mostrarError(error.message);
    } else {
      await this.dialogService.mostrarExito('Item añadido correctamente');
    }
  }

  async abrirOpciones(item: Item) {
    await this.dialogService.mostrarOpciones(this.getItemDescription(item), {
      onEditar: () => {
        console.log('Editar:', item);
        this.openPopup(item);
      },
      onDuplicar: () => {
        console.log('Duplicar:', item);
      },
      onEliminar: () => {
        console.log('Eliminar:', item);
        this.confirmarEliminar(item);
      },
    });
  }

  async confirmarEliminar(item: Item) {
    const confirmado = await this.dialogService.confirmarBorrar(this.getItemDescription(item));

    if (confirmado) {
      console.log('Eliminando item:', item.id);
      await this.dialogService.mostrarExito('Item eliminado');
    }
  }
}
