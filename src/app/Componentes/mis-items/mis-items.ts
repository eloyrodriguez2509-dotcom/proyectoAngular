import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupabaseService } from '../../Servicio/supabase';
import { DialogService } from '../../Servicio/dialog';

import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-mis-items',
  standalone: true,
  imports: [CommonModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton],
  templateUrl: './mis-items.html',
  styleUrl: './mis-items.css',
})
export class MisItems implements OnInit {
  misItems: any[] = [];
  selectedItem: any = null;
  selectedItemIndex = 0;

  constructor(
    private supabaseService: SupabaseService,
    private cd: ChangeDetectorRef,
    private dialogService: DialogService,
  ) {}

  async ngOnInit() {
    await this.cargarMisItems();
  }

  async cargarMisItems() {
    const { data, error } = await this.supabaseService.supabase.from('user_items').select(`
    id,
    user_id,
    item_id,
    nombre,
    items (
      id,
      description,
      image
    )
  `);

    if (error) {
      console.error(error);
      await this.dialogService.mostrarError('Error al cargar items');
      return;
    }

    this.misItems = (data || []).map((item: any) => ({
      ...item,
      nombre: item.items?.description || item.nombre,
      imagen: item.items?.image || '',
      descripcion: item.items?.description || item.nombre,
      numeroOriginal: item.item_id,
    }));

    this.cd.detectChanges();
  }

  openPopup(item: any, index?: number) {
    this.selectedItem = item;
    this.selectedItemIndex = index ?? 0;
    this.cd.detectChanges();
  }

  closePopup() {
    this.selectedItem = null;
    this.cd.detectChanges();
  }

  getItemImage(item: any): string {
    return item?.imagen || item?.image || '';
  }

  getItemName(item: any): string {
    return item?.nombre || item?.description || 'Sin nombre';
  }

  getItemDescription(item: any): string {
    return item?.descripcion || item?.description || 'Sin descripción';
  }

  getItemNumber(item: any, index?: number): string | number {
    return (
      item?.numero_item ||
      item?.numeroOriginal ||
      item?.item_id ||
      (index !== undefined ? index + 1 : '?')
    );
  }

  async confirmarEliminar(item: any) {
    const confirmado = await this.dialogService.confirmarBorrar(this.getItemName(item));

    if (!confirmado) {
      await this.dialogService.mostrarInfo('Operación cancelada');
      return;
    }

    await this.eliminarItem(item);
  }

  async eliminarItem(item: any) {
    const { error } = await this.supabaseService.supabase
      .from('user_items')
      .delete()
      .eq('id', item.id);

    if (error) {
      console.error(error);
      await this.dialogService.mostrarError('Error al eliminar item');
      return;
    }

    this.closePopup();
    await this.cargarMisItems();
    await this.dialogService.mostrarExito('Item eliminado de favoritos');
  }

  async abrirOpciones(item: any) {
    await this.dialogService.mostrarOpciones(this.getItemName(item), {
      onEditar: () => {
        this.openPopup(item);
      },
      onDuplicar: () => {
        console.log('Duplicar item');
      },
      onEliminar: () => {
        this.confirmarEliminar(item);
      },
    });
  }
}
