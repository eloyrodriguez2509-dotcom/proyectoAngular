import { Injectable } from '@angular/core';
import {
  AlertController,
  ToastController,
  ActionSheetController,
  ModalController,
} from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
  ) {}

  // ===== ALERTAS DE CONFIRMACIÓN =====
  async confirmarAgregarItem(itemName: string): Promise<boolean> {
    const alert = await this.alertCtrl.create({
      header: '¿Agregar?',
      message: `¿Estás seguro de agregar "${itemName}"?`,
      cssClass: 'alert-custom',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button alert-cancel',
        },
        {
          text: 'Agregar',
          role: 'confirm',
          cssClass: 'alert-button alert-confirm',
          handler: () => true,
        },
      ],
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    return result.role === 'confirm';
  }

  async confirmarBorrar(itemName: string): Promise<boolean> {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar?',
      message: `¿Estás seguro de que quieres eliminar "${itemName}"?`,
      cssClass: 'alert-custom',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button alert-cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          cssClass: 'alert-button alert-danger',
          handler: () => true,
        },
      ],
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    return result.role === 'destructive';
  }

  // ===== TOASTS =====
  async mostrarExito(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: `✅ ${mensaje}`,
      duration: 2500,
      position: 'bottom',
      cssClass: 'toast-exito',
    });

    await toast.present();
  }

  async mostrarError(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: `❌ ${mensaje}`,
      duration: 3000,
      position: 'bottom',
      cssClass: 'toast-error',
    });

    await toast.present();
  }

  async mostrarInfo(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: `ℹ️ ${mensaje}`,
      duration: 2500,
      position: 'bottom',
      cssClass: 'toast-info',
    });

    await toast.present();
  }

  async mostrarAdvertencia(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: `⚠️ ${mensaje}`,
      duration: 2800,
      position: 'bottom',
      cssClass: 'toast-advertencia',
    });

    await toast.present();
  }

  // ===== ACTION SHEET =====
  async mostrarOpciones(
    itemName: string,
    handlers: {
      onEditar?: () => void;
      onDuplicar?: () => void;
      onEliminar?: () => void;
    },
  ) {
    const buttons = [];

    if (handlers.onEditar) {
      buttons.push({
        text: 'Editar',
        icon: 'pencil',
        handler: handlers.onEditar,
      });
    }

    if (handlers.onDuplicar) {
      buttons.push({
        text: 'Duplicar',
        icon: 'copy',
        handler: handlers.onDuplicar,
      });
    }

    if (handlers.onEliminar) {
      buttons.push({
        text: 'Eliminar',
        icon: 'trash',
        role: 'destructive',
        handler: handlers.onEliminar,
      });
    }

    buttons.push({
      text: 'Cancelar',
      role: 'cancel',
    });

    const actionSheet = await this.actionSheetCtrl.create({
      header: `Opciones: ${itemName}`,
      cssClass: 'actionsheet-custom',
      buttons: buttons as any,
    });

    await actionSheet.present();
  }

  // ===== MODAL =====
  async abrirModal(componente: any, datos?: any) {
    const modal = await this.modalCtrl.create({
      component: componente,
      componentProps: datos,
      cssClass: 'modal-custom',
    });

    await modal.present();
    const result = await modal.onDidDismiss();
    return result.data;
  }

  cerrarModal(datos?: any) {
    this.modalCtrl.dismiss(datos);
  }
}
