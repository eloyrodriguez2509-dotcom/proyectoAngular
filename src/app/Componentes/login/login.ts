import { Component } from '@angular/core';

import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
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
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,

    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonButton
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {

  loginForm;

  constructor(
    private fb: FormBuilder,
    private auth: SupabaseService,
    private router: Router,
    private dialogService: DialogService,  // ← AGREGAR ESTO
  ) {

    this.loginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]

    });

  }

  async login() {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      await this.dialogService.mostrarAdvertencia('Por favor completa todos los campos correctamente');
      return;
    }

    const { email, password } = this.loginForm.value;

    // ✅ Mostrar que está procesando
    const loading = await this.mostrarCargando('Iniciando sesión...');

    const { error } = await this.auth.signIn(
      email!,
      password!
    );

    await loading.dismiss();

    // ✅ Mostrar resultado
    if (error) {
      console.error(error);
      await this.dialogService.mostrarError('Error al iniciar sesión. Verifica tus datos');
      return;
    }

    await this.dialogService.mostrarExito('¡Inicio de sesión exitoso!');

    // Esperar un poco para que vea el mensaje
    setTimeout(() => {
      this.router.navigate(['/personajes']);
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