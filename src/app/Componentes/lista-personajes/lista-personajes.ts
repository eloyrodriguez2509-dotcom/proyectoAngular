import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { PersonajeService } from '../../Servicio/personajes';
import { SupabaseService } from '../../Servicio/supabase';
import { DialogService } from '../../Servicio/dialog';

import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-lista-personajes',
  imports: [
    CommonModule,
    RouterLink,

    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
  ],
  templateUrl: './lista-personajes.html',
  styleUrls: ['./lista-personajes.css'],
})
export class ListaPersonajes implements OnInit {
  personajes: any[] = [];

  constructor(
    private personajeService: PersonajeService,
    private cd: ChangeDetectorRef,
    private supabaseService: SupabaseService,
    private dialogService: DialogService,  // ← AGREGAR ESTO
  ) {}

  ngOnInit() {
    this.personajeService.getPersonajes().subscribe((data) => {
      this.personajes = data.results;
      this.cd.detectChanges();
    });
  }

  async agregarAMisPersonajes(personaje: any) {
    const {
      data: { user },
    } = await this.supabaseService.supabase.auth.getUser();

    if (!user) {
      await this.dialogService.mostrarError('Debes iniciar sesión');
      return;
    }

    // ✅ CONFIRMAR antes de agregar
    const confirmado = await this.dialogService.confirmarAgregarItem(personaje.name);
    
    if (!confirmado) {
      await this.dialogService.mostrarInfo('Operación cancelada');
      return;
    }

    // ✅ AGREGAR a Supabase
    const { error } = await this.supabaseService.supabase
      .from('user_personajes')
      .insert({
        user_id: user.id,
        personaje_id: personaje.id,
        nombre: personaje.name,
        imagen: personaje.image,
      });

    // ✅ MOSTRAR resultado
    if (error) {
      console.error(error);
      await this.dialogService.mostrarError(error.message);
    } else {
      await this.dialogService.mostrarExito('Personaje añadido a favoritos');
    }
  }
}