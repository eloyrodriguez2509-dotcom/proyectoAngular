import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../Servicio/supabase';
import { DialogService } from '../../Servicio/dialog';

import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonButton
  ],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  registroForm;

  constructor(
    private fb: FormBuilder,
    private auth: SupabaseService,
    private router: Router,
    private dialogService: DialogService,  // ← AGREGAR ESTO
  ) {
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async registro() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      await this.dialogService.mostrarAdvertencia('Por favor completa todos los campos correctamente');
      return;
    }

    const { email, password } = this.registroForm.value;

    // ✅ Mostrar que está procesando
    const loading = await this.mostrarCargando('Registrando...');

    const { error } = await this.auth.signUp(email!, password!);

    await loading.dismiss();

    // ✅ Mostrar resultado
    if (error) {
      console.error(error);
      await this.dialogService.mostrarError(error.message);
      return;
    }

    await this.dialogService.mostrarExito('¡Registro exitoso!');
    
    // Esperar un poco para que vea el mensaje
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }

  // ✅ Helper para mostrar loading
  private async mostrarCargando(mensaje: string) {
    const toast = await (this as any).dialogService.toastCtrl.create({
      message: mensaje,
      duration: 0,
      position: 'middle',
    });
    await toast.present();
    return toast;
  }
}