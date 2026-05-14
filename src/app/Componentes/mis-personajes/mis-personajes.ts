import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../Servicio/supabase';

import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-mis-personajes',
  standalone: true,
  imports: [CommonModule, RouterLink, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton],
  templateUrl: './mis-personajes.html',
  styleUrl: './mis-personajes.css',
})
export class MisPersonajes implements OnInit {
  misPersonajes: any[] = [];

  constructor(
    private supabaseService: SupabaseService,
    private cd: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    await this.cargarMisPersonajes();
  }

  async cargarMisPersonajes() {
    const { data, error } = await this.supabaseService.supabase.from('user_personajes').select('*');

    if (error) {
      console.error(error);
      alert('Error al cargar tus personajes');
      return;
    }

    this.misPersonajes = data || [];
    this.cd.detectChanges();
  }

  async eliminarPersonaje(personaje: any) {
    const { error } = await this.supabaseService.supabase
      .from('user_personajes')
      .delete()
      .eq('personaje_id', personaje.personaje_id);

    if (error) {
      console.error(error);
      alert('Error al eliminar personaje');
      return;
    }

    this.misPersonajes = this.misPersonajes.filter(
      (p) => p.personaje_id !== personaje.personaje_id,
    );

    this.cd.detectChanges();
  }

  getPersonajeImage(personaje: any): string {
    return personaje?.imagen || personaje?.image || '';
  }

  getPersonajeName(personaje: any): string {
    return personaje?.nombre || personaje?.name || 'Sin nombre';
  }

  getPersonajeStatus(personaje: any): string {
    return personaje?.estado || personaje?.status || 'Sin estado';
  }

  getPersonajeSpecies(personaje: any): string {
    return personaje?.especie || personaje?.species || 'Sin especie';
  }

  getPersonajeGender(personaje: any): string {
    return personaje?.genero || personaje?.gender || 'Sin género';
  }
}
